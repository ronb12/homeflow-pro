import puppeteer from 'puppeteer';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('🚀 Simple Package Tracking Test\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
    devtools: true, // Open dev tools to see console
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  page.on('dialog', async dialog => {
    console.log(`📢 ${dialog.message()}`);
    await dialog.accept();
  });
  
  try {
    console.log('Step 1: Login');
    await page.goto('https://homeflow-pro-1760475179.web.app');
    await wait(2000);
    
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        if (b.textContent.includes('Load Test Credentials')) b.click();
      });
    });
    await wait(1000);
    
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        if (b.textContent.includes('Sign In')) b.click();
      });
    });
    await wait(4000);
    console.log('✅ Logged in\n');
    
    console.log('Step 2: Navigate to Packages');
    await page.goto('https://homeflow-pro-1760475179.web.app/packages');
    await wait(3000);
    console.log('✅ On Packages page\n');
    
    console.log('Step 3: Add ONE package manually');
    console.log('------------------------------------------------');
    console.log('Please manually:');
    console.log('1. Click "Add New" button');
    console.log('2. Fill in:');
    console.log('   - Description: Test UPS Package');
    console.log('   - Tracking Number: 1Z999AA10123456784');
    console.log('   - Carrier: UPS');
    console.log('   - Status: Shipped');
    console.log('3. Click "Add" button');
    console.log('4. Verify the "Track Package on UPS" link appears');
    console.log('5. Click the link to verify it opens UPS tracking page');
    console.log('\nBrowser will stay open for 60 seconds...\n');
    
    await wait(60000);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
    console.log('Test complete!');
  }
})();

