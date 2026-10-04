import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function createLinkedInBanner() {
  const WIDTH = 1584;
  const HEIGHT = 396;

  const artifactDir = 'C:/Users/SDC TECH/.gemini/antigravity/brain/a9fdb2ad-7d55-49d6-9ecb-47670cb1eba2';
  const sourceBanner = path.join(artifactDir, 'growech_banner_no_circle_1790479185066.jpg');
  const sourceLogo = 'C:/Users/SDC TECH/.gemini/antigravity/scratch/growech-solution/public/assets/growech-logo.png';
  const outputPath = path.join(artifactDir, 'growech_linkedin_banner_perfect_1584x396.png');

  // 1. Create solid luxury obsidian black base canvas (#0A0A0B)
  const baseCanvas = await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: 10, g: 10, b: 11, alpha: 1 }
    }
  }).png().toBuffer();

  // 2. Extract and resize the Left Glow from source (x: 0..460, y: 0..768)
  const leftGlow = await sharp(sourceBanner)
    .extract({ left: 0, top: 0, width: 480, height: 768 })
    .resize(null, HEIGHT)
    .toBuffer();
  const leftMeta = await sharp(leftGlow).metadata();

  // 3. Extract and resize Right Tech Circuits cleanly (x: 1180..1376, y: 0..768)
  const rightTech = await sharp(sourceBanner)
    .extract({ left: 1180, top: 0, width: 196, height: 768 })
    .resize(null, HEIGHT)
    .toBuffer();
  const rightMeta = await sharp(rightTech).metadata();

  // 4. Prepare Crisp Golden 3D Logo (height: 142px)
  const logoBuffer = await sharp(sourceLogo)
    .resize(null, 142, { fit: 'inside' })
    .toBuffer();
  const logoMeta = await sharp(logoBuffer).metadata();

  // Horizontal Content Center:
  // Since avatar takes X=0 to ~320px, the center of the visible area (340px to 1584px) is ~960px.
  const contentCenterX = 960;
  const logoX = Math.round(contentCenterX - (logoMeta.width / 2));
  const logoY = 48;
  const titleY = logoY + logoMeta.height + 46;
  const subtitleY = titleY + 34;

  // 5. SVG overlay with clean text and soft blending gradients
  const svgOverlay = `
  <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="50%" stop-color="#FFF3E0" />
        <stop offset="100%" stop-color="#FFD180" />
      </linearGradient>
    </defs>

    <!-- Clean Typography perfectly centered in safe 396px vertical zone -->
    <text 
      x="${contentCenterX}" 
      y="${titleY}" 
      text-anchor="middle" 
      font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
      font-size="40" 
      font-weight="900" 
      letter-spacing="6" 
      fill="url(#goldGradient)"
    >GROWECH SOLUTION</text>

    <text 
      x="${contentCenterX}" 
      y="${subtitleY}" 
      text-anchor="middle" 
      font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
      font-size="15.5" 
      font-weight="600" 
      letter-spacing="3" 
      fill="#E6A856"
    >HIGH-END DIGITAL ARCHITECTURE  •  WEB  •  AI  •  AUTOMATION</text>
  </svg>
  `;

  // 6. Composite seamlessly
  await sharp(baseCanvas)
    .composite([
      { input: leftGlow, top: 0, left: 0 },
      { input: rightTech, top: 0, left: WIDTH - rightMeta.width },
      { input: Buffer.from(svgOverlay), top: 0, left: 0 },
      { input: logoBuffer, top: logoY, left: logoX }
    ])
    .png({ quality: 100 })
    .toFile(outputPath);

  console.log('SUCCESS: Clean 1584x396 LinkedIn banner generated at:', outputPath);
}

createLinkedInBanner().catch(err => console.error('Error generating banner:', err));
