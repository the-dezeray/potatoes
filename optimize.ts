import sharp from "sharp";
import path from "path";

const base = process.env.INIT_CWD ?? process.cwd();
const input = path.resolve(base, process.argv[2]);
const outputArg = process.argv[3] ?? (path.basename(process.argv[2], path.extname(process.argv[2])) + ".webp");
const output = path.resolve(base, outputArg);

sharp(input)
  .resize(1200)
  .webp({ quality: 80 })
  .toFile(output)
  .then(() => console.log("Optimized!"))
  .catch(console.error);