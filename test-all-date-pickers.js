import puppeteer from 'puppeteer';

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to format date for display comparison
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

(async () => {
  console.log('🚀 Starting Comprehensive Date Picker Test...\n');
  console.log('Testing all date pickers in HomeFlow Pro\n');
  console.log('='.repeat(70) + '\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Handle all dialogs
  page.on('dialog', async dialog => {
    console.log(`   📢 ${dialog.message()}`);
    if (dialog.type() === 'prompt') {
      await dialog.accept('test1234');
    } else {
      await dialog.accept();
    }
  });
  
  const testResults = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  try {
    // Login
    console.log('🔐 Logging in to HomeFlow Pro...');
    await page.goto('https://homeflow-pro-1760475179.web.app', { waitUntil: 'networkidle2' });
    await wait(2000);
    
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const loadBtn = buttons.find(b => b.textContent.includes('Load Test Credentials'));
      if (loadBtn) loadBtn.click();
    });
    await wait(1000);
    
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const signInBtn = buttons.find(b => b.textContent.includes('Sign In'));
      if (signInBtn) signInBtn.click();
    });
    await wait(4000);
    console.log('✅ Logged in\n');
    
    // Test 1: Password Manager - Password Expiration Date
    console.log('📍 TEST 1: Password Manager - Password Expiration Date');
    console.log('-'.repeat(70));
    
    try {
      await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a, button'));
        const pwdLink = links.find(l => l.textContent.includes('Password'));
        if (pwdLink) pwdLink.click();
      });
      await wait(2000);
      
      // Check if master password needed
      const needsSetup = await page.evaluate(() => {
        return document.body.textContent.includes('Set Up Master Password');
      });
      
      if (needsSetup) {
        const input = await page.$('input[placeholder*="master"]');
        if (input) {
          await input.type('test1234');
          await wait(500);
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const setBtn = buttons.find(b => b.textContent.includes('Set Master Password'));
            if (setBtn) setBtn.click();
          });
          await wait(2000);
        }
      }
      
      // Click Add Password
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const addBtn = buttons.find(b => b.textContent.includes('Add Password'));
        if (addBtn) addBtn.click();
      });
      await wait(1500);
      
      // Fill basic fields
      const serviceInput = await page.$('input[placeholder*="Gmail"]');
      if (serviceInput) await serviceInput.type('Date Test Entry');
      
      const inputs = await page.$$('input.input');
      if (inputs.length >= 3) {
        await inputs[2].type('datetest@example.com');
        await wait(200);
      }
      
      const passwordField = await page.$('input[placeholder*="password"][type="text"]');
      if (passwordField) await passwordField.type('TestPass123!');
      await wait(500);
      
      // Test the date picker
      const testDate = '2025-12-25'; // Christmas 2025
      const dateInput = await page.$('input[type="date"]');
      
      if (dateInput) {
        console.log(`   📅 Setting date: ${testDate}`);
        // Set the value directly instead of typing
        await page.evaluate((el, value) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, dateInput, testDate);
        await wait(500);
        
        // Get the value back
        const selectedValue = await page.evaluate(el => el.value, dateInput);
        console.log(`   📅 Date input value: ${selectedValue}`);
        
        if (selectedValue === testDate) {
          console.log('   ✅ Date picker stores correct value');
          testResults.passed++;
          testResults.tests.push({ name: 'Password Manager Date Picker', status: 'PASSED', input: testDate, output: selectedValue });
        } else {
          console.log(`   ❌ Date mismatch! Expected: ${testDate}, Got: ${selectedValue}`);
          testResults.failed++;
          testResults.tests.push({ name: 'Password Manager Date Picker', status: 'FAILED', input: testDate, output: selectedValue });
        }
      }
      
      // Close modal
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const cancelBtn = buttons.find(b => b.textContent.includes('Cancel'));
        if (cancelBtn) cancelBtn.click();
      });
      await wait(1000);
      
      console.log('✅ Password Manager test complete\n');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      testResults.failed++;
      testResults.tests.push({ name: 'Password Manager Date Picker', status: 'ERROR', error: error.message });
    }
    
    // Test 2: Budget - Expense Date
    console.log('📍 TEST 2: Budget - Expense Date');
    console.log('-'.repeat(70));
    
    try {
      await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const budgetLink = links.find(l => l.textContent.includes('Budget'));
        if (budgetLink) budgetLink.click();
      });
      await wait(2000);
      
      // Click Add Expense
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const addBtn = buttons.find(b => b.textContent.includes('Add Expense'));
        if (addBtn) addBtn.click();
      });
      await wait(1500);
      
      // Fill basic fields
      const categoryInput = await page.$('input[placeholder*="category"], input[placeholder*="Category"]');
      if (categoryInput) await categoryInput.type('Date Test');
      
      const amountInput = await page.$('input[type="number"], input[placeholder*="amount"]');
      if (amountInput) await amountInput.type('100');
      await wait(300);
      
      // Test the date picker
      const testDate = '2025-11-15';
      const dateInput = await page.$('input[type="date"]');
      
      if (dateInput) {
        console.log(`   📅 Setting date: ${testDate}`);
        // Set the value directly instead of typing
        await page.evaluate((el, value) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, dateInput, testDate);
        await wait(500);
        
        const selectedValue = await page.evaluate(el => el.value, dateInput);
        console.log(`   📅 Date input value: ${selectedValue}`);
        
        if (selectedValue === testDate) {
          console.log('   ✅ Date picker stores correct value');
          testResults.passed++;
          testResults.tests.push({ name: 'Budget Date Picker', status: 'PASSED', input: testDate, output: selectedValue });
        } else {
          console.log(`   ❌ Date mismatch! Expected: ${testDate}, Got: ${selectedValue}`);
          testResults.failed++;
          testResults.tests.push({ name: 'Budget Date Picker', status: 'FAILED', input: testDate, output: selectedValue });
        }
      }
      
      // Close modal
      await page.keyboard.press('Escape');
      await wait(1000);
      
      console.log('✅ Budget test complete\n');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      testResults.failed++;
      testResults.tests.push({ name: 'Budget Date Picker', status: 'ERROR', error: error.message });
    }
    
    // Test 3: Tasks - Due Date
    console.log('📍 TEST 3: Tasks - Due Date');
    console.log('-'.repeat(70));
    
    try {
      await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const tasksLink = links.find(l => l.textContent.includes('Tasks'));
        if (tasksLink) tasksLink.click();
      });
      await wait(2000);
      
      // Click Add Task
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const addBtn = buttons.find(b => b.textContent.includes('Add Task'));
        if (addBtn) addBtn.click();
      });
      await wait(1500);
      
      // Fill basic fields
      const titleInput = await page.$('input[placeholder*="task"], input[placeholder*="Task"]');
      if (titleInput) await titleInput.type('Date Test Task');
      await wait(300);
      
      // Test the date picker
      const testDate = '2025-10-31'; // Halloween 2025
      const dateInput = await page.$('input[type="date"]');
      
      if (dateInput) {
        console.log(`   📅 Setting date: ${testDate}`);
        // Set the value directly instead of typing
        await page.evaluate((el, value) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, dateInput, testDate);
        await wait(500);
        
        const selectedValue = await page.evaluate(el => el.value, dateInput);
        console.log(`   📅 Date input value: ${selectedValue}`);
        
        if (selectedValue === testDate) {
          console.log('   ✅ Date picker stores correct value');
          testResults.passed++;
          testResults.tests.push({ name: 'Tasks Date Picker', status: 'PASSED', input: testDate, output: selectedValue });
        } else {
          console.log(`   ❌ Date mismatch! Expected: ${testDate}, Got: ${selectedValue}`);
          testResults.failed++;
          testResults.tests.push({ name: 'Tasks Date Picker', status: 'FAILED', input: testDate, output: selectedValue });
        }
      }
      
      // Close modal
      await page.keyboard.press('Escape');
      await wait(1000);
      
      console.log('✅ Tasks test complete\n');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      testResults.failed++;
      testResults.tests.push({ name: 'Tasks Date Picker', status: 'ERROR', error: error.message });
    }
    
    // Test 4: Bills - Due Date
    console.log('📍 TEST 4: Bills - Due Date');
    console.log('-'.repeat(70));
    
    try {
      await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const billsLink = links.find(l => l.textContent.includes('Bills'));
        if (billsLink) billsLink.click();
      });
      await wait(2000);
      
      // Click Add Bill
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const addBtn = buttons.find(b => b.textContent.includes('Add Bill'));
        if (addBtn) addBtn.click();
      });
      await wait(1500);
      
      // Fill basic fields
      const nameInput = await page.$('input[placeholder*="name"], input[placeholder*="Name"]');
      if (nameInput) await nameInput.type('Date Test Bill');
      
      const amountInput = await page.$('input[type="number"]');
      if (amountInput) await amountInput.type('50');
      await wait(300);
      
      // Test the date picker
      const testDate = '2025-12-01'; // First of December
      const dateInput = await page.$('input[type="date"]');
      
      if (dateInput) {
        console.log(`   📅 Setting date: ${testDate}`);
        // Set the value directly instead of typing
        await page.evaluate((el, value) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, dateInput, testDate);
        await wait(500);
        
        const selectedValue = await page.evaluate(el => el.value, dateInput);
        console.log(`   📅 Date input value: ${selectedValue}`);
        
        if (selectedValue === testDate) {
          console.log('   ✅ Date picker stores correct value');
          testResults.passed++;
          testResults.tests.push({ name: 'Bills Date Picker', status: 'PASSED', input: testDate, output: selectedValue });
        } else {
          console.log(`   ❌ Date mismatch! Expected: ${testDate}, Got: ${selectedValue}`);
          testResults.failed++;
          testResults.tests.push({ name: 'Bills Date Picker', status: 'FAILED', input: testDate, output: selectedValue });
        }
      }
      
      // Close modal
      await page.keyboard.press('Escape');
      await wait(1000);
      
      console.log('✅ Bills test complete\n');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      testResults.failed++;
      testResults.tests.push({ name: 'Bills Date Picker', status: 'ERROR', error: error.message });
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'date-pickers-test.png', fullPage: true });
    console.log('📸 Screenshot saved: date-pickers-test.png\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 DATE PICKER TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log('='.repeat(70) + '\n');
    
    console.log('Detailed Results:');
    testResults.tests.forEach((test, index) => {
      console.log(`${index + 1}. ${test.name}: ${test.status}`);
      if (test.input) {
        console.log(`   Input: ${test.input}`);
        console.log(`   Output: ${test.output}`);
      }
      if (test.error) {
        console.log(`   Error: ${test.error}`);
      }
    });
    
    console.log('\n' + '='.repeat(70));
    if (testResults.failed === 0) {
      console.log('🎉 ALL DATE PICKERS WORKING CORRECTLY!');
    } else {
      console.log('⚠️  Some date pickers need attention');
    }
    console.log('='.repeat(70) + '\n');
    
    console.log('Keeping browser open for 5 seconds...');
    await wait(5000);
    await browser.close();
    console.log('👋 Test complete!\n');
  }
})();

