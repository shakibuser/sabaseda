import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const TARGET_DIR = path.resolve("public/images");
const MAX_WIDTH = 1600;
const SKIP_IF_UNDER_BYTES = 300 * 1024; // 300KB — already small enough, skip
const RASTER_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!RASTER_EXTENSIONS.has(ext)) return;

  const original = await stat(filePath);
  if (original.size <= SKIP_IF_UNDER_BYTES) return;

  const image = sharp(filePath);
  const metadata = await image.metadata();

  let pipeline = image;
  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH });
  }

  let outputBuffer;
  if (ext === ".jpg" || ext === ".jpeg") {
    outputBuffer = await pipeline
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();
  } else if (ext === ".png") {
    outputBuffer = await pipeline
      .png({ quality: 78, compressionLevel: 9, palette: true })
      .toBuffer();
  } else if (ext === ".webp") {
    outputBuffer = await pipeline.webp({ quality: 78 }).toBuffer();
  } else {
    return;
  }

  if (outputBuffer.length < original.size) {
    const fs = await import("node:fs/promises");
    await fs.writeFile(filePath, outputBuffer);
    const savedKb = ((original.size - outputBuffer.length) / 1024).toFixed(0);
    console.log(
      `Compressed ${path.relative(process.cwd(), filePath)} — saved ${savedKb}KB`
    );
  }
}

async function main() {
  const files = await walk(TARGET_DIR);
  for (const file of files) {
    try {
      await compressImage(file);
    } catch (error) {
      console.error(`Failed to compress ${file}:`, error.message);
    }
  }
}

main();
