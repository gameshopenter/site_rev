
// netlify/functions/catalog.js
export const config = { path: "/api/catalog" };
import fs from "node:fs";
import path from "node:path";

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

export default async (req, context) => {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const inventory = readInventory();

  if (slug) {
    const item = inventory.find(p => p.slug === slug || p.id === slug);
    if (!item) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "content-type": "application/json" } });
    }
    return new Response(JSON.stringify({ product: item }), { headers: { "content-type": "application/json" } });
  }

  return new Response(JSON.stringify({ products: inventory }), { headers: { "content-type": "application/json" } });
};
