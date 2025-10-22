
// netlify/functions/create-payment.js
export const config = { path: "/api/create-payment" };

import fs from "node:fs";
import path from "node:path";

const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY;
const WEBHOOK_BASE = process.env.WEBHOOK_BASE || "";
const RETURN_URL_BASE = process.env.RETURN_URL_BASE || "";
const FREE_SHIPPING_THRESHOLD_CENTS = parseInt(process.env.FREE_SHIPPING_THRESHOLD_CENTS || "5000", 10);
const SHIPPING_NL_CENTS = parseInt(process.env.SHIPPING_NL_CENTS || "495", 10);
const SHIPPING_BE_CENTS = parseInt(process.env.SHIPPING_BE_CENTS || "695", 10);
const DEFAULT_COUNTRY = process.env.DEFAULT_COUNTRY || "NL";

function readInventory() {
  const p = path.join(process.cwd(), "data", "inventory.json");
  try {
    const raw = fs.readFileSync(p, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
  } catch (e) {
    console.error("Failed to read inventory:", e);
  }
  return [];
}

function formatEuro(cents) {
  return (cents / 100).toFixed(2);
}

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "content-type": "application/json" } });
  }
  if (!MOLLIE_API_KEY) {
    return new Response(JSON.stringify({ error: "Server not configured: MOLLIE_API_KEY missing" }), { status: 500, headers: { "content-type": "application/json" } });
  }

  const body = await req.json().catch(() => ({}));
  const cart = Array.isArray(body.items) ? body.items : [];
  const country = (body.country || DEFAULT_COUNTRY).toUpperCase();

  const inventory = readInventory();

  let lineItems = [];
  let subtotal = 0;

  for (const row of cart) {
    // Determine the product based on ID or slug and quantity
    let key = row.id || row.slug;
    let qty = Math.max(1, parseInt(row.qty || 1, 10));
    const product = inventory.find(p => p.id === key || p.slug === key);
    if (!product) continue;
    // Use the stored price in cents and round up/down to a xx.95 ending. If price_cents is 3688 (36.88),
    // then priceEuro becomes 36.88, adjusted to 36.95 and converted back to cents (3695).
    const priceCentsRaw = parseInt(product.price_cents || 0, 10);
    // Skip invalid or zero prices
    if (priceCentsRaw <= 0) continue;
    const priceEuroRaw = priceCentsRaw / 100;
    // Always round to the nearest .95 by dropping the decimals and adding 0.95
    const adjustedEuro = Math.floor(priceEuroRaw) + 0.95;
    const price = Math.round(adjustedEuro * 100);
    lineItems.push({
      name: product.name,
      quantity: qty,
      unitPrice: price,
      total: price * qty,
      productId: product.id,
      slug: product.slug
    });
    subtotal += price * qty;
  }

  if (lineItems.length === 0) {
    return new Response(JSON.stringify({ error: "Empty or invalid cart" }), { status: 400, headers: { "content-type": "application/json" } });
  }

  // Determine shipping cost.  If the client provides a specific shippingCents value use it,
  // otherwise calculate based on subtotal and quantity (free shipping above the threshold).
  let shipping = 0;
  const threshold = FREE_SHIPPING_THRESHOLD_CENTS;
  const clientShipping = parseInt(body.shippingCents || 0, 10);
  if (!Number.isNaN(clientShipping) && clientShipping >= 0) {
    shipping = clientShipping;
  } else {
    if (subtotal < threshold) {
      // If subtotal below free‑shipping threshold and client did not provide shipping,
      // fall back to default country rates.  This preserves backwards compatibility.
      shipping = (country === "BE") ? SHIPPING_BE_CENTS : SHIPPING_NL_CENTS;
    }
  }

  const total = subtotal + shipping;
  const orderId = "ord_" + Math.random().toString(36).slice(2, 10);
  const description = "GameShop Enter — " + orderId;

  const redirectUrl = (RETURN_URL_BASE || "") + "/thankyou.html?order=" + orderId;
  const webhookUrl = (WEBHOOK_BASE || "") + "/api/webhook?order=" + orderId;

  const payload = {
    amount: { currency: "EUR", value: formatEuro(total) },
    description,
    redirectUrl,
    webhookUrl,
    metadata: {
      orderId,
      lineItems,
      shipping,
      country
    }
  };

  try {
    const resp = await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + MOLLIE_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) {
      const err = await resp.text();
      console.error("Mollie error:", err);
      return new Response(JSON.stringify({ error: "Payment provider error" }), { status: 502, headers: { "content-type": "application/json" } });
    }
    const data = await resp.json();
    return new Response(JSON.stringify({
      orderId,
      checkoutUrl: data._links && data._links.checkout ? data._links.checkout.href : null
    }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    console.error("Create payment exception:", e);
    return new Response(JSON.stringify({ error: "Payment creation failed" }), { status: 500, headers: { "content-type": "application/json" } });
  }
};
