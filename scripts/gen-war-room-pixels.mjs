// Geração ONE-TIME dos sprites da War Room via PixelLab (pixflux).
// Keys em loot-hunter/.env.local (PIXELLAB_KEYS="nome:key;nome:key").
// Uso: node scripts/gen-war-room-pixels.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "war-room");
fs.mkdirSync(OUT, { recursive: true });

const ENV = "/home/calney/Labfy/loot-hunter/.env.local";
const m = fs.readFileSync(ENV, "utf8").match(/PIXELLAB_KEYS="?([^"\n]+)/);
if (!m) {
  console.error("PIXELLAB_KEYS não encontrado em", ENV);
  process.exit(1);
}
const keys = m[1]
  .split(";")
  .map((kv) => {
    const i = kv.indexOf(":");
    return i > 0 ? { name: kv.slice(0, i), key: kv.slice(i + 1) } : null;
  })
  .filter(Boolean);

async function balance(key) {
  try {
    const r = await fetch("https://api.pixellab.ai/v2/balance", {
      headers: { Authorization: `Bearer ${key}`, "User-Agent": "labfy" },
    });
    const d = await r.json();
    return d?.subscription?.generations ?? 0;
  } catch {
    return -1;
  }
}

const withBal = [];
for (const k of keys) withBal.push({ ...k, bal: await balance(k.key) });
withBal.sort((a, b) => b.bal - a.bal);
const usable = withBal.filter((k) => k.bal > 0);
console.log(
  "Keys por saldo:",
  withBal.map((k) => `${k.name}:${k.bal}`).join(" ")
);
if (usable.length === 0) {
  console.error("Nenhuma key PixelLab com saldo.");
  process.exit(1);
}

const ASSETS = [
  {
    name: "salao",
    size: 128,
    no_background: false,
    prompt:
      "top-down interior of a medieval strategy war room, large round wooden table in the center, " +
      "stone brick walls, lit wall torches, hanging banners, empty room, warm candlelight, fantasy pixel art",
  },
  {
    name: "deepseek",
    size: 64,
    no_background: true,
    prompt:
      "elderly wise chinese sage seated, long flowing white beard, traditional blue silk robe, calm serene " +
      "expression, front view, single character, 64px pixel art character portrait, transparent background",
  },
  {
    name: "gemma",
    size: 64,
    no_background: true,
    prompt:
      "confident young american woman seated, modern tech startup style, casual blazer, short hair, friendly " +
      "smile, front view, single character, 64px pixel art character portrait, transparent background",
  },
  {
    name: "hermes",
    size: 64,
    no_background: true,
    prompt:
      "hermes greek god seated, winged golden helmet, young athletic messenger, mischievous confident smile, " +
      "front view, single character, 64px pixel art character portrait, transparent background",
  },
  {
    name: "minimax",
    size: 64,
    no_background: true,
    prompt:
      "refined european intellectual man seated, vintage tailored suit, neat mustache, thoughtful skeptical " +
      "expression, front view, single character, 64px pixel art character portrait, transparent background",
  },
];

async function gen(asset, key) {
  const body = JSON.stringify({
    description: asset.prompt,
    image_size: { width: asset.size, height: asset.size },
    no_background: asset.no_background,
    text_guidance_scale: 8.0,
    outline: "single color black outline",
    shading: "medium shading",
    detail: "highly detailed",
    negative_description:
      "blurry, extra limbs, deformed, ugly, low detail, text, watermark, multiple characters",
  });
  const r = await fetch("https://api.pixellab.ai/v2/create-image-pixflux", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body,
  });
  if (!r.ok) {
    console.log(`[${asset.name}] HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return false;
  }
  const d = await r.json();
  const b64 = d?.image?.base64 || d?.image?.base64_image;
  if (!b64) {
    console.log(`[${asset.name}] sem imagem na resposta: ${Object.keys(d).join(",")}`);
    return false;
  }
  fs.writeFileSync(path.join(OUT, `${asset.name}.png`), Buffer.from(b64, "base64"));
  console.log(`[${asset.name}] OK -> public/war-room/${asset.name}.png`);
  return true;
}

let ok = 0;
for (const asset of ASSETS) {
  const key = usable[ok % usable.length].key; // distribui entre as keys com saldo
  if (await gen(asset, key)) ok++;
}
console.log(`done — ${ok}/${ASSETS.length} sprites gerados`);
