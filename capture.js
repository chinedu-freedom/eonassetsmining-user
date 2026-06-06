const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    // Use desktop viewport since the screenshot showed a mobile container in a desktop view
    await page.setViewport({ width: 1280, height: 900 }); 
    
    console.log("Navigating to login...");
    await page.goto('https://eonassetsmining.com/login', { waitUntil: 'networkidle2' });
    
    console.log("Filling in credentials...");
    await page.type('input[type="email"], input[name="email"]', 'chinedufreedom10@gmail.com');
    await page.type('input[type="password"], input[name="password"]', 'Chinedu2$');
    
    console.log("Submitting...");
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
    
    console.log("Waiting for dashboard to settle...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log("Removing potential modals...");
    await page.evaluate(() => {
      // Try to remove modals that block the view
      const closeBtns = document.querySelectorAll('button');
      closeBtns.forEach(btn => {
        if(btn.innerText.includes('Close') || btn.innerText === 'X') {
          btn.click();
        }
      });
      // Also remove elements with high z-index that look like overlays
      document.querySelectorAll('.fixed, .absolute, [role="dialog"]').forEach(el => {
        const zIndex = window.getComputedStyle(el).zIndex;
        if (zIndex !== 'auto' && parseInt(zIndex) >= 40 && !el.querySelector('nav')) {
          el.remove();
        }
      });
    });

    console.log("Taking screenshot...");
    await page.screenshot({ path: 'dashboard_full.png', fullPage: true });
    
    await browser.close();
    console.log("Success! Saved to dashboard_full.png");
  } catch(e) {
    console.error("Error:", e);
    process.exit(1);
  }
})();
