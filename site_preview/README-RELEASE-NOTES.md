
# GameShop — Secure Build

Deze release bevat:
- Server-trusted catalogus endpoint: `GET /.netlify/functions/catalog` of `/api/catalog?slug=...`
- Beveiligde checkout: `POST /.netlify/functions/create-payment` of `/api/create-payment`
  - Server-side herberekening van prijzen en verzendkosten (clientprijzen worden genegeerd)
  - Gratis verzending drempel (configureerbaar)
  - Mollie integratie met redirect & webhook
- Webhook: `POST /.netlify/functions/webhook?order=...&secret=…` (secret optioneel, maar aanbevolen)
- Afbeeldingen-pipeline: `tools/build-images.mjs` (genereert AVIF/WebP + `images.manifest.json`)

## Snel starten

1. Environment variables (Netlify → Site Settings → Build & Deploy → Environment):
   - MOLLIE_API_KEY=live_xxx (of test_xxx voor test)
   - MOLLIE_WEBHOOK_SECRET=ietsLangsEnRandom
   - RETURN_URL_BASE=https://jouwdomein.nl
   - WEBHOOK_BASE=https://jouwdomein.nl
   - FREE_SHIPPING_THRESHOLD_CENTS=5000
   - SHIPPING_NL_CENTS=495
   - SHIPPING_BE_CENTS=695
   - DEFAULT_COUNTRY=NL
   - SENDCLOUD_PUBLIC_KEY=public_key_goes_here
   - SENDCLOUD_SECRET_KEY=secret_key_goes_here

   Bovenstaande SENDCLOUD-variabelen zijn nieuw in deze release. Vul ze in met je eigen
   API-sleutels van Sendcloud om automatisch verzendlabels aan te maken zodra een
   bestelling is betaald. Zonder deze waarden wordt het aanmaken van labels overgeslagen.

2. Catalogus (optioneel in client gebruiken):
   - Alle producten: `GET /api/catalog`
   - Eén product: `GET /api/catalog?slug={slug}`
   - Bron: `/data/inventory.json` (gegenereerd uit je bestaande inventaris; pas hier aan indien nodig).

3. Checkout-flow (client)
   - Stuur alleen `items: [{ id|slug, qty }]` naar `/api/create-payment`.
   - Ontvang `{ orderId, checkoutUrl }` en redirect naar `checkoutUrl`.
   - Na betaling komt gebruiker terug op `RETURN_URL_BASE/thankyou.html?order=...`

4. Webhook
   - Mollie stuurt `id` (paymentId) in `application/x-www-form-urlencoded` body naar `/api/webhook?order=...&secret=...`
   - De functie haalt status op bij Mollie en logt deze (TODO: opslag in KV/Blob/DB).

## Afbeeldingen optimaliseren

```
npm i -D sharp globby
node tools/build-images.mjs
```
Dit maakt `images/_optimized/*.avif|*.webp` en `images.manifest.json`. Gebruik dit manifest om `<picture>` + `srcset` te renderen.

## Belangrijk

- HTML is niet aangepast in deze stap om niets te breken. Sluit je frontend later aan op de endpoints.
- Voeg later opslag toe (Netlify KV/Blob/Supabase) om orders persistent te bewaren.
- CSP in `netlify.toml` moet `https://api.mollie.com` toestaan (reeds gedaan in eerdere build).

