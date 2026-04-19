/**
 * extract-psd-layers.mjs
 * Exports cumulative-stage PNGs from the White Leaf PSD, applying blend modes correctly.
 */
import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas, createImageData } from 'canvas';
import fs from 'fs';
import path from 'path';

initializeCanvas(
  (w, h) => createCanvas(w, h),
  (data, w, h) => createImageData(data, w, h)
);

const PSD_PATH = 'public/projects/Project_02/03_Drawings/Layer 3 .psd';
const OUT_DIR  = 'public/projects/Project_02/03_Drawings/layers';
fs.mkdirSync(OUT_DIR, { recursive: true });

console.log('Reading PSD…');
const buf = fs.readFileSync(PSD_PATH);
const psd = readPsd(buf, { useImageData: false, skipLayerImageData: false });
const { width: W, height: H } = psd;
console.log(`Canvas: ${W} × ${H}`);

// ── Blend mode map (PSD blendMode string → canvas globalCompositeOperation) ──
const BLEND = {
  'pass through': 'source-over',
  'normal':       'source-over',
  'multiply':     'multiply',
  'screen':       'screen',
  'overlay':      'overlay',
  'darken':       'darken',
  'lighten':      'lighten',
  'color-dodge':  'color-dodge',
  'color-burn':   'color-burn',
  'hard-light':   'hard-light',
  'soft-light':   'soft-light',
  'difference':   'difference',
  'exclusion':    'exclusion',
  'hue':          'hue',
  'saturation':   'saturation',
  'color':        'color',
  'luminosity':   'luminosity',
};

function getBlend(node) {
  return BLEND[node.blendMode] ?? 'source-over';
}

/**
 * Recursively composite a node onto ctx with correct blend mode & opacity.
 * Groups with children are composited into a temp canvas first (so opacity
 * applies to the group as a whole, not per-pixel), then drawn onto ctx.
 */
function drawNode(ctx, node, parentW, parentH) {
  if (!node || node.hidden) return;

  const alpha  = (node.opacity ?? 255) / 255;
  const blend  = getBlend(node);

  if (node.children && node.children.length > 0) {
    // Render group into temp canvas, then blit with group opacity/blend
    const tmp = createCanvas(parentW, parentH);
    const tCtx = tmp.getContext('2d');
    for (const child of node.children) drawNode(tCtx, child, parentW, parentH);

    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = blend;
    ctx.drawImage(tmp, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  } else if (node.canvas) {
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = blend;
    ctx.drawImage(node.canvas, node.left ?? 0, node.top ?? 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
}

/** Render a list of top-level nodes onto a white canvas and save */
function exportStage(filename, nodes) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  for (const n of nodes) drawNode(ctx, n, W, H);
  fs.writeFileSync(path.join(OUT_DIR, filename), canvas.toBuffer('image/png'));
  console.log(`  → ${filename}`);
}

// ── Locate groups ─────────────────────────────────────────────────────────────
const main = psd.children?.find(n => n.name === '1');
if (!main) { console.error('Group "1" not found'); process.exit(1); }

const C   = main.children ?? [];
const find = name => C.find(n => n.name?.toLowerCase().includes(name.toLowerCase()));

const bg      = find('Layer 50');
const topo    = find('Topographic');
const diagram = find('Diagram');
const columns = find('Coloum');
const people  = find('People');
const vision  = find('Vision');

// Title layers at PSD root
const titleWL  = psd.children?.find(n => n.name?.includes('White Leaf'));
const titleNum = psd.children?.find(n => n.name === '01');
const titleL6  = psd.children?.find(n => n.name === 'Layer 6');
const titleL24 = psd.children?.find(n => n.name === 'Layer 24 copy');

// ── Export cumulative stages ──────────────────────────────────────────────────
console.log('\nExporting stages with blend modes:');

const s1 = [bg].filter(Boolean);
exportStage('stage_1_bg.png',      s1);

const s2 = [...s1, topo].filter(Boolean);
exportStage('stage_2_topo.png',    s2);

const s3 = [...s2, diagram].filter(Boolean);
exportStage('stage_3_diagram.png', s3);

const s4 = [...s3, columns].filter(Boolean);
exportStage('stage_4_columns.png', s4);

const s5 = [...s4, people].filter(Boolean);
exportStage('stage_5_people.png',  s5);

const s6 = [...s5, vision].filter(Boolean);
exportStage('stage_6_text.png',    s6);

const titles = [titleWL, titleNum, titleL6, titleL24].filter(Boolean);
const s7 = [...s6, ...titles];
exportStage('stage_7_title.png',   s7);

console.log('\nDone!');
