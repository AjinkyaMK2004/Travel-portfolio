import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');

try {
  const indexHtmlPath = path.join(distDir, 'index.html');
  const redirectHtmlPath = path.join(distDir, '404.html');

  if (fs.existsSync(indexHtmlPath)) {
    fs.copyFileSync(indexHtmlPath, redirectHtmlPath);
    console.log('✓ Successfully duplicated index.html to 404.html for GitHub Pages router fallback.');
  } else {
    console.warn('⚠ index.html not found in dist. Skipping copy.');
  }
} catch (error) {
  console.error('Failed to copy index.html to 404.html:', error);
  process.exit(1);
}
