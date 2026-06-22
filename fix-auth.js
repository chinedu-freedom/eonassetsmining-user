import fs from 'fs';
import path from 'path';

const files = [
  'src/app/page.js',
  'src/app/auth/register/page.jsx',
  'src/app/auth/forgot-password/page.jsx',
  'src/app/auth/reset-password/page.jsx',
  'src/app/auth/verify-email/page.jsx',
  'src/app/auth/verify-otp/page.jsx'
];

for (const file of files) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file}, does not exist`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove import
  content = content.replace(/import authImage from [^;]+;\r?\n?/g, '');

  // Change main wrapper
  content = content.replace(/className="min-h-screen flex flex-col (?:lg|md):flex-row bg-white"/g, 'className="min-h-screen flex items-center justify-center bg-white"');

  // Change left container to be full width centered (remove w-1/2 and lg:w-1/2)
  content = content.replace(/className="([^"]*)w-full (?:lg|md):w-1\/2([^"]*)"/g, 'className="$1w-full max-w-xl$2"');
  
  // Specific fix for register page which had min-h-screen on the left container
  content = content.replace(/className="min-h-screen w-full (?:lg|md):w-1\/2 flex items-center justify-center p-8 (?:lg|md):p-12 overflow-y-auto"/g, 'className="w-full max-w-xl flex items-center justify-center p-8 overflow-y-auto"');

  // Specific fix for verify-email which had min-h-screen on the left container
  content = content.replace(/className="min-h-screen flex flex-col justify-center items-center w-full (?:lg|md):w-1\/2 px-8 (?:lg|md):px-16 py-12 overflow-y-auto"/g, 'className="flex flex-col justify-center items-center w-full max-w-xl px-8 py-12 overflow-y-auto"');

  // Remove the right side container
  const regexImageSection = /<div className="hidden (?:lg|md)[^>]+w-1\/2[^>]*>[\s\S]*?<Image[\s\S]*?authImage[\s\S]*?<\/div>\s*<\/div>/g;
  content = content.replace(regexImageSection, '');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}
