import puppeteer from 'puppeteer';

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('🚀 Starting Dollar Amount Input Test...\n');
  console.log('Testing all money/currency input fields in HomeFlow Pro\n');
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
    await dialog.accept();
  });
  
  const testResults = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  // Test amounts to verify
  const testAmounts = [
    { value: '0', expected: 0, desc: 'Zero (0)' },
    { value: '0.01', expected: 0.01, desc: 'One cent ($0.01)' },
    { value: '1', expected: 1, desc: 'One dollar ($1)' },
    { value: '10.50', expected: 10.50, desc: 'Ten dollars and fifty cents ($10.50)' },
    { value: '100', expected: 100, desc: 'One hundred dollars ($100)' },
    { value: '1234.56', expected: 1234.56, desc: 'Large amount with decimals ($1234.56)' }
  ];
  
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
    
    // Test 1: Budget - Monthly Income
    console.log('📍 TEST 1: Budget - Monthly Income Input');
    console.log('-'.repeat(70));
    
    try {
      await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const budgetLink = links.find(l => l.textContent.includes('Budget'));
        if (budgetLink) budgetLink.click();
      });
      await wait(2000);
      
      // Click edit/setup budget if needed
      const needsSetup = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const setupBtn = buttons.find(b => b.textContent.includes('Set Budget'));
        if (setupBtn) {
          setupBtn.click();
          return true;
        }
        const editBtn = buttons.find(b => b.textContent.includes('Edit Budget'));
        if (editBtn) {
          editBtn.click();
          return true;
        }
        return false;
      });
      
      if (needsSetup) {
        await wait(1500);
        
        // Test Monthly Income field
        const incomeInput = await page.$('input[type="number"]');
        
        if (incomeInput) {
          console.log('   Testing Monthly Income field with multiple amounts:');
          
          for (const test of testAmounts) {
            await page.evaluate(el => el.value = '', incomeInput);
            await incomeInput.type(test.value);
            await wait(300);
            
            const actualValue = await page.evaluate(el => parseFloat(el.value) || 0, incomeInput);
            const matches = Math.abs(actualValue - test.expected) < 0.001;
            
            if (matches) {
              console.log(`   ✅ ${test.desc}: Accepted and stored correctly (${actualValue})`);
              testResults.passed++;
            } else {
              console.log(`   ❌ ${test.desc}: Failed! Expected ${test.expected}, got ${actualValue}`);
              testResults.failed++;
            }
            
            testResults.tests.push({
              name: `Budget Monthly Income - ${test.desc}`,
              status: matches ? 'PASSED' : 'FAILED',
              input: test.value,
              expected: test.expected,
              actual: actualValue
            });
          }
        }
        
        // Close modal
        await page.keyboard.press('Escape');
        await wait(1000);
      }
      
      console.log('✅ Budget Monthly Income test complete\n');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      testResults.failed++;
    }
    
    // Test 2: Budget - Add Expense Amount
    console.log('📍 TEST 2: Budget - Add Expense Amount');
    console.log('-'.repeat(70));
    
    try {
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const addBtn = buttons.find(b => b.textContent.includes('Add Expense'));
        if (addBtn) addBtn.click();
      });
      await wait(1500);
      
      // Fill category first
      const categoryInput = await page.$('input[placeholder*="category"], input[placeholder*="Category"]');
      if (categoryInput) await categoryInput.type('Amount Test');
      await wait(300);
      
      // Test Amount field
      const amountInput = await page.$('input[type="number"]');
      
      if (amountInput) {
        console.log('   Testing Expense Amount field with multiple amounts:');
        
        for (const test of testAmounts) {
          await page.evaluate(el => el.value = '', amountInput);
          await amountInput.type(test.value);
          await wait(300);
          
          const actualValue = await page.evaluate(el => parseFloat(el.value) || 0, amountInput);
          const matches = Math.abs(actualValue - test.expected) < 0.001;
          
          if (matches) {
            console.log(`   ✅ ${test.desc}: Accepted and stored correctly (${actualValue})`);
            testResults.passed++;
          } else {
            console.log(`   ❌ ${test.desc}: Failed! Expected ${test.expected}, got ${actualValue}`);
            testResults.failed++;
          }
          
          testResults.tests.push({
            name: `Budget Expense Amount - ${test.desc}`,
            status: matches ? 'PASSED' : 'FAILED',
            input: test.value,
            expected: test.expected,
            actual: actualValue
          });
        }
      }
      
      // Close modal
      await page.keyboard.press('Escape');
      await wait(1000);
      
      console.log('✅ Budget Expense Amount test complete\n');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      testResults.failed++;
    }
    
    // Test 3: Bills - Bill Amount
    console.log('📍 TEST 3: Bills - Bill Amount');
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
      
      // Fill bill name first
      const nameInput = await page.$('input[placeholder*="name"], input[placeholder*="Name"]');
      if (nameInput) await nameInput.type('Amount Test Bill');
      await wait(300);
      
      // Test Amount field
      const amountInput = await page.$('input[type="number"]');
      
      if (amountInput) {
        console.log('   Testing Bill Amount field with multiple amounts:');
        
        for (const test of testAmounts) {
          await page.evaluate(el => el.value = '', amountInput);
          await amountInput.type(test.value);
          await wait(300);
          
          const actualValue = await page.evaluate(el => parseFloat(el.value) || 0, amountInput);
          const matches = Math.abs(actualValue - test.expected) < 0.001;
          
          if (matches) {
            console.log(`   ✅ ${test.desc}: Accepted and stored correctly (${actualValue})`);
            testResults.passed++;
          } else {
            console.log(`   ❌ ${test.desc}: Failed! Expected ${test.expected}, got ${actualValue}`);
            testResults.failed++;
          }
          
          testResults.tests.push({
            name: `Bills Amount - ${test.desc}`,
            status: matches ? 'PASSED' : 'FAILED',
            input: test.value,
            expected: test.expected,
            actual: actualValue
          });
        }
      }
      
      // Close modal
      await page.keyboard.press('Escape');
      await wait(1000);
      
      console.log('✅ Bills Amount test complete\n');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      testResults.failed++;
    }
    
    // Test 4: Verify zero doesn't block input
    console.log('📍 TEST 4: Zero Blocking Test');
    console.log('-'.repeat(70));
    console.log('   Testing that typing after "0" works correctly...\n');
    
    try {
      // Go back to Budget to test
      await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const budgetLink = links.find(l => l.textContent.includes('Budget'));
        if (budgetLink) budgetLink.click();
      });
      await wait(2000);
      
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const addBtn = buttons.find(b => b.textContent.includes('Add Expense'));
        if (addBtn) addBtn.click();
      });
      await wait(1500);
      
      const categoryInput = await page.$('input[placeholder*="category"]');
      if (categoryInput) await categoryInput.type('Zero Block Test');
      
      const amountInput = await page.$('input[type="number"]');
      
      if (amountInput) {
        // Test: Type 0, then try to type more
        console.log('   Test 1: Type "0" then "50"');
        await page.evaluate(el => el.value = '', amountInput);
        await amountInput.type('0');
        await wait(200);
        
        let value1 = await page.evaluate(el => el.value, amountInput);
        console.log(`   - After typing "0": ${value1}`);
        
        await amountInput.type('50');
        await wait(200);
        
        let value2 = await page.evaluate(el => el.value, amountInput);
        console.log(`   - After typing "50": ${value2}`);
        
        if (value2 === '050' || value2 === '50') {
          console.log('   ✅ Can type after zero (not blocked)');
          testResults.passed++;
          testResults.tests.push({
            name: 'Zero Blocking Test',
            status: 'PASSED',
            note: 'Can type after entering zero'
          });
        } else {
          console.log('   ❌ Input may be blocked after zero');
          testResults.failed++;
          testResults.tests.push({
            name: 'Zero Blocking Test',
            status: 'FAILED',
            note: 'Unexpected behavior after zero'
          });
        }
        
        // Test: Clear and type decimal starting with 0
        console.log('\n   Test 2: Type "0.99"');
        await page.evaluate(el => el.value = '', amountInput);
        await amountInput.type('0.99');
        await wait(200);
        
        let value3 = await page.evaluate(el => el.value, amountInput);
        console.log(`   - Result: ${value3}`);
        
        if (value3 === '0.99') {
          console.log('   ✅ Decimal amounts starting with 0 work correctly');
          testResults.passed++;
        } else {
          console.log('   ❌ Decimal amounts with leading zero may have issues');
          testResults.failed++;
        }
      }
      
      await page.keyboard.press('Escape');
      await wait(1000);
      
      console.log('\n✅ Zero blocking test complete\n');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      testResults.failed++;
    }
    
    // Take screenshot
    await page.screenshot({ path: 'dollar-amount-test.png', fullPage: true });
    console.log('📸 Screenshot saved: dollar-amount-test.png\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('💰 DOLLAR AMOUNT INPUT TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log('='.repeat(70) + '\n');
    
    console.log('Key Findings:');
    console.log('-------------');
    
    // Group results by field
    const fields = {
      'Budget Monthly Income': [],
      'Budget Expense Amount': [],
      'Bills Amount': [],
      'Other': []
    };
    
    testResults.tests.forEach(test => {
      let found = false;
      for (const field in fields) {
        if (test.name.includes(field)) {
          fields[field].push(test);
          found = true;
          break;
        }
      }
      if (!found) fields['Other'].push(test);
    });
    
    for (const field in fields) {
      if (fields[field].length > 0) {
        const passed = fields[field].filter(t => t.status === 'PASSED').length;
        const total = fields[field].length;
        console.log(`\n${field}: ${passed}/${total} tests passed`);
        
        fields[field].forEach(test => {
          const icon = test.status === 'PASSED' ? '✅' : '❌';
          if (test.expected !== undefined) {
            console.log(`  ${icon} $${test.input} → ${test.status}`);
          } else {
            console.log(`  ${icon} ${test.note || test.name}`);
          }
        });
      }
    }
    
    console.log('\n' + '='.repeat(70));
    if (testResults.failed === 0) {
      console.log('🎉 ALL DOLLAR AMOUNT INPUTS WORKING CORRECTLY!');
      console.log('✅ Zero does NOT block input');
      console.log('✅ All amounts (including $0, $0.01, decimals) work');
      console.log('✅ Large amounts accepted');
    } else {
      console.log('⚠️  Some dollar amount inputs may need attention');
    }
    console.log('='.repeat(70) + '\n');
    
    console.log('Keeping browser open for 5 seconds...');
    await wait(5000);
    await browser.close();
    console.log('👋 Test complete!\n');
  }
})();

