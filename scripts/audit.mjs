import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const baseUrl=process.env.KRITARRA_TEST_URL||'http://127.0.0.1:3000';
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(baseUrl+'/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
const reports=[];fs.mkdirSync('/tmp/kritarra-audit',{recursive:true});
for(const width of [1440,1280,1024,768,390,360]){
 await page.setViewportSize({width,height:1000});await page.goto(baseUrl+'/',{waitUntil:'networkidle'});
 for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=800){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(60);}
 await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(200);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,`overflow at ${width}`);
 reports.push({width,overflow});if([1440,390,360].includes(width))await page.screenshot({path:`/tmp/kritarra-audit/home-${width}.png`,fullPage:true});
}
await page.setViewportSize({width:1440,height:1000});
await page.getByRole('button',{name:'Open navigation menu'}).click();await page.getByRole('dialog').waitFor();assert.equal(await page.locator('main').getAttribute('inert'),'');await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'detached'});
await page.getByRole('button',{name:'Open navigation menu'}).click();await page.getByRole('dialog').getByRole('button',{name:'Search',exact:true}).click();await page.getByLabel('Search creations').fill('earrings');assert.equal(await page.getByRole('dialog').locator('.product-card').count(),1);await page.getByLabel('Search creations').fill('zzzz');await page.getByText('No selections found.').waitFor();await page.keyboard.press('Escape');
await page.goto(baseUrl+'/collections/',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Rings',exact:true}).click();assert.equal(await page.locator('.product-card').count(),1);await page.getByRole('button',{name:'Save Rings to wishlist'}).click();await page.reload({waitUntil:'networkidle'});await page.getByRole('button',{name:'Open navigation menu'}).click();await page.getByRole('dialog').getByRole('button',{name:/Wishlist, 1/}).click();assert.equal(await page.getByRole('dialog').locator('.product-card').count(),1);await page.keyboard.press('Escape');
await page.goto(baseUrl+'/products/rings/',{waitUntil:'networkidle'});await page.getByRole('button',{name:'ADD TO ENQUIRY SELECTION'}).click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Increase Rings quantity'}).click();assert.equal(await page.getByLabel('Quantity',{exact:true}).innerText(),'2');assert.equal(await page.getByRole('button',{name:'ONLINE CHECKOUT NOT YET AVAILABLE'}).isDisabled(),true);assert.ok((await page.getByRole('link',{name:'ENQUIRE ABOUT YOUR SELECTION'}).getAttribute('href')).startsWith('mailto:info@kritarra.in'));await page.keyboard.press('Escape');await page.reload({waitUntil:'networkidle'});await page.getByRole('button',{name:'Open navigation menu'}).click();await page.getByRole('dialog').getByRole('button',{name:'Shopping bag, 2 selections'}).click();assert.equal(await page.getByLabel('Quantity',{exact:true}).innerText(),'2');await page.getByRole('button',{name:'Remove',exact:true}).click();await page.getByText('Your selection is currently empty.').waitFor();await page.keyboard.press('Escape');
await page.goto(baseUrl+'/',{waitUntil:'networkidle'});await page.getByLabel('YOUR EMAIL ADDRESS').fill('review@example.com');await page.getByRole('button',{name:'Subscribe to the Kritarra letter'}).click();await page.getByText('Your email has not been submitted.',{exact:false}).waitFor();
for(const route of ['/about/','/contact/','/policies/privacy/','/policies/terms/','/policies/shipping/','/policies/care/','/collections/necklaces/','/products/bracelets/']){const response=await page.goto(baseUrl+route,{waitUntil:'networkidle'});assert.equal(response.status(),200);assert.equal(await page.locator('h1').count(),1);}
await page.setViewportSize({width:390,height:844});await page.goto(baseUrl+'/products/rings/',{waitUntil:'networkidle'});await page.screenshot({path:'/tmp/kritarra-audit/product-390.png',fullPage:true});await page.getByRole('button',{name:'Open navigation menu'}).click();await page.screenshot({path:'/tmp/kritarra-audit/menu-390.png'});await page.keyboard.press('Escape');
assert.deepEqual(errors,[]);console.log(JSON.stringify({responsive:reports,flows:['navigation and Escape','search and no results','category filters','wishlist persistence','bag add/quantity/remove/persistence','checkout gate','enquiry link','newsletter truthful failure','8 supporting routes'],browserErrors:errors},null,2));
await browser.close();
