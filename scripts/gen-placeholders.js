const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const publicDir = path.join(__dirname, "..", "apps", "web", "public", "images");

const dirs = {
  hero: ["handloom.jpg", "artisan.jpg", "competition.jpg"],
  testimonials: ["michael.jpg", "samantha.jpg", "james.jpg", "priya.jpg", "dilani.jpg"],
  categories: ["handloom.jpg", "wood-carving.jpg", "pottery.jpg", "jewelry.jpg", "batik.jpg", "lacquerware.jpg", "coir.jpg", "leather.jpg"],
  artisans: ["sunil.jpg", "nayana.jpg", "artisan-1.jpg", "artisan-2.jpg", "artisan-3.jpg"],
  products: ["mask1.jpg", "mask2.jpg", "mask3.jpg", "batik1.jpg", "batik2.jpg", "saree1.jpg"],
  sustainability: ["sri-lanka-nature.jpg"],
  careers: ["team-sri-lanka.jpg"],
  sell: ["artisan-working.jpg"],
  about: ["sri-lanka-artisans.jpg"],
};

async function generate() {
  for (const [dir, files] of Object.entries(dirs)) {
    const dirPath = path.join(publicDir, dir);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    for (const f of files) {
      const filePath = path.join(dirPath, f);
      const r = Math.floor(Math.random() * 156) + 100;
      const g = Math.floor(Math.random() * 156) + 100;
      const b = Math.floor(Math.random() * 156) + 100;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect fill="rgb(${r},${g},${b})" width="800" height="600"/><text fill="white" font-size="40" font-family="Arial" text-anchor="middle" x="400" y="310">${f}</text></svg>`;
      await sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toFile(filePath);
      console.log("Created", filePath);
    }
  }
  console.log("Done!");
}

generate().catch(console.error);
