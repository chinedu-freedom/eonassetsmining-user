const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'src'),
  path.join(__dirname, '../eonassetsmining/src') // Admin panel
];

const colorMap = {
  '#1e3a8a': '#4c1d95', // blue-900 -> purple-900 (Headers, Buttons, Cards)
  '#3b82f6': '#8b5cf6', // blue-500 -> purple-500 (Icons, Texts)
  '#4082F6': '#8b5cf6', // blue-500 variant
  '#eff6ff': '#f5f3ff', // blue-50 -> purple-50 (Light Backgrounds)
  '#dbeafe': '#ede9fe', // blue-100 -> purple-100 (Hover backgrounds)
  'blue-400': 'purple-400',
  'blue-500': 'purple-500',
  'blue-600': 'purple-600',
  'blue-700': 'purple-700',
  'blue-800': 'purple-800',
  'blue-900': 'purple-900',
  'blue-50': 'purple-50',
  'blue-100': 'purple-100',
};

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = content;
      
      for (const [blue, purple] of Object.entries(colorMap)) {
        // Case-sensitive exact replacements for the hex codes, except standard tailwind classes
        const regex = new RegExp(blue, 'g');
        updated = updated.replace(regex, purple);
      }
      
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log(`Updated colors in: ${fullPath}`);
      }
    }
  }
}

directories.forEach(processDirectory);
console.log('Theme replacement complete!');
