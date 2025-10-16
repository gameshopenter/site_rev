
// tools/build-images.mjs
// Usage: `node tools/build-images.mjs`
// Requires: npm i --save-dev sharp globby
import { globby } from "globby";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const manifest = {};

async function processImage(file) {
  const rel = path.relative(process.cwd(), file).replace(/\\/g, "/");
  const outDir = path.join(path.dirname(file), "_optimized");
  fs.mkdirSync(outDir, { recursive: true });

  const base = path.basename(file, path.extname(file));
  const dstAvif = path.join(outDir, base + ".avif");
  const dstWebp = path.join(outDir, base + ".webp");

  await sharp(file).avif({ quality: 62 }).toFile(dstAvif);
  await sharp(file).webp({ quality: 75 }).toFile(dstWebp);

  manifest[rel] = {
    avif: path.relative(process.cwd(), dstAvif).replace(/\\/g, "/"),
    webp: path.relative(process.cwd(), dstWebp).replace(/\\/g, "/"),
    original: rel
  };
}

const images = await globby(["images/**/*.{jpg,jpeg,png}"]);
for (const img of images) {
  try {
    await processImage(img);
    console.log("Optimized:", img);
  } catch (e) {
    console.warn("Failed:", img, e.message);
  }
}

fs.writeFileSync("images.manifest.json", JSON.stringify(manifest, null, 2));
console.log("Wrote images.manifest.json");
