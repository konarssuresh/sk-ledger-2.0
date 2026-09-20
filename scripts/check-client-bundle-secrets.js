/**
 * Post-build guard: fail if known server env var *names* appear as inlined values
 * in client static chunks (run after `npm run build` locally).
 */
const fs = require("fs");
const path = require("path");

function loadEnvFile(relativePath) {
  const filePath = path.join(__dirname, "..", relativePath);
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const staticDir = path.join(__dirname, "..", ".next", "static");
const secretMarkers = [
  process.env.MONGO_URI,
  process.env.JWT_SECRET,
  process.env.INTERNAL_KEY,
].filter(Boolean);

if (!fs.existsSync(staticDir)) {
  console.warn("check-client-bundle-secrets: no .next/static (skip)");
  process.exit(0);
}

if (secretMarkers.length === 0) {
  console.warn(
    "check-client-bundle-secrets: set MONGO_URI/JWT_SECRET/INTERNAL_KEY to scan (skip)",
  );
  process.exit(0);
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(js|json|map)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const hits = [];
for (const file of walk(staticDir)) {
  const content = fs.readFileSync(file, "utf8");
  for (const marker of secretMarkers) {
    if (content.includes(marker)) {
      hits.push({ file: path.relative(process.cwd(), file), markerLength: marker.length });
    }
  }
}

if (hits.length) {
  console.error("Server secrets found in client static output:");
  for (const hit of hits) console.error(`  ${hit.file} (value length ${hit.markerLength})`);
  process.exit(1);
}

console.log("check-client-bundle-secrets: OK (no server env values in .next/static)");
