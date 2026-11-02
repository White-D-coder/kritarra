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

This is a working design preview, **not a trading-ready shop**. The hero and editorial sections now use authentic photographs from the user-selected Instagram posts. Original files were retrieved from public post embeds and converted to locally served responsive WebP derivatives. Approved ring/bracelet imagery, screenshot references, the official product catalogue, prices, policies and commerce credentials remain outstanding. No stock or generated jewellery, invented products, prices, testimonials or heritage claims are used.

- Hero imagery is configured in `src/components/hero.tsx`; originals and attribution are retained in `assets/hero/` and `assets/campaign/`. The opening photograph is Dcn9jVgs_Iv. The rejected De1ch5_P4xb image is excluded and its public derivatives have been removed. Hero sources omit 640px variants. The three images crossfade every eight seconds, pause on hover or keyboard focus, provide keyboard-accessible photo selection and pause controls without visible bottom icons, stop while the tab is hidden, and remain static under reduced-motion preferences.
- Replace the remaining clearly labelled imagery placeholders with approved local assets in `public/images`. `Asset` accepts `src` or a responsive `photo` from `src/lib/imagery.ts`; wire homepage campaign assets in `src/app/page.tsx` and product photos in `src/lib/catalog.ts`. The asset boxes preserve their ratios to avoid layout shifts.
- Replace the four category reference entries in `src/lib/catalog.ts` with approved real products: unique IDs/slugs, names, descriptions, INR prices, multiple photographs, variants, specifications, and numeric Shopify variant IDs. Set `preview: false` only for approved products.
- Configure `NEXT_PUBLIC_SHOPIFY_STORE_ORIGIN` to the approved `https://…myshopify.com` origin. The bag produces a Shopify cart permalink only when **every** selected item has a real price, approved product status and real numeric variant ID. Shopify handles taxes, inventory, shipping, secure payment and order confirmation. No payment credentials or fake confirmation exist here.
- Configure `NEXT_PUBLIC_CUSTOMER_ACCOUNT_URL` for the approved hosted customer account service. No authentication is simulated.
- Configure `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` to a real JSON POST subscription service that accepts `{email, consent:true}`, provides CORS for the Site origin, validates email server-side, rate-limits requests, and manages unsubscribe/double opt-in as required. Form success appears only on a successful service response. Before configuration the form explicitly reports that nothing was submitted.
- Contact and bag enquiries use the verified brand email `info@kritarra.in` through explicit `mailto:` actions. They prepare an email; the customer must send it from their own email app.
- Replace preview policies with brand-approved privacy, terms, care, shipping and return documents. Review any public bio language before public launch.
- Configure final canonical domain in `src/app/layout.tsx`; remove `robots: {index:false,follow:false}` only after approval and replacing preview content.

Wishlist and bag persist locally on the current browser, with validation of stored data. They do not sync to an account. Keyboard trapping, Escape dismissal, focus return, inert background, labelled controls, skip navigation and reduced-motion support are included.

## Homepage opening

The homepage opens with a brief KRITARRA wordmark intro once per tab session, followed by a full-width campaign slideshow without visible text. Reduced-motion visitors skip the intro and automatic slide rotation. The homepage navbar overlays the image transparently at the top and becomes ivory on scroll; other pages retain their solid navigation. The compact navbar follows the supplied reference: menu and search on the left, the wordmark centred, and account, wishlist and bag on the right. There is no announcement bar, logo tagline, lower divider, or visible bottom hero control. The same services also remain available inside Menu.

## Art direction

Warm ivory `#F8F6F1`, champagne `#EAE0D4`, charcoal `#24211F`, taupe `#82766C`, antique gold `#AD956B`. Cormorant Garamond with Manrope. Editorial asymmetry, restrained borders, generous spacing, and one scroll-linked three-panel sequence. Design tokens live in `src/app/globals.css`.

## Sources

- Official source: https://www.instagram.com/kritarraofficial/ — public bio: Private Jeweller; Crafting Bespoke Diamonds & Rare Gemstones; Exclusive Appointments. The hero opens with Dcn9jVgs_Iv, followed by DdgV82YseoM and DdDpJ8EMryv. The 12 newly supplied photographs are used across the hero, signature edit, perspective, categories, journal and social gallery. See `assets/hero/sources.json` and `assets/campaign/sources.json` for original links, dimensions and file hashes.
- https://in.linkedin.com/company/kritarra — brand profile linking the same Instagram and listing info@kritarra.in.
- Visual direction references (no copied assets): https://www.bulgari.com/en-in/, https://hazoorilaljewellers.com/, https://renuoberoi.com/.

Hero and editorial image use follows the user’s explicit instruction to use the supplied official posts. Category previews remain distinct from individual purchasable products; images do not imply verified availability or specifications. The two referenced screenshots were absent from the attachment.
