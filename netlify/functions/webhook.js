
// netlify/functions/webhook.js
export const config = { path: "/api/webhook" };
const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY;
const MOLLIE_WEBHOOK_SECRET = process.env.MOLLIE_WEBHOOK_SECRET;

// Sendcloud credentials for creating shipping labels
const SENDCLOUD_PUBLIC_KEY = process.env.SENDCLOUD_PUBLIC_KEY;
const SENDCLOUD_SECRET_KEY = process.env.SENDCLOUD_SECRET_KEY;

/*
 * Create a shipping label via Sendcloud. This function attempts to call the
 * Sendcloud parcels endpoint using the provided API credentials. In production
 * you should populate the parcel details (name, address, etc.) dynamically
 * based on the order information. For now these values act as placeholders.
 *
 * @param {string} orderId The order identifier used to set the order_number on the parcel.
 */
async function createSendcloudLabel(orderId) {
  // Abort when Sendcloud credentials are missing
  if (!SENDCLOUD_PUBLIC_KEY || !SENDCLOUD_SECRET_KEY) {
    console.warn("[SENDCLOUD] API keys not configured; skipping label creation");
    return;
  }
  try {
    // Construct the Basic Auth header
    const auth = Buffer.from(`${SENDCLOUD_PUBLIC_KEY}:${SENDCLOUD_SECRET_KEY}`).toString('base64');
    const parcelPayload = {
      parcel: {
        // TODO: populate parcel details from order data (e.g. shipping address)
        name: "Voorbeeld Naam",
        company_name: "GameShop Enter",
        address: "Zuiderstraat 17",
        postal_code: "7468 CW",
        city: "Enter",
        country: "NL",
        telephone: "+31641126067",
        email: "info@gameshopenter.nl",
        order_number: orderId
      }
    };
    const response = await fetch('https://panel.sendcloud.sc/api/v2/parcels', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parcelPayload)
    });
    const data = await response.json();
    console.log('[SENDCLOUD] Created parcel', data);
  } catch (e) {
    console.error('[SENDCLOUD] Error creating parcel:', e);
  }
}

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  if (!MOLLIE_API_KEY) {
    return new Response("Server not configured", { status: 500 });
  }
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  if (MOLLIE_WEBHOOK_SECRET && secret !== MOLLIE_WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const paymentId = form && form.get("id");
  const orderId = url.searchParams.get("order") || "unknown";

  if (!paymentId) {
    console.warn("Webhook without payment id");
    return new Response("Bad Request", { status: 400 });
  }

  try {
    const resp = await fetch("https://api.mollie.com/v2/payments/" + paymentId, {
      headers: { "Authorization": "Bearer " + MOLLIE_API_KEY }
    });
    const data = await resp.json();
    const status = data.status || "unknown";
    console.log("[WEBHOOK]", { orderId, paymentId, status });
    // TODO: persist to KV/Blob/DB here
    // Create a Sendcloud shipping label when the payment is marked as paid
    if (status === 'paid') {
      await createSendcloudLabel(orderId);
    }
    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("Webhook check failed:", e);
    return new Response("Error", { status: 500 });
  }
};
