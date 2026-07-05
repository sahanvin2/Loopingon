const sharp = require('sharp');
const fs = require('fs');

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Soft shadow -->
  <polygon points="256,60 480,460 32,460" fill="rgba(0,0,0,0.1)"/>
  <!-- Main red triangle -->
  <polygon points="256,50 480,450 32,450" fill="#E63946" stroke="#D90429" stroke-width="8" stroke-linejoin="round"/>
</svg>`;

async function main() {
  const outDir = 'd:/Mern/Loopingon/loopingon/apps/web/public/';
  const input = Buffer.from(svg);
  
  await sharp(input).resize(512, 512).png().toFile(outDir + 'logo.png');
  
  // Create PNG icons
  await sharp(input).resize(16, 16).png().toFile(outDir + 'favicon-16x16.png');
  await sharp(input).resize(32, 32).png().toFile(outDir + 'favicon-32x32.png');
  await sharp(input).resize(180, 180).png().toFile(outDir + 'apple-touch-icon.png');
  await sharp(input).resize(192, 192).png().toFile(outDir + 'icons/icon-192x192.png');
  await sharp(input).resize(512, 512).png().toFile(outDir + 'icons/icon-512x512.png');
  
  // Create og-image
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
    .composite([{ input, gravity: 'center' }])
    .jpeg().toFile(outDir + 'og-image.jpg');

  await sharp(input).resize(32, 32).png().toFile('d:/Mern/Loopingon/loopingon/apps/web/src/app/favicon.ico');
  await sharp(input).resize(32, 32).png().toFile(outDir + 'favicon.ico');

  console.log('Successfully generated the red triangle icons!');
}

main().catch(console.error);
