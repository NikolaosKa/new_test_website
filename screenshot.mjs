import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] || "";
// Optional: node screenshot.mjs http://localhost:3000 label 720 400
// Moves the mouse to (x,y) before screenshotting to trigger hover states
const mouseX = process.argv[4] ? parseInt(process.argv[4]) : null;
const mouseY = process.argv[5] ? parseInt(process.argv[5]) : null;

const screenshotsDir = path.join(__dirname, "temporary screenshots");
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

const existing = fs.readdirSync(screenshotsDir).filter((f) => f.endsWith(".png"));
const nums = existing.map((f) => parseInt(f.match(/screenshot-(\d+)/)?.[1] ?? "0")).filter(Boolean);
const next = nums.length ? Math.max(...nums) + 1 : 1;

const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outputPath = path.join(screenshotsDir, filename);

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
// Wait for Three.js to load and render (12MB GLB needs extra time)
await new Promise((r) => setTimeout(r, 7000));

if (mouseX !== null && mouseY !== null) {
  // Move mouse slowly to trigger mousemove events
  await page.mouse.move(720, 450); // start from center
  await new Promise((r) => setTimeout(r, 200));
  await page.mouse.move(mouseX, mouseY, { steps: 10 });
  // Wait for hover animation to settle
  await new Promise((r) => setTimeout(r, 1200));
}

await page.screenshot({ path: outputPath, fullPage: false });
await browser.close();
console.log(`Screenshot saved: ${outputPath}`);
