// One-off generator for public/favicon.ico — a simple "M" letter-mark
// placeholder icon (accent blue on dark background), hand-rasterized
// since no image-conversion tool (ImageMagick/Inkscape/rsvg) is available
// in this environment. Safe to delete once a real favicon.ico is supplied.
import { writeFileSync } from "node:fs";

const SIZE = 32;
const BG = [0x0a, 0x0b, 0x0d]; // --color-bg
const FG = [0x3d, 0x5a, 0xfe]; // --color-accent

const pixels = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => BG));

function setPx(x, y, color) {
  if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) pixels[y][x] = color;
}

function thickPoint(x, y, radius, color) {
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      setPx(x + dx, y + dy, color);
    }
  }
}

// Draw a simple blocky "M": two vertical strokes + two diagonals meeting in the middle.
const top = 7;
const bottom = 25;
const leftX = 8;
const rightX = 23;
const midX = 16;
const midY = 15;
const radius = 1;

for (let y = top; y <= bottom; y++) {
  thickPoint(leftX, y, radius, FG);
  thickPoint(rightX, y, radius, FG);
}
for (let y = top; y <= midY; y++) {
  const t = (y - top) / (midY - top);
  thickPoint(Math.round(leftX + (midX - leftX) * t), y, radius, FG);
  thickPoint(Math.round(rightX - (rightX - midX) * t), y, radius, FG);
}

// --- Encode as a 32bpp BGRA ICO file ---
const colorDataSize = SIZE * SIZE * 4;
const maskRowBytes = Math.ceil(SIZE / 8 / 4) * 4;
const maskDataSize = maskRowBytes * SIZE;
const dibHeaderSize = 40;
const imageDataSize = dibHeaderSize + colorDataSize + maskDataSize;
const fileSize = 6 + 16 + imageDataSize;

const buf = Buffer.alloc(fileSize);
let o = 0;

// ICONDIR
buf.writeUInt16LE(0, o); o += 2; // reserved
buf.writeUInt16LE(1, o); o += 2; // type = icon
buf.writeUInt16LE(1, o); o += 2; // count

// ICONDIRENTRY
buf.writeUInt8(SIZE, o); o += 1; // width
buf.writeUInt8(SIZE, o); o += 1; // height
buf.writeUInt8(0, o); o += 1; // color count
buf.writeUInt8(0, o); o += 1; // reserved
buf.writeUInt16LE(1, o); o += 2; // planes
buf.writeUInt16LE(32, o); o += 2; // bit count
buf.writeUInt32LE(imageDataSize, o); o += 4; // bytes in resource
buf.writeUInt32LE(22, o); o += 4; // image offset

// BITMAPINFOHEADER
buf.writeUInt32LE(dibHeaderSize, o); o += 4;
buf.writeInt32LE(SIZE, o); o += 4; // width
buf.writeInt32LE(SIZE * 2, o); o += 4; // height (doubled per ICO convention)
buf.writeUInt16LE(1, o); o += 2; // planes
buf.writeUInt16LE(32, o); o += 2; // bit count
buf.writeUInt32LE(0, o); o += 4; // compression = BI_RGB
buf.writeUInt32LE(colorDataSize, o); o += 4;
buf.writeInt32LE(0, o); o += 4;
buf.writeInt32LE(0, o); o += 4;
buf.writeUInt32LE(0, o); o += 4;
buf.writeUInt32LE(0, o); o += 4;

// Pixel data, bottom-up, BGRA
for (let y = SIZE - 1; y >= 0; y--) {
  for (let x = 0; x < SIZE; x++) {
    const [r, g, b] = pixels[y][x];
    buf.writeUInt8(b, o); o += 1;
    buf.writeUInt8(g, o); o += 1;
    buf.writeUInt8(r, o); o += 1;
    buf.writeUInt8(255, o); o += 1; // alpha
  }
}

// AND mask, all zero (fully opaque via alpha channel)
o += maskDataSize;

writeFileSync(new URL("../public/favicon.ico", import.meta.url), buf);
console.log(`favicon.ico written (${fileSize} bytes)`);
