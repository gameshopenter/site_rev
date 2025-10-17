/* =============================================================
   GameShop Enter – JavaScript
   Handelt navigatie, productlijst, productdetails, winkelwagen
   en checkout via Mollie af.
============================================================= */

// Statische inventaris: fallback wanneer inventory_local.json niet beschikbaar is.
// Deze array bevat alle producten met titel, afbeelding, categorie en prijs.
const INVENTORY = [
  { "title": "Pokémon Alpha Sapphire (Loose)", "image": "images/gallery/0915BF92-4898-4CDB-8913-36E66C6CCBE0.jpeg", "category": "Nintendo 3DS", "price": 36.88, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Pokémon Omega Ruby (Complete)", "image": "images/gallery/15EC6FA7-5A21-4064-97DA-6DC4531656B2.jpeg", "category": "Nintendo 3DS", "price": 43.59, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Pokémon Emerald Version (Loose)", "image": "images/gallery/62DFD134-04B9-451C-BDA0-C16F0CF0FCEE.jpeg", "category": "Game Boy Advance", "price": 202.46, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Pokémon Platinum Version (Loose)", "image": "images/gallery/4489A3AB-0815-4783-8030-157AFEDCD950.jpeg", "category": "Nintendo DS", "price": 110.91, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Pokémon Mystery Dungeon: Explorers of Darkness (Loose)", "image": "images/gallery/A8E1596F-AA27-4507-9584-02CBB4072B45.jpeg", "category": "Nintendo DS", "price": 17.61, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Pokémon Mystery Dungeon: Explorers of Sky (Loose)", "image": "images/gallery/B2510BE4-3D1D-424A-AE94-5F71A53FE927.jpeg", "category": "Nintendo DS", "price": 93.99, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Pokémon Mystery Dungeon: Gates to Infinity (Complete)", "image": "images/gallery/95D8E630-E42D-4A3C-A50B-4CAB1A79B84C.jpeg", "category": "Nintendo 3DS", "price": 28.2, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Super Pokémon Rumble (Complete)", "image": "images/gallery/9B822AE3-3B08-482D-8181-E3599F5AC852.jpeg", "category": "Nintendo 3DS", "price": 15.34, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Pokémon Y (Loose)", "image": "images/placeholder_light_gray_block.png", "category": "Nintendo 3DS", "price": 28.19, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Pokémon Ultra Sun (Loose)", "image": "images/uploads/upload-0003.jpg", "category": "Nintendo 3DS", "price": 39.95, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Pokémon Sword (Complete)", "image": "images/gallery/A91C86FB-AF6B-4428-8E6C-5661B217C3EB.jpeg", "category": "Nintendo Switch", "price": 31.25, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Pokémon Shining Pearl (Complete)", "image": "images/products/IMG_6138.jpeg", "category": "Nintendo Switch", "price": 33.36, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Pokémon Scarlet (Complete)", "image": "images/products/IMG_6132.jpeg", "category": "Nintendo Switch", "price": 36.68, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Pokémon Mystery Dungeon: Rescue Team DX (Complete)", "image": "images/products/IMG_6139.jpeg", "category": "Nintendo Switch", "price": 35.42, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Dragon Quest XI S: Echoes of an Elusive Age – Definitive Edition (Complete)", "image": "images/placeholder_light_gray_block.png", "category": "Nintendo Switch", "price": 31.37, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Child of Light Ultimate Edition + Valiant Hearts: The Great War (Complete)", "image": "images/gallery/43D74886-163F-479A-BA1C-799A52797C4D.jpeg", "category": "Nintendo Switch", "price": 50.98, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Luigi's Mansion 3 (Complete)", "image": "images/gallery/4391E308-4F7D-411F-9FF1-0CF0B4C52B7F.jpeg", "category": "Nintendo Switch", "price": 29.6, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Fire Emblem: Three Houses (Complete)", "image": "images/gallery/4AD15CC3-5245-418C-941A-9CF8BD1ACF04.jpeg", "category": "Nintendo Switch", "price": 38.9, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Xenoblade Chronicles 2: Torna – The Golden Country (Complete)", "image": "images/gallery/4E3B6F6C-B22A-4302-8A5D-A5996DF42468.jpeg", "category": "Nintendo Switch", "price": 41.36, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Xenoblade Chronicles: Definitive Edition (Complete)", "image": "images/gallery/C94EBFFD-15FD-4996-BF2B-036652171EE3.jpeg", "category": "Nintendo Switch", "price": 35.35, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "WRC 10 (Complete)", "image": "images/gallery/7EC3A36A-0317-475A-B8F7-9CF4790E63E5.jpeg", "category": "Nintendo Switch", "price": 23.0, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "LEGO Marvel Super Heroes (Complete)", "image": "images/gallery/8188CBB8-7463-4836-AC9F-7B32F273EFDA.jpeg", "category": "Nintendo Switch", "price": 18.91, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Cars 3: Driven to Win (Complete)", "image": "images/gallery/C49434DC-6C30-4AED-A6B7-F484BE089686.jpeg", "category": "Nintendo Switch", "price": 10.32, "pricing_source": "pricecharting", "item_kind": "game" },
  // Accurate Nintendo DS games with pricing
  { "title": "Pokémon Diamond Version (Loose)", "image": "images/uploads/upload-0102.jpg", "category": "Nintendo DS", "price": 36.65, "pricing_source": "pricecharting", "item_kind": "game" },
  { "title": "Pokémon Black Version (Loose)", "image": "images/uploads/upload-0105.jpg", "category": "Nintendo DS", "price": 70.73, "pricing_source": "pricecharting", "item_kind": "game" }
];
/*
 * De volgende dataset bevat honderden Marktplaats‑producten met een prijs van
 * 0,00. Deze objecten waren aan de scriptfile toegevoegd zonder onderdeel
 * te zijn van de INVENTORY‑array, waardoor JavaScript een syntaxfout
 * veroorzaakte. Ze zijn in een block‑comment geplaatst zodat de
 * applicatie correct parseert. Indien je later deze producten wilt
 * toevoegen, zorg er dan voor dat ze binnen de INVENTORY‑array worden
 * opgenomen of laad ze dynamisch vanuit een extern bestand.
{
"title":"Marktplaats product 76","image":"images/uploads/upload-0076.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 77","image":"images/uploads/upload-0077.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 78","image":"images/uploads/upload-0078.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 79","image":"images/uploads/upload-0079.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 80","image":"images/uploads/upload-0080.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 81","image":"images/uploads/upload-0081.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 82","image":"images/uploads/upload-0082.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 83","image":"images/uploads/upload-0083.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 84","image":"images/uploads/upload-0084.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 85","image":"images/uploads/upload-0085.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 86","image":"images/uploads/upload-0086.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 87","image":"images/uploads/upload-0087.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 88","image":"images/uploads/upload-0088.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 89","image":"images/uploads/upload-0089.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 90","image":"images/uploads/upload-0090.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 91","image":"images/uploads/upload-0091.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 92","image":"images/uploads/upload-0092.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 93","image":"images/uploads/upload-0093.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 94","image":"images/uploads/upload-0094.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 95","image":"images/uploads/upload-0095.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 96","image":"images/uploads/upload-0096.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 97","image":"images/uploads/upload-0097.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 98","image":"images/uploads/upload-0098.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 99","image":"images/uploads/upload-0099.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 100","image":"images/uploads/upload-0100.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 101","image":"images/uploads/upload-0101.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 102","image":"images/uploads/upload-0102.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 103","image":"images/uploads/upload-0103.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 104","image":"images/uploads/upload-0104.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 105","image":"images/uploads/upload-0105.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 106","image":"images/uploads/upload-0106.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 107","image":"images/uploads/upload-0107.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 108","image":"images/uploads/upload-0108.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 109","image":"images/uploads/upload-0109.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 110","image":"images/uploads/upload-0110.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 111","image":"images/uploads/upload-0111.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 112","image":"images/uploads/upload-0112.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 113","image":"images/uploads/upload-0113.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 114","image":"images/uploads/upload-0114.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 115","image":"images/uploads/upload-0115.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 116","image":"images/uploads/upload-0116.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 117","image":"images/uploads/upload-0117.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 118","image":"images/uploads/upload-0118.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 119","image":"images/uploads/upload-0119.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 120","image":"images/uploads/upload-0120.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 121","image":"images/uploads/upload-0121.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 122","image":"images/uploads/upload-0122.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 123","image":"images/uploads/upload-0123.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 124","image":"images/uploads/upload-0124.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 125","image":"images/uploads/upload-0125.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 126","image":"images/uploads/upload-0126.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 127","image":"images/uploads/upload-0127.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 128","image":"images/uploads/upload-0128.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 129","image":"images/uploads/upload-0129.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 130","image":"images/uploads/upload-0130.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 131","image":"images/uploads/upload-0131.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 132","image":"images/uploads/upload-0132.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 133","image":"images/uploads/upload-0133.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 134","image":"images/uploads/upload-0134.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 135","image":"images/uploads/upload-0135.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 136","image":"images/uploads/upload-0136.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 137","image":"images/uploads/upload-0137.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 138","image":"images/uploads/upload-0138.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 139","image":"images/uploads/upload-0139.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 140","image":"images/uploads/upload-0140.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 141","image":"images/uploads/upload-0141.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 142","image":"images/uploads/upload-0142.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 143","image":"images/uploads/upload-0143.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 144","image":"images/uploads/upload-0144.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 145","image":"images/uploads/upload-0145.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 146","image":"images/uploads/upload-0146.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 147","image":"images/uploads/upload-0147.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 148","image":"images/uploads/upload-0148.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 149","image":"images/uploads/upload-0149.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 150","image":"images/uploads/upload-0150.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 151","image":"images/uploads/upload-0151.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 152","image":"images/uploads/upload-0152.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 153","image":"images/uploads/upload-0153.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 154","image":"images/uploads/upload-0154.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 155","image":"images/uploads/upload-0155.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 156","image":"images/uploads/upload-0156.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 157","image":"images/uploads/upload-0157.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 158","image":"images/uploads/upload-0158.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 159","image":"images/uploads/upload-0159.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 160","image":"images/uploads/upload-0160.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 161","image":"images/uploads/upload-0161.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 162","image":"images/uploads/upload-0162.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 163","image":"images/uploads/upload-0163.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 164","image":"images/uploads/upload-0164.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 165","image":"images/uploads/upload-0165.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 166","image":"images/uploads/upload-0166.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 167","image":"images/uploads/upload-0167.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 168","image":"images/uploads/upload-0168.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 169","image":"images/uploads/upload-0169.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 170","image":"images/uploads/upload-0170.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 171","image":"images/uploads/upload-0171.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 172","image":"images/uploads/upload-0172.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 173","image":"images/uploads/upload-0173.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 174","image":"images/uploads/upload-0174.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 175","image":"images/uploads/upload-0175.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 176","image":"images/uploads/upload-0176.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 177","image":"images/uploads/upload-0177.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 178","image":"images/uploads/upload-0178.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 179","image":"images/uploads/upload-0179.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 180","image":"images/uploads/upload-0180.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 181","image":"images/uploads/upload-0181.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 182","image":"images/uploads/upload-0182.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 183","image":"images/uploads/upload-0183.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 184","image":"images/uploads/upload-0184.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 185","image":"images/uploads/upload-0185.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 186","image":"images/uploads/upload-0186.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 187","image":"images/uploads/upload-0187.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"},
  {"title":"Marktplaats product 188","image":"images/uploads/upload-0188.jpg","category":"Marktplaats","price":0.0,"pricing_source":"marktplaats","item_kind":"game"}
*/
  // END Marktplaats imported products

// Bepaal specifieke kortingen voor een beperkt aantal producten.
// De sleutel is de slug (gegenereerd uit de titel) en de waarde is het kortingspercentage (0.10 = 10%).
// We geven slechts enkele artikelen korting om exclusiviteit te behouden.
const DISCOUNTS = {
  'pokemon-emerald-version-loose': 0.15,
  'luigi-s-mansion-3-complete': 0.10,
  'xenoblade-chronicles-2-torna-the-golden-country-complete': 0.20
};

/**
 * Genereer een unieke productbeschrijving op basis van de titel en categorie.
 * De beschrijving gebruikt enkele sleutelwoorden om sfeer en nostalgie
 * op te roepen, passend bij de verschillende Nintendo‑generaties. Voor
 * generieke producten wordt een standaardtekst teruggegeven.
 *
 * @param {string} title
 * @param {string} category
 * @returns {string}
 */
function generateDescription(title, category) {
  // Special descriptions based on keywords in the title.
  // Provide richer, more engaging descriptions for popular franchises.
  if (/pok[eé]mon/i.test(title)) {
    return `Stap in de wereld van Pokémon met <em>${title}</em>. Vang, train en strijd met je favoriete pocket monsters in een episch avontuur. Dit tweedehands exemplaar is geverifieerd en klaar voor jouw collectie.`;
  }
  if (/mario/i.test(title)) {
    return `Ga met Mario op een spannend platformavontuur in <em>${title}</em>. Spring, ren en red Prinses Peach in deze klassieker die nooit verveelt. Ons exemplaar is getest en compleet.`;
  }
  if (/zelda/i.test(title)) {
    return `Ontdek de legendarische wereld van Hyrule in <em>${title}</em>. Los puzzels op, bestrijd vijanden en ervaar een episch verhaal met Link. Dit spel is nauwkeurig gecontroleerd en klaar voor een nieuw avontuur.`;
  }
  if (/donkey\s*kong/i.test(title)) {
    return `Beleef retro platformactie met <em>${title}</em>. Help Donkey Kong en vrienden obstakels te overwinnen in dit geliefde avontuur. Ons spel is zorgvuldig getest voor uren speelplezier.`;
  }
  if (/animal\s*crossing/i.test(title)) {
    return `Ontsnap naar een vredig eiland in <em>${title}</em>. Verzamel, bouw en socialiseer met schattige bewoners in dit ontspannende spel. De cartridge is gecheckt en werkt perfect.`;
  }
  const lowerCat = (category || '').toLowerCase();
  // Beschrijving voor Nintendo Switch producten
  if (lowerCat.includes('switch')) {
    return `Beleef de magie van de moderne <strong>Nintendo Switch</strong> met <em>${title}</em>. Deze hybride console biedt zowel handheld‑plezier als docked gamen op het grote scherm. Alle games zijn zorgvuldig getest en klaar voor eindeloos speelplezier.`;
  }
  // Beschrijving voor Nintendo DS en 3DS games
  if (lowerCat.includes('3ds') || lowerCat.includes('ds')) {
    return `Herbeleef je favoriete avonturen op de <strong>${category}</strong> met <em>${title}</em>. Geniet van dubbele schermen en een ruime bibliotheek aan klassieke Nintendo‑titels. Dit tweedehands exemplaar is gecontroleerd op authenticiteit en wordt netjes verpakt verzonden.`;
  }
  // Beschrijving voor Game Boy Advance (GBA) games
  if (lowerCat.includes('game boy advance') || lowerCat.includes('gba')) {
    return `Stap terug in de tijd met <em>${title}</em> voor de <strong>Game Boy Advance</strong>. Deze retro handheld biedt kleurrijke 32‑bit graphics en onvergetelijke titels. Ons exemplaar is getest en klaar voor nostalgische speelsessies.`;
  }
  // Beschrijving voor Game Boy en Game Boy Color games
  if (lowerCat.includes('game boy') && !lowerCat.includes('advance')) {
    return `Ervaar de charme van de originele <strong>${category}</strong> met <em>${title}</em>. Perfect voor verzamelaars en liefhebbers van klassieke handheld‑games. Deze cartridge is zorgvuldig nagekeken en wordt goed verpakt verzonden.`;
  }
  // Beschrijving voor retro consoles zoals NES, SNES, N64, GameCube, Wii
  if (lowerCat.includes('n64') || lowerCat.includes('nes') || lowerCat.includes('snes') || lowerCat.includes('gamecube') || lowerCat.includes('wii')) {
    return `Ervaar een stukje Nintendo‑geschiedenis met <em>${title}</em> voor de <strong>${category}</strong>. Deze console‑klassieker staat garant voor uren plezier en nostalgie. Ons tweedehands exemplaar is technisch in orde en klaar voor een nieuw leven.`;
  }
  // Beschrijving voor trading cards
  if (lowerCat.includes('trading')) {
    return `Verzamel, ruil en speel met deze officiële Pokémon Trading Card Game producten. <em>${title}</em> is een geweldige aanvulling op je collectie. Alle kaarten zijn gecontroleerd op authenticiteit en worden zorgvuldig verpakt verzonden.`;
  }
  // Fallback generieke beschrijving
  return `Dit exemplaar van <em>${title}</em> is zorgvuldig getest op functionaliteit en authenticiteit. De getoonde afbeelding is een voorbeeld; de werkelijke staat kan licht afwijken. We verzenden elk product stevig verpakt zodat je zorgeloos kunt genieten.`;
}

const GSE = (() => {
  /**
   * Slugify a string to generate a URL‑friendly identifier.
   * @param {string} str
   * @returns {string}
   */
  function slugify(str) {
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-+|-+$)/g, '');
  }

  /**
   * Generate a deterministic pseudo‑random rating for a product based on its title.
   * Because we do not have real user reviews in this static webshop, we derive
   * a rating between 4.0 and 4.9 stars by summing the character codes of the
   * product title. The resulting rating is displayed with a star string (★ ☆)
   * and a numeric value to one decimal place.  This helps build trust with
   * shoppers by simulating review feedback without relying on external data.
   *
   * @param {string} title
   * @returns {{rating: number, stars: string}}
   */
  function generateRating(title) {
    // Sum Unicode values of each character in the title
    let sum = 0;
    for (const ch of String(title)) {
      sum += ch.charCodeAt(0);
    }
    // Map the sum to a value between 0 and 9 and offset by 4 to get 4.0–4.9
    const decimal = sum % 10;
    const rating = 4 + decimal / 10;
    // Round to the nearest whole star for the visual representation
    const fullStars = Math.round(rating);
    let starsStr = '';
    for (let i = 0; i < 5; i++) {
      starsStr += i < fullStars ? '★' : '☆';
    }
    return { rating, stars: starsStr };
  }

  /**
   * Get the shopping cart from localStorage.
   * @returns {{items: Array}}
   */
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('GSE_CART') || '{"items":[]}');
    } catch (e) {
      return { items: [] };
    }
  }

  /**
   * Save the shopping cart to localStorage.
   * @param {object} cart
   */
  function saveCart(cart) {
    localStorage.setItem('GSE_CART', JSON.stringify(cart));
  }

  /**
   * Update cart count in the navigation.
   */
  function updateCartCount() {
    const cart = getCart();
    const total = cart.items.reduce((sum, it) => sum + it.qty, 0);
    document.querySelectorAll('#cartCount').forEach(el => {
      el.textContent = total;
    });
  }

  /**
   * Normalize image paths. If the provided path starts with http(s), it is returned as‑is.
   * Otherwise the relative path is returned, trimming leading slashes.
   * If no path is provided, a placeholder image is used.
   * @param {string} p
   * @returns {string}
   */
  function fixImage(p) {
    if (!p) return 'images/placeholder_light_gray_block.png';
    const t = String(p).trim();
    if (/^(https?:)?\/\//i.test(t)) return t;
    return t.replace(/^\/+/, '');
  }

  /**
   * Add an item to the cart. The item object should include
   * title, priceCents, image, slug, category and optionally other properties.
   * @param {object} item
   */
  function addToCart(item) {
    const cart = getCart();
    const key = item.slug;
    const existing = cart.items.find(x => x.slug === key && x.priceCents === item.priceCents);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.items.push({ ...item, qty: 1 });
    }
    saveCart(cart);
    updateCartCount();
    // Optional: provide visual feedback
    alert(`${item.title} toegevoegd aan je winkelwagen.`);
  }

  /**
   * Load the product listing page. Fetches inventory and renders product cards.
   */
  async function loadProducts() {
    updateCartCount();
    let items;
    try {
      const res = await fetch('inventory_local.json', { cache: 'no-store' });
      items = await res.json();
      // Voeg dynamische uploads toe indien beschikbaar. Door UPLOAD_ITEMS
      // achteraf te concateneren blijven de originele inventarisitems intact.
      if (Array.isArray(window.UPLOAD_ITEMS)) {
        items = items.concat(window.UPLOAD_ITEMS);
      }
    } catch (err) {
      // Fallback: gebruik statische INVENTORY wanneer JSON niet beschikbaar is
      items = INVENTORY;
      // Voeg ook hier dynamische uploads toe zodat de geüploade items
      // worden getoond wanneer inventory_local.json niet wordt gevonden.
      if (Array.isArray(window.UPLOAD_ITEMS)) {
        items = items.concat(window.UPLOAD_ITEMS);
      }
    }
    // Zoek naar optionele zoekveld en categorie selectie. Als deze niet bestaan, gebruik lege objecten met defaults zodat de functie werkt zonder errors.
    const searchInput = document.getElementById('search') || { value: '', addEventListener: () => {} };
    const categorySelect = document.getElementById('category') || { value: '', addEventListener: () => {}, innerHTML: '' };
    const grid = document.getElementById('product-grid');
    // Sorteerselectie voor prijs/rating
    const sortSelect = document.getElementById('sort') || { value: '', addEventListener: () => {} };
    if (!grid) return; // geen grid aanwezig
    // Bepaal unieke categorieën en vul categorieSelect alleen als element bestaat
    // Filter de oude Marktplaatscategorie weg; alle geüploade items vallen onder de standaard productlijst
    const categories = [...new Set(items.map(it => it.category || 'Overig'))].filter(c => c !== 'Marktplaats').sort();
    if (categorySelect && categorySelect.innerHTML !== undefined) {
      categorySelect.innerHTML = '<option value="">Alle categorieën</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
    }
    // Preselect category from query parameter (cat or category) if present
    try {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('cat') || params.get('category');
      if (catParam && categorySelect) {
        const opt = Array.from(categorySelect.options).find(o => o.value === catParam);
        if (opt) {
          categorySelect.value = catParam;
        }
      }
    } catch (e) {
      // ignore if URLSearchParams not available
    }
    function render() {
      const q = searchInput.value ? searchInput.value.toLowerCase().trim() : '';
      const cat = categorySelect.value || '';
      grid.innerHTML = '';
      let filtered = items.filter(it => {
        const matchQ = !q || it.title.toLowerCase().includes(q);
        const matchC = !cat || (it.category === cat);
        return matchQ && matchC;
      });
      // Sorteer items op basis van geselecteerde optie
      const selectedSort = sortSelect.value || '';
      // Hulpfunctie om uiteindelijke prijs te berekenen met eventuele korting
      function getFinalPrice(item) {
        const raw = Number(item.price) || 0;
        const discount = DISCOUNTS[slugify(item.title)] || 0;
        const discounted = raw * (1 - discount);
        const price = Math.floor(discounted) + 0.95;
        return price;
      }
      if (selectedSort === 'price-asc') {
        filtered = filtered.slice().sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
      } else if (selectedSort === 'price-desc') {
        filtered = filtered.slice().sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
      } else if (selectedSort === 'rating-desc') {
        // Sorteer op geschatte rating (4 tot 5 random); items met hogere prijs krijgen iets hogere rating
        filtered = filtered.slice().sort((a, b) => {
          // Simuleer rating op basis van prijs (duurdere items iets hogere rating)
          const ra = 4 + (Number(a.price) % 1);
          const rb = 4 + (Number(b.price) % 1);
          return rb - ra;
        });
      }
      if (!filtered.length) {
        const p = document.createElement('p');
        p.className = 'no-results';
        p.textContent = 'Geen resultaten…';
        grid.appendChild(p);
        return;
      }
      for (const it of filtered) {
        const slug = slugify(it.title);
        // Geef een gebruikersvriendelijke titel voor geüploade items. Vervang "Marktplaats product X" door "Gebruikte game X".
        const displayTitle = (typeof it.title === 'string' && it.title.toLowerCase().startsWith('marktplaats product'))
          ? `Gebruikte game ${it.title.split(' ').pop()}`
          : it.title;
        const rawPrice = Number(it.price) || 0;
        // Standaard afgeronde prijs: eindigt op .95
        let basePrice = Math.floor(rawPrice) + 0.95;
        // Bepaal of er een specifieke korting voor dit product is
        const discount = DISCOUNTS[slug] || 0;
        let finalPrice = basePrice;
        let saleBadge = '';
        let displayOriginal = (Math.ceil(rawPrice) + 2).toFixed(2);
        if (discount > 0) {
          // Bereken afgeprijsde prijs (15% korting bijvoorbeeld) en rond weer af op .95
          const discounted = rawPrice * (1 - discount);
          finalPrice = Math.floor(discounted) + 0.95;
          saleBadge = `<span class="sale-badge">-${Math.round(discount * 100)}% korting</span>`;
        }
        // Genereer social proof statistieken
        // Gebruik een deterministische rating op basis van de titel zodat
        // dezelfde producten altijd hetzelfde aantal sterren hebben. Het
        // generateRating() hulpprogramma retourneert zowel een numerieke rating
        // (4.0–4.9) als een string met sterren (★ en ☆).  Deze benadering
        // zorgt voor consistente weergave van beoordelingen zonder externe data.
        // Generate a deterministic rating but we will not display it on product cards.
        const { rating: numericRating } = generateRating(displayTitle);
        // Random stock count to simulate inventory; ratings and review counts are hidden for a premium feel.
        const stockCount = Math.floor(Math.random() * 5) + 1;
        const card = document.createElement('article');
        card.className = 'shop-card';
        // Afbeelding tonen tenzij het een Marktplaats item is
        // De Marktplaats‑categorie is verwijderd; toon alle geüploade items als normale producten
        const isMarktplaats = false;
        // Toon een miniatuurafbeelding op de overzichtspagina.  Gebruik
        // object-fit: contain in CSS om de afbeelding netjes te tonen op een witte achtergrond.
        const dataImage = fixImage(it.image);
        const imgTag = isMarktplaats ? '' : `<img class="shop-thumb" src="${dataImage}" alt="${displayTitle}">`;
        // Conditie label
        const conditionLabel = (it.condition && it.condition.toLowerCase() === 'new') ? 'Nieuw' : 'Gebruikt';
        const badgeClass = (conditionLabel === 'Nieuw') ? 'new' : 'used';
        // Categorie label: verberg de oude Marktplaatscategorie zodat geüploade items netjes worden getoond
        const categoryLabel = (it.category && it.category !== 'Marktplaats') ? `<span class="category">${it.category}</span>` : '';
        // HTML samenstellen
        // Elke kaart bevat nu ook een beschrijvingsknop (btn-desc) en een verborgen
        // beschrijvingssectie die verschijnt na een klik op de knop.  De
        // beschrijving gebruikt een algemene tekst voor tweedehands producten.
        card.innerHTML = `
          <a href="product.html?slug=${encodeURIComponent(slug)}" class="product-thumb-link">
            ${imgTag}
          </a>
          <div class="info">
            <h3><a href="product.html?slug=${encodeURIComponent(slug)}">${displayTitle}</a></h3>
            <div class="meta">
              <span class="badge ${badgeClass}">${conditionLabel}</span>
              ${categoryLabel}
              <span class="price ${badgeClass}">€ ${finalPrice.toFixed(2)}</span>
              ${saleBadge}
              <span class="original-price">€ ${displayOriginal}</span>
            </div>
            <!-- Stock indicator only; reviews and ratings are hidden for a premium feel -->
            <div class="stock"><span class="icon">📦</span> Nog ${stockCount} op voorraad</div>
          </div>
          <div class="actions">
            <a href="product.html?slug=${encodeURIComponent(slug)}" class="btn-view">Bekijk product</a>
            <button class="btn-cart" data-slug="${slug}" data-title="${displayTitle}" data-price="${finalPrice}" data-image="${dataImage}" data-category="${it.category || ''}">🛒</button>
          </div>
        `;
        grid.appendChild(card);
        // Bind description toggle for this card.  When de 'Omschrijving' knop wordt aangeklikt,
        // wordt de beschrijvingssectie zichtbaar of verborgen.
        const descBtnEl = card.querySelector('.btn-desc');
        const descSectionEl = card.querySelector('.description-section');
        if (descBtnEl && descSectionEl) {
          descBtnEl.addEventListener('click', () => {
            const isVisible = descSectionEl.style.display === 'block';
            descSectionEl.style.display = isVisible ? 'none' : 'block';
          });
        }
      }
      // Bind add to cart buttons voor de dynamisch gegenereerde kaarten
      grid.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', e => {
          const t = e.currentTarget;
          const priceCents = Math.round(parseFloat(t.dataset.price) * 100);
          addToCart({
            title: t.dataset.title,
            priceCents,
            image: t.dataset.image,
            slug: t.dataset.slug,
            category: t.dataset.category
          });
        });
      });
    }
    // Alleen luisteraars toevoegen als elementen bestaan (anders noop)
    if (searchInput && searchInput.addEventListener) {
      searchInput.addEventListener('input', render);
    }
    if (categorySelect && categorySelect.addEventListener) {
      categorySelect.addEventListener('change', render);
    }
    // Bind sort select change
    if (sortSelect && sortSelect.addEventListener) {
      sortSelect.addEventListener('change', render);
    }
    render();
  }

  /**
   * Initialise a statically rendered product listing page.
   * Attaches event listeners to search and category controls to
   * filter visible cards, and binds add‑to‑cart buttons. This
   * variant does not fetch inventory from JSON but operates on
   * cards already present in the DOM.
   */
  function initStaticProductPage() {
    updateCartCount();
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    // Show/hide cards based on search and category
    function applyFilters() {
      const q = searchInput && searchInput.value ? searchInput.value.toLowerCase().trim() : '';
      const cat = categorySelect && categorySelect.value ? categorySelect.value : '';
      const cards = grid.querySelectorAll('article.shop-card');
      let visible = 0;
      cards.forEach(card => {
        const titleEl = card.querySelector('h3');
        const categoryEl = card.querySelector('.category');
        const title = titleEl ? titleEl.textContent.toLowerCase() : '';
        const cardCat = categoryEl ? categoryEl.textContent : '';
        const matchQ = !q || title.includes(q);
        const matchC = !cat || cardCat === cat;
        if (matchQ && matchC) {
          card.style.display = '';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });
      // Manage no results message
      let noRes = grid.querySelector('.no-results-static');
      if (!noRes) {
        noRes = document.createElement('p');
        noRes.className = 'no-results no-results-static';
        noRes.textContent = 'Geen resultaten…';
        grid.appendChild(noRes);
      }
      noRes.style.display = visible === 0 ? '' : 'none';
    }
    // Preselect category from URL query parameter if provided
    try {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('cat') || params.get('category');
      if (catParam && categorySelect) {
        // Only set if matches an existing option value
        const opt = Array.from(categorySelect.options).find(o => o.value === catParam);
        if (opt) {
          categorySelect.value = catParam;
        }
      }
    } catch (e) {
      // ignore
    }
    // Bind search and category events
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categorySelect) categorySelect.addEventListener('change', applyFilters);
    // Bind add-to-cart buttons on static cards
    grid.querySelectorAll('.btn-cart').forEach(btn => {
      btn.addEventListener('click', e => {
        const t = e.currentTarget;
        const priceCents = Math.round(parseFloat(t.dataset.price) * 100);
        addToCart({
          title: t.dataset.title,
          priceCents,
          image: t.dataset.image,
          slug: t.dataset.slug,
          category: t.dataset.category || ''
        });
      });
    });
    // Apply initial filters on page load
    applyFilters();
  }

  /**
   * Load the product detail page based on slug in query string.
   */
  async function loadProductDetail() {
    updateCartCount();
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const container = document.getElementById('product-detail');
    if (!slug) {
      container.textContent = 'Product niet gevonden.';
      return;
    }
    let items = INVENTORY;
    try {
      const res = await fetch('inventory_local.json', { cache: 'no-store' });
      // alleen overschrijven wanneer het resultaat ok is
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length) {
          items = json;
        }
      }
      // Voeg dynamische uploads toe indien beschikbaar
      if (Array.isArray(window.UPLOAD_ITEMS)) {
        items = (items || []).concat(window.UPLOAD_ITEMS);
      }
    } catch (err) {
      // negeer fout en gebruik fallback
      // Voeg wel dynamische items toe bij fallback naar INVENTORY
      if (Array.isArray(window.UPLOAD_ITEMS)) {
        items = (items || []).concat(window.UPLOAD_ITEMS);
      }
    }
    const item = (items || []).find(it => slugify(it.title) === slug);
    if (!item) {
      container.textContent = 'Product niet gevonden.';
      return;
    }
    // Bepaal ruwe prijs en eventuele specifieke korting voor dit product
    const rawPrice = Number(item.price) || 0;
    const slugName = slugify(item.title);
    const discount = DISCOUNTS[slugName] || 0;
    // Basisprijs afgerond op .95
    let price = Math.floor(rawPrice) + 0.95;
    const originalPriceDetail = (Math.ceil(rawPrice) + 2).toFixed(2);
    if (discount > 0) {
      const discounted = rawPrice * (1 - discount);
      price = Math.floor(discounted) + 0.95;
    }
    const priceCents = Math.round(price * 100);
    // Determine if this product originates from Marktplaats. For such items we hide the image and
    // provide a link to the external listing rather than our generic description.
    // Behandel alle items als reguliere producten; de Marktplaats‑categorie is verwijderd
    const isMarktplaatsItem = false;
    // Bouw product HTML. Gebruik een gebruikersvriendelijke titel voor geüploade items
    const displayTitle = (typeof item.title === 'string' && item.title.toLowerCase().startsWith('marktplaats product'))
      ? `Gebruikte game ${item.title.split(' ').pop()}`
      : item.title;
    // Build a list of images for the gallery.  If a gallery array is present on the item
    // use that, otherwise fall back to a single‑element array containing the primary image.
    // Build a list of images for the gallery.  If a gallery array is present on the item use that,
    // otherwise fall back to a single‑element array containing the primary image.  When a
    // combined image (front+back) is available it should appear as the first entry in the gallery.
    let imageList = Array.isArray(item.gallery) && item.gallery.length ? item.gallery.slice() : [item.image];
    if (item.combined_image) {
      const combined = item.combined_image;
      if (!imageList.includes(combined)) {
        imageList.unshift(combined);
      } else {
        const idx = imageList.indexOf(combined);
        if (idx > 0) {
          imageList.splice(idx, 1);
          imageList.unshift(combined);
        }
      }
    }
    // Build wrapper div with category-specific class placeholder. The class will be added later via JS
    let detailHtml = '<div class="product-detail-wrapper">';
    // Render an image gallery: primary image and optional thumbnails.  Users can click
    // thumbnails to update the main image.  If only a single image is present the
    // thumbnails list will be empty.
    detailHtml += `
        <div class="product-detail-image">
          <div class="product-gallery">
            <img id="main-product-image" src="${fixImage(imageList[0])}" alt="${displayTitle}">
            <div class="thumbnail-list">
              ${imageList.map((img, idx) => `
                <img src="${fixImage(img)}" alt="${displayTitle} thumbnail ${idx + 1}" class="thumbnail" data-index="${idx}">
              `).join('')}
            </div>
          </div>
        </div>
      `;
    detailHtml += '<div class="product-detail-info">';
    detailHtml += `<h2>${displayTitle}</h2>`;
    // Toon prijs met eventuele korting en originele prijs
    if (discount > 0) {
      const pct = Math.round(discount * 100);
      detailHtml += `<p class="price">€ ${price.toFixed(2)} <span class="sale-badge">-${pct}% korting</span> <span class="original-price">€ ${originalPriceDetail}</span></p>`;
    } else {
      detailHtml += `<p class="price">€ ${price.toFixed(2)}</p>`;
    }
    // Genereer en toon een pseudo‑rating voor het product.  Deze combineert
    // een reeks sterren met de numerieke waarde, zodat bezoekers een indruk
    // krijgen van de kwaliteit op basis van vergelijkbare aankopen.  Het
    // gebruik van een vaste titelgebaseerde algoritme garandeert dat de
    // rating consistent blijft tussen sessies.
    // Rating display removed on product detail page for a cleaner, premium look

    // Display shipping and return information to reduce purchase hesitation
    if (!isMarktplaatsItem) {
      // Shipping info including clear mention of return costs: up to 4 games as a brievenbuspakket (€3,99), 5+ games as pakket (€6,95)
      // We emphasise a 14‑dagen bedenktijd; return shipping costs are borne by the customer
      detailHtml += `<p class="shipping-info"><span class="icon">🚚</span> Verzendkosten: €3,99 (tot 4 games) / €6,95 (5+ games) · Voor 23:59 besteld, morgen verzonden · <span class="icon">↩️</span> 14 dagen bedenktijd – retourkosten voor eigen rekening</p>`;
    }

    // Declare description variable in outer scope so it can be referenced by
    // subsequent FAQ construction.  It will be assigned only for regular items.
    let description = '';
    if (isMarktplaatsItem) {
      // Provide an informative message and link to the Marktplaats listing
      detailHtml += `<p class="description">Dit product is afkomstig uit onze Marktplaats‑advertenties. Voor meer informatie en foto's verwijzen we je naar de originele advertentie.</p>`;
      if (item.listing_url) {
        const safeUrl = encodeURI(item.listing_url);
        detailHtml += `<p><a href="${safeUrl}" target="_blank" rel="noopener" class="btn">Bekijk advertentie</a></p>`;
      }
    } else {
      // Toon een conditielabel voor tweedehands producten
      detailHtml += '<p class="condition">Gebruikt – voorbeeldfoto</p>';
      // Genereer een unieke beschrijving op basis van titel en categorie.  De
      // beschrijving wordt niet direct getoond maar komt terug als onderdeel
      // van de FAQ‑sectie, zodat de productinformatie compact blijft.
      description = generateDescription(displayTitle, item.category);
      // Trust badges: security, payment, satisfaction guarantee, free shipping
      detailHtml += `<div class="trust-badges">
        <div class="badge-item"><span class="badge-icon">🔒</span><span>Veilige SSL‑betaling</span></div>
        <div class="badge-item"><span class="badge-icon">⏱️</span><span>14 dagen bedenktijd</span></div>
        <div class="badge-item"><span class="badge-icon">📦</span><span>Gratis verzending vanaf €100</span></div>
      </div>`;
      // Varianten tonen: zoek naar andere varianten van dit product (bijv. Loose vs Met doos)
      (function() {
        try {
          const baseTitle = item.title.replace(/\s*\(.*?\)\s*$/, '').trim();
          // Filter items met hetzelfde basistitel (na verwijderen van haakjes)
          const variants = (items || []).filter(v => {
            const vBase = v.title.replace(/\s*\(.*?\)\s*$/, '').trim();
            return slugify(vBase) === slugify(baseTitle);
          });
          if (variants.length > 1) {
            detailHtml += '<div class="variants"><h4>Beschikbare varianten</h4><ul class="variant-list">';
            variants.forEach(v => {
              const vSlug = slugify(v.title);
              const rawP = Number(v.price) || 0;
              const vPrice = Math.floor(rawP) + 0.95;
              let varName = 'Met doos';
              if (/\(\s*Loose\s*\)/i.test(v.title) || /\bLoose\b/i.test(v.title)) {
                varName = 'Losse cartridge';
              } else if (/Not\s*For\s*Resale/i.test(v.title)) {
                varName = 'Not For Resale';
              }
              detailHtml += `<li><a href="product.html?slug=${encodeURIComponent(vSlug)}">${varName} – € ${vPrice.toFixed(2)}</a></li>`;
            });
            detailHtml += '</ul></div>';
          }
        } catch (e) {
          console.error('Variant detection failed', e);
        }
      })();

      detailHtml += '<button id="add-to-cart-detail" class="btn btn-primary">In winkelwagen</button>';
    }
    detailHtml += '</div>';
    detailHtml += '</div>';
    container.innerHTML = detailHtml;

    // Apply a category-specific class to the product detail wrapper to enable themed backgrounds
    const wrapper = container.querySelector('.product-detail-wrapper');
    if (wrapper && item.category) {
      // Generate a slug from the category to form a valid CSS class
      const catSlug = slugify(item.category);
      wrapper.classList.add('cat-' + catSlug);
    }

    // Initialise gallery thumbnail behaviour.  If a gallery contains multiple
    // images, clicking on a thumbnail updates the main product image.  The
    // active thumbnail receives an `active` class for basic styling.
    const mainImgEl = document.getElementById('main-product-image');
    if (mainImgEl && imageList.length > 1) {
      const thumbEls = container.querySelectorAll('.thumbnail');
      // Highlight the first thumbnail by default
      if (thumbEls.length) {
        thumbEls[0].classList.add('active');
      }
      thumbEls.forEach(th => {
        th.addEventListener('click', () => {
          const idx = parseInt(th.dataset.index);
          // Update main image source
          mainImgEl.src = fixImage(imageList[idx]);
          // Reset active state on all thumbnails then set current
          thumbEls.forEach(t => t.classList.remove('active'));
          th.classList.add('active');
        });
      });
    }
    // Append FAQ section for common questions to reduce hesitation
    if (!isMarktplaatsItem) {
      const faq = document.createElement('details');
      faq.className = 'faq-section';
      // Plaats de unieke productbeschrijving als een onderdeel van de FAQ.
      // Hierdoor wordt de productomschrijving alleen zichtbaar wanneer de
      // bezoeker de veelgestelde vragen uitklapt.  De overige vragen blijven
      // algemeen om twijfel weg te nemen over verzending, authenticiteit en
      // retourneren.
      faq.innerHTML = `
        <summary>Veelgestelde vragen</summary>
        <ul>
          <li><strong>Wat is de omschrijving van dit product?</strong> ${description}</li>
          <li><strong>Wanneer wordt mijn bestelling verzonden?</strong> Bestel je voor 23:59, dan verzenden wij je game de volgende werkdag.</li>
          <li><strong>Zijn de producten origineel?</strong> Ja, wij verkopen uitsluitend originele Nintendo‑producten die grondig getest zijn.</li>
          <li><strong>Wat is de staat van het product?</strong> Al onze games en consoles zijn gebruikt maar door ons getest op functionaliteit en authenticiteit. De staat kan variëren.</li>
          <li><strong>Kan ik retourneren?</strong> Je hebt 14 dagen bedenktijd en kunt zonder opgaaf van reden retourneren.</li>
        </ul>
      `;
      container.querySelector('.product-detail-info').appendChild(faq);
    }
    // Bind add to cart only when the button exists (not for Marktplaats items)
    const btnAdd = document.getElementById('add-to-cart-detail');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        addToCart({ title: displayTitle, priceCents, image: fixImage(item.image), slug, category: item.category || '' });
      });
    }
    // Create sticky add‑to‑cart bar at bottom of screen for quick checkout on product pages
    // Remove existing bar if present
    const existingSticky = document.getElementById('sticky-add');
    if (existingSticky) existingSticky.remove();
    if (!isMarktplaatsItem) {
      const sticky = document.createElement('div');
      sticky.id = 'sticky-add';
      sticky.className = 'sticky-add';
      sticky.innerHTML = `
        <span class="sticky-title">${displayTitle}</span>
        <span class="sticky-price">€ ${price.toFixed(2)}</span>
        <button class="btn btn-primary">In winkelwagen</button>
      `;
      document.body.appendChild(sticky);
      sticky.querySelector('button').addEventListener('click', () => {
        addToCart({ title: displayTitle, priceCents, image: fixImage(item.image), slug, category: item.category || '' });
      });
    }
    // Render related products if a container exists
    renderRelatedProducts(slug, item.category || '');
  }

  /**
   * Render the cart page.
   */
  function loadCartPage() {
    updateCartCount();
    const container = document.getElementById('cart-items');
    // Locate the container for totals.  Depending on the HTML structure this may be
    // either a span with id cart-total or a div with id cart-total-container.
    let totalEl = document.getElementById('cart-total');
    if (!totalEl) totalEl = document.getElementById('cart-total-container');
    const checkoutBtn = document.getElementById('cart-checkout');
    const cart = getCart();
    container.innerHTML = '';
    if (!cart.items.length) {
      container.innerHTML = '<p>Je winkelwagen is leeg.</p>';
      totalEl.textContent = '€0,00';
      return;
    }
    cart.items.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${fixImage(it.image)}" alt="${it.title}">
        <div class="cart-item-info">
          <div>${it.title}</div>
          <div>€ ${(it.priceCents / 100).toFixed(2)}</div>
        </div>
        <div class="cart-item-controls">
          <button data-idx="${idx}" data-delta="-1">−</button>
          <span>${it.qty}</span>
          <button data-idx="${idx}" data-delta="1">+</button>
          <button data-idx="${idx}" data-delta="delete">×</button>
        </div>
      `;
      container.appendChild(row);
    });
    // Update total with shipping.  Compute subtotal in cents
    let subtotalCents = cart.items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);
    // Determine total quantity of items to calculate shipping bands
    const totalItems = cart.items.reduce((sum, it) => sum + it.qty, 0);
    // Calculate shipping based on number of items and free‑shipping threshold (€100)
    let shippingCents = 0;
    if (subtotalCents < 10000) {
      shippingCents = totalItems <= 4 ? 399 : 695;
    }
    const totalCents = subtotalCents + shippingCents;
    // Display subtotal, shipping and total in a tidy format
    const subtotalDisplay = (subtotalCents / 100).toFixed(2);
    const shippingDisplay = (shippingCents / 100).toFixed(2);
    const totalDisplay = (totalCents / 100).toFixed(2);
    totalEl.innerHTML = `Subtotaal: € ${subtotalDisplay}<br>Verzendkosten: € ${shippingDisplay}<br><strong>Totaal: € ${totalDisplay}</strong>`;
    // Bind quantity buttons
    container.querySelectorAll('.cart-item-controls button').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = parseInt(btn.dataset.idx);
        const delta = btn.dataset.delta;
        if (delta === 'delete') {
          cart.items.splice(idx, 1);
        } else {
          const d = parseInt(delta);
          cart.items[idx].qty += d;
          if (cart.items[idx].qty <= 0) cart.items.splice(idx, 1);
        }
        saveCart(cart);
        loadCartPage();
      });
    });
    // Checkout handler
    checkoutBtn.onclick = async () => {
      if (!cart.items.length) {
        alert('Je winkelwagen is leeg.');
        return;
      }
      // Verzamel verzendgegevens uit het formulier
      const form = document.getElementById('shipping-form');
      if (!form) {
        alert('Het verzendformulier kon niet worden gevonden.');
        return;
      }
      const customer = {};
      // Verzamel alle inputwaarden
      ['firstName','lastName','email','street','postalCode','city','country'].forEach(field => {
        const input = form.querySelector(`[name="${field}"]`) || form.querySelector(`#${field}`);
        if (input) {
          customer[field] = input.value.trim();
        }
      });
      // Controleer op verplichte velden
      const missing = Object.keys(customer).filter(k => !customer[k]);
      if (missing.length) {
        alert('Vul alle verplichte verzendgegevens in voordat je afrekent.');
        return;
      }
      // Prepare payload for Mollie
      const payload = {
        items: cart.items.map(it => ({
          title: it.title,
          priceCents: it.priceCents,
          qty: it.qty,
          image: it.image,
          slug: it.slug,
          category: it.category || ''
        })),
        customer
        , shippingCents
      };
      try {
        const response = await fetch('/api/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.checkoutUrl) {
          // Clear cart after sending to payment page
          // Optionally only clear after success via webhook
          saveCart({ items: [] });
          window.location.href = data.checkoutUrl;
        } else {
          alert('Er is iets misgegaan bij het starten van de betaling.');
        }
      } catch (err) {
        alert('Er is iets misgegaan bij het starten van de betaling.');
      }
    };
  }

  /**
   * Initialise the home page marquee slider. This function loads a selection of
   * products (excluding Marktplaats‑items and placeholders) and constructs
   * a horizontally scrolling track that loops indefinitely. Each image
   * links to the corresponding product detail page. If the marquee
   * container is not present on the page, the function exits silently.
   */
  async function loadHomeMarquee() {
    const track = document.getElementById('marquee-track');
    if (!track) return;
    let items;
    try {
      const res = await fetch('inventory_local.json', { cache: 'no-store' });
      items = await res.json();
    } catch (err) {
      items = INVENTORY;
    }
    items = items || INVENTORY;
    // Filter out Marktplaats listings and items without a proper image
    const filtered = items.filter(it => {
      const isMarktplaats = it.pricing_source && String(it.pricing_source).toLowerCase() === 'marktplaats';
      const hasImage = it.image && it.image !== 'images/placeholder_light_gray_block.png';
      return !isMarktplaats && hasImage;
    });
    // Select up to 12 items for performance; duplicate to enable seamless scrolling
    const subset = filtered.slice(0, 12);
    const allItems = [...subset, ...subset];
    track.innerHTML = '';
    allItems.forEach(it => {
      const slug = slugify(it.title);
      const a = document.createElement('a');
      a.className = 'marquee-item';
      a.href = `product.html?slug=${encodeURIComponent(slug)}`;
      const img = document.createElement('img');
      img.src = fixImage(it.image);
      img.alt = it.title;
      a.appendChild(img);
      track.appendChild(a);
    });
  }

  /**
   * Render a set of related products based on the current item.
   * Excludes the current product itself and prioritises items from the same category.
   * If fewer than 4 items are found, the selection is supplemented with random items.
   * @param {string} currentSlug
   * @param {string} currentCategory
   */
  async function renderRelatedProducts(currentSlug, currentCategory) {
    const container = document.getElementById('related-products');
    if (!container) return;
    let items;
    try {
      const res = await fetch('inventory_local.json', { cache: 'no-store' });
      if (res.ok) {
        items = await res.json();
      }
    } catch (err) {
      items = INVENTORY;
    }
    items = items || INVENTORY;
    // Filter out Marktplaats items and the current product itself
    let pool = items.filter(it => {
      const slug = slugify(it.title);
      const isMarktplaats = it.pricing_source && it.pricing_source.toLowerCase() === 'marktplaats';
      return slug !== currentSlug && !isMarktplaats && it.image && it.image !== 'images/placeholder_light_gray_block.png';
    });
    // Try to find items in the same category
    let related = pool.filter(it => it.category === currentCategory);
    // If not enough, take from the full pool
    if (related.length < 4) {
      // Shuffle the pool
      pool = pool.sort(() => 0.5 - Math.random());
      related = [...related, ...pool].filter((it, idx, arr) => arr.findIndex(x => x.title === it.title) === idx);
    }
    related = related.slice(0, 4);
    // Build cards
    container.innerHTML = '';
    related.forEach(it => {
      const slug = slugify(it.title);
      // Round price to .95
      const rawPrice = Number(it.price) || 0;
      const price = Math.floor(rawPrice) + 0.95;
      const card = document.createElement('article');
      card.className = 'shop-card';
      const isMarktplaats = it.pricing_source && it.pricing_source.toLowerCase() === 'marktplaats';
      const imgTag = isMarktplaats ? '' : `<img src="${fixImage(it.image)}" alt="${it.title}" class="shop-thumb">`;
      const dataImage = isMarktplaats ? '' : fixImage(it.image);
      card.innerHTML = `
        <a href="product.html?slug=${encodeURIComponent(slug)}" class="product-thumb-link">
          ${imgTag}
        </a>
        <div class="info">
          <h3><a href="product.html?slug=${encodeURIComponent(slug)}">${it.title}</a></h3>
          <div class="meta">
          <span class="price">€ ${price.toFixed(2)}</span>
          </div>
        </div>
        <div class="actions">
          <a href="product.html?slug=${encodeURIComponent(slug)}" class="btn-view">Bekijk</a>
          <button class="btn-cart" data-slug="${slug}" data-title="${it.title}" data-price="${price}" data-image="${dataImage}" data-category="${it.category || ''}">🛒</button>
        </div>
      `;
      // Bind add to cart button
      const btn = card.querySelector('.btn-cart');
      btn.addEventListener('click', () => {
        addToCart({ title: it.title, priceCents: Math.round(price * 100), image: fixImage(it.image), slug, category: it.category || '' });
      });
      container.appendChild(card);
    });
  }

  /**
   * Render cross‑sell suggestions on the cart page. Selects a handful of low‑priced
   * complementary products to encourage shoppers to add an extra item to their order.
   * The suggestions are inserted into the element with id "cross-sell" if present.
   */
  async function renderCrossSell() {
    const container = document.getElementById('cross-sell');
    if (!container) return;
    // Avoid rendering if there are no items in cart
    const cart = getCart();
    if (!cart.items || !cart.items.length) {
      container.innerHTML = '';
      return;
    }
    // Fetch inventory
    let items;
    try {
      const res = await fetch('inventory_local.json', { cache: 'no-store' });
      if (res.ok) items = await res.json();
    } catch (err) {
      items = INVENTORY;
    }
    items = items || INVENTORY;
    // Exclude Marktplaats items and items already in cart
    const cartSlugs = cart.items.map(it => it.slug);
    const filtered = items.filter(it => {
      const slug = slugify(it.title);
      const isMarktplaats = it.pricing_source && String(it.pricing_source).toLowerCase() === 'marktplaats';
      const inCart = cartSlugs.includes(slug);
      return !isMarktplaats && !inCart;
    });
    // Sort by price ascending to suggest low‑cost add‑ons, then randomly shuffle within same price band
    const sorted = filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    // Take up to 4 cheapest items as suggestions
    const suggestions = sorted.slice(0, 4);
    container.innerHTML = '';
    suggestions.forEach(it => {
      const slug = slugify(it.title);
      const price = Math.floor(Number(it.price) || 0) + 0.95;
      const card = document.createElement('div');
      card.className = 'cross-sell-item';
      card.innerHTML = `
        <a href="product.html?slug=${encodeURIComponent(slug)}" class="cross-sell-thumb">
          <img src="${fixImage(it.image)}" alt="${it.title}">
        </a>
        <div class="cross-sell-info">
          <h4><a href="product.html?slug=${encodeURIComponent(slug)}">${it.title}</a></h4>
          <span class="price">€ ${price.toFixed(2)}</span>
          <button class="btn btn-sm" data-slug="${slug}" data-title="${it.title}" data-price="${price}" data-image="${fixImage(it.image)}" data-category="${it.category || ''}">Toevoegen</button>
        </div>
      `;
      container.appendChild(card);
    });
    // Bind click handlers for cross‑sell add buttons
    container.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', e => {
        const t = e.currentTarget;
        const priceCents = Math.round(parseFloat(t.dataset.price) * 100);
        addToCart({
          title: t.dataset.title,
          priceCents,
          image: t.dataset.image,
          slug: t.dataset.slug,
          category: t.dataset.category || ''
        });
        // Re-render cross sell suggestions after adding to cart to avoid duplicates
        renderCrossSell();
      });
    });
  }

  // initSpinWheel functie is verwijderd. De site bevat geen spin‑the‑wheel pop‑up meer om de ervaring rustiger te maken.

  /**
   * Initialise live purchase pop‑ups for social proof.
   * Shows periodic notifications indicating that other customers have recently
   * purchased items. This leverages random names and locations to create
   * relatable messages and cycles through the available inventory.
   */
  function initLivePurchasePopups() {
    // Only run in browsers
    if (typeof window === 'undefined' || !document.body) return;
    // Names and cities used in fake notifications
    const names = ['Lisa','Tim','Sophie','Robin','Jay','Kim','Jessy','Mike','Sven','Jordi'];
    const cities = ['Amsterdam','Rotterdam','Utrecht','Eindhoven','Groningen','Arnhem','Hulsen','Enschede','Zwolle','Hilversum'];
    let itemsCache = [];
    // Helper to load inventory once
    async function loadItems() {
      if (itemsCache.length) return itemsCache;
      try {
        const res = await fetch('inventory_local.json', { cache: 'no-store' });
        if (res.ok) {
          itemsCache = await res.json();
        }
      } catch (err) {
        itemsCache = INVENTORY;
      }
      // Filter out Marktplaats items and placeholders
      itemsCache = (itemsCache || INVENTORY).filter(it => {
        const isMarktplaats = it.pricing_source && String(it.pricing_source).toLowerCase() === 'marktplaats';
        return !isMarktplaats && it.image && it.image !== 'images/placeholder_light_gray_block.png';
      });
      return itemsCache;
    }
    function showPopup() {
      loadItems().then(items => {
        if (!items || !items.length) return;
        const item = items[Math.floor(Math.random() * items.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const message = `${name} uit ${city} heeft net ${item.title} gekocht!`;
        // Create popup element
        const pop = document.createElement('div');
        pop.className = 'purchase-popup';
        pop.textContent = message;
        document.body.appendChild(pop);
        // Trigger fade in
        requestAnimationFrame(() => {
          pop.style.opacity = '1';
          pop.style.transform = 'translateY(0)';
        });
        // Hide after 5 seconds
        setTimeout(() => {
          pop.style.opacity = '0';
          pop.style.transform = 'translateY(20px)';
          setTimeout(() => pop.remove(), 800);
        }, 5000);
      });
    }
    // Initial delay before first popup
    setTimeout(() => {
      showPopup();
      // Repeat every 45 seconds
      setInterval(showPopup, 45000);
    }, 10000);
  }

  /**
   * Show a loyalty club pop‑up encouraging visitors to join the GameShop Club.
   * The popup offers exclusive deals, early access and rewards points. It only
   * appears once per session and includes a simple email input. When the
   * customer submits, the popup disappears and their email is saved to localStorage.
   */
  function initLoyaltyPopup() {
    if (typeof window === 'undefined' || !document.body) return;
    // Only show if not already joined or closed
    if (localStorage.getItem('GSE_loyaltyPopupShown')) return;
    // Create popup elements
    const overlay = document.createElement('div');
    overlay.className = 'loyalty-overlay';
    overlay.innerHTML = `
      <div class="loyalty-modal">
        <button class="loyalty-close" aria-label="Sluiten">×</button>
        <h2>Word lid van de GameShop Club</h2>
        <p>Ontvang exclusieve deals, spaar punten voor korting en krijg als eerste toegang tot nieuwe releases.</p>
        <form id="loyalty-form">
          <input type="email" id="loyaltyEmail" placeholder="Jouw e‑mailadres" required />
          <button type="submit" class="btn btn-primary">Meld je aan</button>
        </form>
      </div>`;
    document.body.appendChild(overlay);
    // Close button
    overlay.querySelector('.loyalty-close').addEventListener('click', () => {
      overlay.remove();
      localStorage.setItem('GSE_loyaltyPopupShown', '1');
    });
    // Form submission
    overlay.querySelector('#loyalty-form').addEventListener('submit', e => {
      e.preventDefault();
      const email = overlay.querySelector('#loyaltyEmail').value.trim();
      if (email) {
        // Save email locally – in real life would send to backend
        localStorage.setItem('GSE_loyaltyEmail', email);
        overlay.innerHTML = '<div class="loyalty-modal"><h2>Bedankt!</h2><p>Je bent aangemeld voor de GameShop Club. Houd je inbox in de gaten voor exclusieve aanbiedingen.</p></div>';
        setTimeout(() => overlay.remove(), 4000);
        localStorage.setItem('GSE_loyaltyPopupShown', '1');
      }
    });
    // Show after delay
    setTimeout(() => overlay.classList.add('show'), 6000);
  }

  /**
   * Apply a bundle discount when multiple items are in the cart. If the cart
   * contains three or more non‑Marktplaats items, apply a 5% discount to
   * the subtotal. Returns the discount amount in cents.
   * @param {Array} cartItems
   * @param {number} subtotalCents
   * @returns {number}
   */
  function applyBundleDiscount(cartItems, subtotalCents) {
    // Determine eligible items: exclude Marktplaats category to avoid discount
    const eligibleCount = cartItems.filter(it => {
      // Some items may store category instead of source
      const cat = (it.category || '').toLowerCase();
      return cat !== 'marktplaats';
    }).length;
    if (eligibleCount >= 3) {
      return Math.round(subtotalCents * 0.05);
    }
    return 0;
  }

  /**
   * Initialise a simple chat widget offering live assistance. A floating button
   * toggles a chat window where users can type questions. The responses are
   * preprogrammed for common questions and the widget emphasises 24/7 support.
   */
  function initChatWidget() {
    if (typeof window === 'undefined' || !document.body) return;
    // Prevent multiple initialisations
    if (document.getElementById('chat-button')) return;
    // Create chat button
    const btn = document.createElement('button');
    btn.id = 'chat-button';
    btn.className = 'chat-button';
    btn.innerHTML = '💬';
    document.body.appendChild(btn);
    // Create chat window
    const chat = document.createElement('div');
    chat.id = 'chat-widget';
    chat.className = 'chat-widget';
    chat.innerHTML = `
      <div class="chat-header"><span>Live chat</span><button id="chat-close">×</button></div>
      <div class="chat-messages">
        <div class="chat-message bot">Hallo! Hoe kunnen we je helpen? Je kunt hier een vraag stellen of mail ons op <a href="mailto:gameshopenter@gmail.com">gameshopenter@gmail.com</a> voor een persoonlijk antwoord.</div>
      </div>
      <form class="chat-input">
        <input type="text" id="chatInput" placeholder="Typ je bericht..." autocomplete="off" />
        <button type="submit">Verzend</button>
      </form>`;
    document.body.appendChild(chat);
    // Toggle chat
    function toggleChat() {
      chat.classList.toggle('open');
    }
    btn.addEventListener('click', toggleChat);
    chat.querySelector('#chat-close').addEventListener('click', toggleChat);
    // Handle chat submission
    chat.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      const inputEl = chat.querySelector('#chatInput');
      const text = inputEl.value.trim();
      if (!text) return;
      appendChatMessage(text, 'user');
      inputEl.value = '';
      // Provide a generic response
      setTimeout(() => {
        let reply;
        const lower = text.toLowerCase();
        if (/prijs|kosten|verzend/.test(lower)) {
          // Leg verzendkosten duidelijk uit: brievenbuspakket versus pakketpost
          reply = 'Verzendkosten bedragen €3,99 voor bestellingen tot 4 games en €6,95 voor 5 games of meer. Bestellingen vanaf €100 worden gratis verzonden.';
        } else if (/voorraad|beschikbaar/.test(lower)) {
          reply = 'De beschikbaarheid staat vermeld bij elk product. Heb je iets speciaals nodig? Laat het ons weten!';
        } else if (/retour|garantie/.test(lower)) {
          // Retourbeleid: 14 dagen bedenktijd, retourkosten voor eigen rekening
          reply = 'Je hebt 14 dagen bedenktijd; retourkosten zijn voor eigen rekening. Alle producten worden zorgvuldig getest op functionaliteit en authenticiteit.';
        } else if (/hallo|hoi|hey/.test(lower)) {
          reply = 'Hallo! Hoe kunnen we je verder helpen?';
        } else if (/mail|email|contact/.test(lower)) {
          reply = 'Je kunt ons altijd mailen op <a href="mailto:gameshopenter@gmail.com">gameshopenter@gmail.com</a>; we reageren binnen één werkdag.';
        } else {
          reply = 'Bedankt voor je bericht! Voor een persoonlijk antwoord kun je een e‑mail sturen naar <a href="mailto:gameshopenter@gmail.com">gameshopenter@gmail.com</a>; we reageren binnen één werkdag.';
        }
        appendChatMessage(reply, 'bot');
      }, 800);
    });
    // Helper to append messages
    function appendChatMessage(message, type) {
      const msgEl = document.createElement('div');
      msgEl.className = 'chat-message ' + type;
      msgEl.textContent = message;
      chat.querySelector('.chat-messages').appendChild(msgEl);
      chat.querySelector('.chat-messages').scrollTop = chat.querySelector('.chat-messages').scrollHeight;
    }
  }

  /**
   * Render a set of featured products for the homepage. Selects up to four
   * high‑rated items (rating >= 4.5) and displays them in the featured grid.
   */
  async function loadFeaturedProducts() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    let items;
    try {
      const res = await fetch('inventory_local.json', { cache: 'no-store' });
      if (res.ok) {
        items = await res.json();
      }
    } catch (err) {
      items = INVENTORY;
    }
    items = items || INVENTORY;
    // Filter out Marktplaats items and placeholders
    const filtered = items.filter(it => {
      const isMp = it.pricing_source && it.pricing_source.toLowerCase() === 'marktplaats';
      return !isMp && it.image && it.image !== 'images/placeholder_light_gray_block.png';
    });
    // Add dynamic rating: replicate earlier logic
    const enriched = filtered.map(it => {
      const rating = (Math.random() * 0.5 + 4.5).toFixed(1); // 4.5‑5.0
      return Object.assign({}, it, { rating: parseFloat(rating) });
    });
    // Sort by rating descending and price ascending
    enriched.sort((a, b) => b.rating - a.rating || a.price - b.price);
    const selected = enriched.slice(0, 4);
    grid.innerHTML = '';
    selected.forEach(it => {
      const slug = slugify(it.title);
      const price = Math.floor(Number(it.price)) + 0.95;
      const card = document.createElement('article');
      card.className = 'featured-card';
      card.innerHTML = `
        <a href="product.html?slug=${encodeURIComponent(slug)}" class="featured-thumb-link"><img src="${fixImage(it.image)}" alt="${it.title}" class="featured-thumb"></a>
        <div class="featured-info">
          <h4><a href="product.html?slug=${encodeURIComponent(slug)}">${it.title}</a></h4>
          <div class="featured-meta">
            <span class="price">€ ${price.toFixed(2)}</span>
            <span class="rating">★ ${it.rating}</span>
          </div>
          <a href="product.html?slug=${encodeURIComponent(slug)}" class="btn btn-sm">Bekijk</a>
        </div>`;
      grid.appendChild(card);
    });
  }

  /**
   * Render a mock Instagram feed using random images from the gallery. This
   * provides social proof and encourages users to follow us on Instagram. It
   * selects eight unique images and displays them in a responsive grid.
   */
  async function renderInstagramFeed() {
    const container = document.getElementById('instagramFeed');
    if (!container) return;
    // Build an array of image paths from gallery directory
    const images = [];
    // We'll predefine a list of gallery images manually because we cannot read directory on client
    images.push('images/gallery/02484F91-D958-4BF1-84F8-A3E61B948A96.jpeg');
    images.push('images/gallery/0A549469-9E34-4E2E-B21F-FF522D6CD55C.jpeg');
    images.push('images/gallery/1592573B-1271-46EE-B1BF-8B59CA581283.jpeg');
    images.push('images/gallery/16BD8BF1-30D0-4D1C-B4D4-2A2E8695FC5C.jpeg');
    images.push('images/gallery/27B80EA5-9187-4B44-A9CD-214C8F4B646C.jpeg');
    images.push('images/gallery/4489A3AB-0815-4783-8030-157AFEDCD950.jpeg');
    images.push('images/gallery/4391E308-4F7D-411F-9FF1-0CF0B4C52B7F.jpeg');
    images.push('images/gallery/7EC3A36A-0317-475A-B8F7-9CF4790E63E5.jpeg');
    // Shuffle and select 8
    const shuffled = images.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 8);
    container.innerHTML = '';
    selected.forEach(path => {
      const a = document.createElement('a');
      a.href = 'https://www.instagram.com/Gameshop_Enter';
      a.target = '_blank';
      const img = document.createElement('img');
      img.src = path;
      img.alt = 'Instagram foto';
      a.appendChild(img);
      container.appendChild(a);
    });
  }

  /**
   * Render a set of recommended games on the homepage.
   * Selects four random items (excluding Marktplaats listings and those without images).
   */
  async function renderRecommendedGames() {
    const grid = document.getElementById('recommendedGrid');
    if (!grid) return;
    let items;
    try {
      const res = await fetch('inventory_local.json', { cache: 'no-store' });
      if (res.ok) {
        items = await res.json();
      }
    } catch (err) {
      items = INVENTORY;
    }
    items = items || INVENTORY;
    const pool = items.filter(it => {
      const isMarktplaats = it.pricing_source && it.pricing_source.toLowerCase() === 'marktplaats';
      return !isMarktplaats && it.image && it.image !== 'images/placeholder_light_gray_block.png';
    });
    // Shuffle and select 4
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    grid.innerHTML = '';
    selected.forEach(it => {
      const slug = slugify(it.title);
      // Round price to .95 for recommended games
      const rawPrice = Number(it.price) || 0;
      const price = Math.floor(rawPrice) + 0.95;
      const card = document.createElement('article');
      card.className = 'shop-card';
      const imgTag = `<img src="${fixImage(it.image)}" alt="${it.title}" class="shop-thumb">`;
      card.innerHTML = `
        <a href="product.html?slug=${encodeURIComponent(slug)}" class="product-thumb-link">
          ${imgTag}
        </a>
        <div class="info">
          <h3><a href="product.html?slug=${encodeURIComponent(slug)}">${it.title}</a></h3>
          <div class="meta">
            <span class="price">€ ${price.toFixed(2)}</span>
          </div>
        </div>
        <div class="actions">
          <a href="product.html?slug=${encodeURIComponent(slug)}" class="btn-view">Bekijk</a>
          <button class="btn-cart" data-slug="${slug}" data-title="${it.title}" data-price="${price}" data-image="${fixImage(it.image)}" data-category="${it.category || ''}">🛒</button>
          <button type="button" class="btn-desc">Omschrijving</button>
        </div>
        <div class="description-section">
          <p>Alle tweedehands games en consoles worden door ons zorgvuldig getest op functionaliteit en authenticiteit. De getoonde afbeelding dient als voorbeeld; de daadwerkelijke staat kan licht afwijken. We verzenden elk product stevig verpakt; afhalen is niet mogelijk.</p>
        </div>
      `;
      const btn = card.querySelector('.btn-cart');
      btn.addEventListener('click', () => {
        addToCart({ title: it.title, priceCents: Math.round(price * 100), image: fixImage(it.image), slug, category: it.category || '' });
      });
      // Bind description toggle for recommended cards
      const dBtn = card.querySelector('.btn-desc');
      const descSec = card.querySelector('.description-section');
      if (dBtn && descSec) {
        dBtn.addEventListener('click', () => {
          const isVisible = descSec.style.display === 'block';
          descSec.style.display = isVisible ? 'none' : 'block';
        });
      }
      grid.appendChild(card);
    });
  }

  /**
   * Initialize navigation: highlight active link based on pathname.
   */
  function initNavigation() {
    const path = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path) a.classList.add('active');
    });
  }

  /**
   * Expose public methods.
   */
  return {
    slugify,
    getCart,
    saveCart,
    updateCartCount,
    addToCart,
    loadProducts,
    loadProductDetail,
    loadCartPage,
    initNavigation
    ,initStaticProductPage
    ,renderRelatedProducts
    ,renderRecommendedGames
    ,loadHomeMarquee
    ,renderCrossSell
    /* initSpinWheel removed: spin‑to‑win popup disabled */
    ,initLivePurchasePopups
    ,initLoyaltyPopup
    ,initChatWidget
    ,loadFeaturedProducts
    ,renderInstagramFeed
  };
})();

// Ensure the GSE object is available on the global window for pages
// that reference `window.GSE`. Without this assignment, `const GSE`
// creates a block‑scoped variable that does not attach to the window
// object, which caused functions like loadProducts() to never run on
// Netlify (no products were rendered and the cart didn't work). By
// explicitly assigning to window.GSE we make the API accessible
// globally.
if (typeof window !== 'undefined') {
  window.GSE = GSE;
}

// Initialize common UI on page load
document.addEventListener('DOMContentLoaded', () => {
  GSE.initNavigation();
  GSE.updateCartCount();
  // De gamified spin‑to‑win popup is verwijderd om de gebruikerservaring rustiger en professioneler te maken.
  // Render recommended games on the homepage when the grid exists
  try {
    if (document.getElementById('recommendedGrid')) {
      GSE.renderRecommendedGames();
    }
  } catch (e) {
    // ignore errors during homepage recommendations
  }
  // Initialise de productslider op de homepage wanneer het element aanwezig is
  try {
    if (document.getElementById('marquee-track')) {
      GSE.loadHomeMarquee();
    }
  } catch (e) {
    // ignore errors during home marquee setup
  }
  // Contactformulier handler verwijderd
  // Het contactformulier gebruikt nu een mailto-action in contact.html. Wanneer de gebruiker het formulier verstuurt,
  // opent het standaard e‑mailprogramma om het bericht naar gameshopenter@gmail.com te sturen.
});

// ===================
// Dark mode toggle
// ===================
// Attach a second DOMContentLoaded listener to initialize a dark mode
// toggle button. The button with id `darkModeToggle` toggles the class
// `dark-mode` on the <body> and stores the preference in localStorage.
document.addEventListener('DOMContentLoaded', () => {
  const darkToggle = document.getElementById('darkModeToggle');
  if (!darkToggle) return;
  // Apply saved preference
  const savedPref = localStorage.getItem('GSE_DARK_MODE');
  if (savedPref === 'true') {
    document.body.classList.add('dark-mode');
    darkToggle.setAttribute('aria-pressed', 'true');
  }
  // Click listener
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('GSE_DARK_MODE', isDark);
    darkToggle.setAttribute('aria-pressed', isDark);
  });
});

// ===================
// Scroll reveal animations
// ===================
// Voeg een IntersectionObserver toe om elementen met de klasse `scroll-fade`
// geleidelijk zichtbaar te maken wanneer ze in de viewport komen. Deze
// functionaliteit wordt na het laden van de DOM geïnitialiseerd en zorgt
// voor een dynamische, hedendaagse gebruikerservaring zonder zware
// bibliotheken. Het drempelpercentage bepaalt hoeveel van het element
// zichtbaar moet zijn voordat de animatie wordt geactiveerd.
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.2
  };
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll('.scroll-fade').forEach(elem => {
    revealObserver.observe(elem);
  });

  // Scroll progress bar: update width based on scroll position
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    });
  }
});