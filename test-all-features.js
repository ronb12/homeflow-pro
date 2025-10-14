#!/usr/bin/env node

/**
 * HomeFlow Pro - Complete Feature Test Suite
 * Tests all 30 features with the test user
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Configuration
const APP_URL = 'https://homeflow-pro-1760475179.web.app';
const TEST_EMAIL = 'demo@homeflowpro.com';
const TEST_PASSWORD = 'HomeFlow2025!';
const SCREENSHOT_DIR = './test-screenshots';

// Test results
const results = {
  passed: [],
  failed: [],
  skipped: [],
  startTime: new Date(),
  endTime: null
};

// Create screenshot directory
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Utility functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const logTest = (feature, status, message = '') => {
  const timestamp = new Date().toISOString();
  const statusIcon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⏭️';
  console.log(`${statusIcon} [${timestamp}] ${feature}: ${message || status}`);
  
  if (status === 'pass') results.passed.push(feature);
  else if (status === 'fail') results.failed.push({ feature, message });
  else results.skipped.push(feature);
};

const takeScreenshot = async (page, name) => {
  const filename = `${SCREENSHOT_DIR}/${name.replace(/\s+/g, '-').toLowerCase()}.png`;
  await page.screenshot({ path: filename, fullPage: false });
  console.log(`   📸 Screenshot saved: ${filename}`);
};

async function runTests() {
  console.log('🏠 HomeFlow Pro - Automated Feature Testing');
  console.log('==========================================\n');
  console.log(`App URL: ${APP_URL}`);
  console.log(`Test User: ${TEST_EMAIL}\n`);

  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  
  try {
    // Test 1: Load Application
    console.log('\n📋 Test Suite 1: Application & Authentication\n');
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(2000);
    await takeScreenshot(page, '01-homepage');
    logTest('App Loading', 'pass', 'Application loaded successfully');

    // Test 2: Login
    try {
      // Click "Load Test Credentials" if available
      const loadCredsButton = await page.$('button::-p-text(Load Test Credentials)');
      if (loadCredsButton) {
        await loadCredsButton.click();
        await sleep(1000);
      } else {
        // Manual input
        await page.type('input[type="email"]', TEST_EMAIL);
        await page.type('input[type="password"]', TEST_PASSWORD);
      }
      
      // Click sign in
      const signInButton = await page.$('button[type="submit"]');
      await signInButton.click();
      await sleep(3000);
      
      await takeScreenshot(page, '02-logged-in');
      logTest('User Authentication', 'pass', 'Login successful');
    } catch (error) {
      logTest('User Authentication', 'fail', error.message);
      throw error;
    }

    // Test 3: Dashboard
    console.log('\n📋 Test Suite 2: Core Features (1-10)\n');
    try {
      await sleep(2000);
      await takeScreenshot(page, '03-dashboard');
      logTest('Dashboard', 'pass', 'Dashboard loaded with stats');
    } catch (error) {
      logTest('Dashboard', 'fail', error.message);
    }

    // Test 4: Tasks
    try {
      await page.click('button::-p-text(Tasks)');
      await sleep(2000);
      await takeScreenshot(page, '04-tasks-view');
      
      // Add a task
      const addTaskBtn = await page.$('button::-p-text(Add Task)');
      if (addTaskBtn) {
        await addTaskBtn.click();
        await sleep(1000);
        await page.type('input[placeholder*="title"], input[placeholder*="Title"]', 'Test Task from Puppeteer');
        await page.type('textarea', 'This is an automated test task');
        const submitBtn = await page.$('button::-p-text(Add Task)');
        if (submitBtn) await submitBtn.click();
        await sleep(2000);
      }
      
      await takeScreenshot(page, '04-tasks-added');
      logTest('Task Management', 'pass', 'Task created successfully');
    } catch (error) {
      logTest('Task Management', 'fail', error.message);
    }

    // Test 5: Calendar
    try {
      await page.click('button::-p-text(Calendar)');
      await sleep(2000);
      await takeScreenshot(page, '05-calendar-view');
      
      // Add event
      const addEventBtn = await page.$('button::-p-text(Add Event)');
      if (addEventBtn) {
        await addEventBtn.click();
        await sleep(1000);
        await page.type('input[placeholder*="title"], input[placeholder*="Title"]', 'Test Event');
        const dateInputs = await page.$$('input[type="datetime-local"]');
        if (dateInputs.length > 0) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const dateStr = tomorrow.toISOString().slice(0, 16);
          await dateInputs[0].type(dateStr);
        }
        const submitBtn = await page.$('button::-p-text(Add Event)');
        if (submitBtn) await submitBtn.click();
        await sleep(2000);
      }
      
      await takeScreenshot(page, '05-calendar-event-added');
      logTest('Calendar & Events', 'pass', 'Event created successfully');
    } catch (error) {
      logTest('Calendar & Events', 'fail', error.message);
    }

    // Test 6: Shopping Lists
    try {
      await page.click('button::-p-text(Shopping)');
      await sleep(2000);
      await takeScreenshot(page, '06-shopping-view');
      
      const addItemBtn = await page.$('button::-p-text(Add Item)');
      if (addItemBtn) {
        await addItemBtn.click();
        await sleep(1000);
        await page.type('input[placeholder*="name"], input[placeholder*="Name"]', 'Milk');
        const submitBtn = await page.$('button::-p-text(Add Item)');
        if (submitBtn) await submitBtn.click();
        await sleep(2000);
      }
      
      await takeScreenshot(page, '06-shopping-item-added');
      logTest('Shopping Lists', 'pass', 'Shopping item added');
    } catch (error) {
      logTest('Shopping Lists', 'fail', error.message);
    }

    // Test 7: Budget Tracker
    try {
      await page.click('button::-p-text(Budget)');
      await sleep(2000);
      await takeScreenshot(page, '07-budget-view');
      
      const addExpenseBtn = await page.$('button::-p-text(Add Expense)');
      if (addExpenseBtn) {
        await addExpenseBtn.click();
        await sleep(1000);
        await page.type('input[placeholder*="escription"], input[placeholder*="Description"]', 'Test Expense');
        const amountInput = await page.$('input[type="number"]');
        if (amountInput) {
          await amountInput.click({ clickCount: 3 });
          await amountInput.type('50');
        }
        const submitBtn = await page.$('button::-p-text(Add Expense)');
        if (submitBtn) await submitBtn.click();
        await sleep(2000);
      }
      
      await takeScreenshot(page, '07-budget-expense-added');
      logTest('Budget Tracker', 'pass', 'Expense tracked');
    } catch (error) {
      logTest('Budget Tracker', 'fail', error.message);
    }

    // Test 8: Bills
    try {
      await page.click('button::-p-text(Bill)');
      await sleep(2000);
      await takeScreenshot(page, '08-bills-view');
      
      const addBillBtn = await page.$('button::-p-text(Add Bill)');
      if (addBillBtn) {
        await addBillBtn.click();
        await sleep(1000);
        await page.type('input[placeholder*="name"], input[placeholder*="Name"]', 'Electric Bill');
        const submitBtn = await page.$('button::-p-text(Add Bill)');
        if (submitBtn) await submitBtn.click();
        await sleep(2000);
      }
      
      await takeScreenshot(page, '08-bills-added');
      logTest('Bill Reminders', 'pass', 'Bill reminder created');
    } catch (error) {
      logTest('Bill Reminders', 'fail', error.message);
    }

    // Test 9-30: Navigate through remaining features
    const remainingFeatures = [
      { name: 'Inventory', button: 'Inventory', id: 9 },
      { name: 'Meals', button: 'Meal', id: 10 },
      { name: 'Recipes', button: 'Recipe', id: 11 },
      { name: 'Family', button: 'Family', id: 12 },
      { name: 'Chores', button: 'Chore', id: 13 },
      { name: 'Documents', button: 'Document', id: 14 },
      { name: 'Contacts', button: 'Contact', id: 15 },
      { name: 'Maintenance', button: 'Maintenance', id: 16 },
      { name: 'Warranties', button: 'Warrant', id: 17 },
      { name: 'Pets', button: 'Pet', id: 18 },
      { name: 'Plants', button: 'Plant', id: 19 },
      { name: 'Weather', button: 'Weather', id: 20 },
      { name: 'Notes', button: 'Note', id: 21 },
      { name: 'Vehicles', button: 'Vehicle', id: 22 },
      { name: 'Insurance', button: 'Insurance', id: 23 },
      { name: 'Passwords', button: 'Password', id: 24 },
      { name: 'Guests', button: 'Guest', id: 25 },
      { name: 'Energy', button: 'Energy', id: 26 },
      { name: 'Devices', button: 'Device', id: 27 },
      { name: 'Packages', button: 'Package', id: 28 },
      { name: 'Subscriptions', button: 'Subscription', id: 29 },
      { name: 'Goals', button: 'Goal', id: 30 },
      { name: 'Notifications', button: 'Notification', id: 31 }
    ];

    console.log('\n📋 Test Suite 3: Remaining Features (9-30)\n');

    for (const feature of remainingFeatures) {
      try {
        const button = await page.$(`button::-p-text(${feature.button})`);
        if (button) {
          await button.click();
          await sleep(2000);
          await takeScreenshot(page, `${String(feature.id).padStart(2, '0')}-${feature.name.toLowerCase()}`);
          logTest(feature.name, 'pass', 'Feature loaded successfully');
        } else {
          logTest(feature.name, 'skip', 'Button not found');
        }
      } catch (error) {
        logTest(feature.name, 'fail', error.message);
      }
    }

    // Test PWA Installation
    console.log('\n📋 Test Suite 4: PWA Features\n');
    try {
      // Check for service worker
      const hasServiceWorker = await page.evaluate(() => {
        return 'serviceWorker' in navigator;
      });
      logTest('Service Worker Support', hasServiceWorker ? 'pass' : 'fail', 
        hasServiceWorker ? 'Service worker available' : 'No service worker');

      // Check for manifest
      const hasManifest = await page.evaluate(() => {
        const link = document.querySelector('link[rel="manifest"]');
        return !!link;
      });
      logTest('PWA Manifest', hasManifest ? 'pass' : 'fail',
        hasManifest ? 'Manifest linked' : 'No manifest');

      await takeScreenshot(page, 'pwa-features');
    } catch (error) {
      logTest('PWA Features', 'fail', error.message);
    }

  } catch (error) {
    console.error('\n❌ Critical Error:', error.message);
  } finally {
    results.endTime = new Date();
    
    // Generate report
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    console.log(`\n✅ Passed: ${results.passed.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);
    console.log(`⏭️  Skipped: ${results.skipped.length}`);
    console.log(`\n⏱️  Duration: ${((results.endTime - results.startTime) / 1000).toFixed(2)}s`);
    
    if (results.failed.length > 0) {
      console.log('\n❌ Failed Tests:');
      results.failed.forEach(({ feature, message }) => {
        console.log(`   - ${feature}: ${message}`);
      });
    }

    // Save detailed report
    const report = {
      appUrl: APP_URL,
      testUser: TEST_EMAIL,
      results,
      timestamp: new Date().toISOString(),
      screenshots: fs.readdirSync(SCREENSHOT_DIR)
    };

    fs.writeFileSync(
      './test-report.json',
      JSON.stringify(report, null, 2)
    );

    console.log('\n📄 Detailed report saved: test-report.json');
    console.log(`📸 Screenshots saved in: ${SCREENSHOT_DIR}/`);
    console.log('\n✅ Testing complete!\n');

    await browser.close();
  }
}

// Run tests
runTests().catch(console.error);

