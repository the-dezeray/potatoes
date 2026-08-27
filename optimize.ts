import sharp from "sharp";
import path from "path";
import fs from "fs";

const base = process.env.INIT_CWD ?? process.cwd();
const input = path.resolve(base, process.argv[2]);
const outputArg = process.argv[3] ?? (path.basename(process.argv[2], path.extname(process.argv[2])) + ".webp");
const output = path.resolve(base, outputArg);

// 1. Get the original file size
const stats = fs.statSync(input);
const originalSize = stats.size;

sharp(input)
  .resize(1200)
  .webp({ quality: 80 })
  .toFile(output)
  .then((info) => {
    // 2. 'info' contains the 'size' of the output file
    const newSize = info.size;
    const reduction = ((originalSize - newSize) / originalSize) * 100;

    console.log(`Optimized!`);
    console.log(`Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`New:      ${(newSize / 1024).toFixed(2)} KB`);
    console.log(`Reduction: ${reduction.toFixed(2)}%`);
  })
  .catch(console.error);