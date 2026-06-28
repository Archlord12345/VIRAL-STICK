const fs = require('fs');
const path = require('path');

// Source logo
const SOURCE_LOGO_PATH = path.join(__dirname, '../asset/logo/logo_sans_fond.png');
const SOURCE_LOGO_WITHOUT_BG_PATH = path.join(__dirname, '../asset/logo/logo_sans_fond.png');

// Target directories
const TARGETS = [
  path.join(__dirname, '../web/public/asset/logo'),
  path.join(__dirname, '../mobile/assets/logo'),
];

console.log('🚀 Viral Stick Logo Compiler!');
console.log('============================');

// Copy logo files to all target directories
TARGETS.forEach(targetDir => {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Copy both logo versions
  ['logo.png', 'logo_sans_fond.png'].forEach(fileName => {
    const src = path.join(__dirname, '../asset/logo', fileName);
    const dest = path.join(targetDir, fileName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Copied ${fileName} to ${targetDir}`);
    } else {
      console.warn(`⚠️ Source ${fileName} not found, skipping`);
    }
  });
});

console.log('\n✅ All logos copied successfully!');
