# KRITARRA

An editorial jewellery storefront built with Next.js App Router, TypeScript, Tailwind CSS 4 and Motion. Static export deploys to Sites; pages remain server-rendered at build time, with isolated interactive components.

## Run

Requires Node 20.9+.

```sh
npm install
npm run dev
npm run typecheck
npm run build
```

## Brand data and launch requirements

This is a working design preview, **not a trading-ready shop**. The requested campaign photography, screenshot references, official product catalogue, prices, policies and commerce credentials were not supplied. Instagram’s public bio was accessible; campaign posts were not. No stock or generated jewellery, invented products, prices, testimonials or heritage claims are used.

- Replace the clearly labelled imagery placeholders with approved local assets in `public/images`. `Asset` accepts `src`; wire homepage campaign assets in `src/app/page.tsx` and product photos in `src/lib/catalog.ts`. The asset boxes preserve their ratios to avoid layout shifts.
- Replace the four category reference entries in `src/lib/catalog.ts` with approved real products: unique IDs/slugs, names, descriptions, INR prices, multiple photographs, variants, specifications, and numeric Shopify variant IDs. Set `preview: false` only for approved products.
- Configure `NEXT_PUBLIC_SHOPIFY_STORE_ORIGIN` to the approved `https://…myshopify.com` origin. The bag produces a Shopify cart permalink only when **every** selected item has a real price, approved product status and real numeric variant ID. Shopify handles taxes, inventory, shipping, secure payment and order confirmation. No payment credentials or fake confirmation exist here.
- Configure `NEXT_PUBLIC_CUSTOMER_ACCOUNT_URL` for the approved hosted customer account service. No authentication is simulated.
- Configure `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` to a real JSON POST subscription service that accepts `{email, consent:true}`, provides CORS for the Site origin, validates email server-side, rate-limits requests, and manages unsubscribe/double opt-in as required. Form success appears only on a successful service response. Before configuration the form explicitly reports that nothing was submitted.
- Contact and bag enquiries use the verified brand email `info@kritarra.in` through explicit `mailto:` actions. They prepare an email; the customer must send it from their own email app.
- Replace preview policies with brand-approved privacy, terms, care, shipping and return documents. Review any public bio language before public launch.
- Configure final canonical domain in `src/app/layout.tsx`; remove `robots: {index:false,follow:false}` only after approval and replacing preview content.

Wishlist and bag persist locally on the current browser, with validation of stored data. They do not sync to an account. Keyboard trapping, Escape dismissal, focus return, inert background, labelled controls, skip navigation and reduced-motion support are included.

## Art direction

Warm ivory `#F8F6F1`, champagne `#EAE0D4`, charcoal `#24211F`, taupe `#82766C`, antique gold `#AD956B`. Cormorant Garamond with Manrope. Editorial asymmetry, restrained borders, generous spacing, and one scroll-linked three-panel sequence. Design tokens live in `src/app/globals.css`.

## Sources

- Official source: https://www.instagram.com/kritarraofficial/ — public bio: Private Jeweller; Crafting Bespoke Diamonds & Rare Gemstones; Exclusive Appointments. Post imagery was unavailable to the current session.
- https://in.linkedin.com/company/kritarra — brand profile linking the same Instagram and listing info@kritarra.in.
- Visual direction references (no copied assets): https://www.bulgari.com/en-in/, https://hazoorilaljewellers.com/, https://renuoberoi.com/.

No campaign-image licensing is assumed. The two referenced screenshots were absent from the attachment.
