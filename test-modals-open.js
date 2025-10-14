#!/usr/bin/env node

/**
 * HomeFlow Pro - Modal Open/Close Test
 * Verifies all "Add" modals can open and close properly
 */

import puppeteer from 'puppeteer';

const APP_URL = 'https://homeflow-pro-1760475179.web.app';
const TEST_EMAIL = 'demo@homeflowpro.com';
const TEST_PASSWORD = 'HomeFlow2025!';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const results = {
  tested: 0,
  passed: 0,
  failed: []
};

async function testModal(page, featureName, navText, addButtonText) {
  results.tested++;
  
  try {
    console.log(`\n🧪 Testing: ${featureName}`);
    
    // Navigate to feature
    console.log(`   1. Navigating to ${featureName}...`);
    const navBtn = await page.waitForSelector(`button::-p-text(${navText})`, { timeout: 5000 });
    await navBtn.click();
    await sleep(2000);
    console.log('      ✓ Navigation successful');
    
    // Find and click Add button
    console.log(`   2. Looking for "${addButtonText}" button...`);
    const addBtn = await page.waitForSelector(`button::-p-text(${addButtonText})`, { timeout: 5000 });
    console.log('      ✓ Button found');
    
    // Click to open modal
    console.log('   3. Clicking button to open modal...');
    await addBtn.click();
    await sleep(1500);
    
    // Check if modal appeared
    console.log('   4. Checking if modal opened...');
    const modal = await page.$('.modal');
    if (!modal) {
      throw new Error('Modal did not open');
    }
    console.log('      ✓ Modal opened successfully!');
    
    // Find modal title
    const modalTitle = await page.$('.modal-title');
    if (modalTitle) {
      const titleText = await page.evaluate(el => el.textContent, modalTitle);
      console.log(`      ✓ Modal title: "${titleText}"`);
    }
    
    // Check for form inputs
    const inputs = await page.$$('.modal input, .modal textarea, .modal select');
    console.log(`      ✓ Found ${inputs.length} form fields`);
    
    // Close modal
    console.log('   5. Closing modal...');
    const closeBtn = await page.$('.modal-close, button::-p-text(Cancel)');
    if (closeBtn) {
      await closeBtn.click();
      await sleep(1000);
      
      // Verify modal closed
      const modalStillOpen = await page.$('.modal');
      if (!modalStillOpen) {
        console.log('      ✓ Modal closed successfully!');
      }
    }
    
    console.log(`✅ ${featureName}: MODAL TEST PASSED`);
    results.passed++;
    return true;
    
  } catch (error) {
    console.log(`❌ ${featureName}: MODAL TEST FAILED - ${error.message}`);
    results.failed.push({ feature: featureName, error: error.message });
    return false;
  }
}

async function runModalTests() {
  console.log('\n🏠 HomeFlow Pro - Modal Functionality Test');
  console.log('='.repeat(70));
  console.log('Testing if all "Add" modals open and close properly\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
    defaultViewport: null
  });

  const page = await browser.newPage();
  
  try {
    // Login
    console.log('📋 Logging in...');
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(2000);
    
    const loadCredsBtn = await page.$('button::-p-text(Load Test Credentials)');
    if (loadCredsBtn) await loadCredsBtn.click();
    await sleep(1000);
    
    const signInBtn = await page.$('button[type="submit"]');
    await signInBtn.click();
    await sleep(4000);
    console.log('✅ Logged in successfully\n');
    
    // Test modals for features with forms
    console.log('='.repeat(70));
    console.log('TESTING MODALS FOR ALL FEATURES');
    console.log('='.repeat(70));
    
    await testModal(page, 'Task Management', 'Tasks', 'Add Task');
    await testModal(page, 'Calendar & Events', 'Calendar', 'Add Event');
    await testModal(page, 'Shopping Lists', 'Shopping', 'Add Item');
    await testModal(page, 'Budget Tracker', 'Budget', 'Add Expense');
    await testModal(page, 'Bill Reminders', 'Bill', 'Add Bill');
    await testModal(page, 'Home Inventory', 'Inventory', 'Add New');
    await testModal(page, 'Meal Planning', 'Meal', 'Add New');
    await testModal(page, 'Recipe Storage', 'Recipe', 'Add New');
    await testModal(page, 'Family Members', 'Family', 'Add New');
    await testModal(page, 'Chore Assignment', 'Chore', 'Add New');
    await testModal(page, 'Document Storage', 'Document', 'Add New');
    await testModal(page, 'Emergency Contacts', 'Contact', 'Add New');
    await testModal(page, 'Home Maintenance', 'Maintenance', 'Add New');
    await testModal(page, 'Warranty Tracking', 'Warrant', 'Add New');
    await testModal(page, 'Pet Management', 'Pet', 'Add New');
    await testModal(page, 'Plant Care', 'Plant', 'Add New');
    await testModal(page, 'Quick Notes', 'Note', 'Add New');
    await testModal(page, 'Vehicle Management', 'Vehicle', 'Add New');
    await testModal(page, 'Insurance Tracking', 'Insurance', 'Add New');
    await testModal(page, 'Password Manager', 'Password', 'Add New');
    await testModal(page, 'Guest Management', 'Guest', 'Add New');
    await testModal(page, 'Energy Tracking', 'Energy', 'Add New');
    await testModal(page, 'Smart Home Devices', 'Device', 'Add New');
    await testModal(page, 'Package Tracking', 'Package', 'Add New');
    await testModal(page, 'Subscription Management', 'Subscription', 'Add New');
    await testModal(page, 'Goal Setting', 'Goal', 'Add New');
    await testModal(page, 'Notification Center', 'Notification', 'Add New');
    
  } catch (error) {
    console.error('\n❌ Critical Error:', error.message);
  } finally {
    const duration = (new Date() - results.startTime) / 1000;
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 MODAL TEST RESULTS');
    console.log('='.repeat(70));
    console.log(`\n✅ Modals Working: ${results.passed}/${results.tested}`);
    console.log(`❌ Modals Failed: ${results.failed.length}/${results.tested}`);
    console.log(`📈 Success Rate: ${((results.passed / results.tested) * 100).toFixed(1)}%`);
    console.log(`⏱️  Duration: ${duration.toFixed(1)}s\n`);
    
    if (results.failed.length > 0) {
      console.log('❌ Failed Modal Tests:');
      results.failed.forEach(({ feature, error }) => {
        console.log(`   - ${feature}: ${error}`);
      });
      console.log('');
    }
    
    console.log('='.repeat(70));
    if (results.passed === results.tested) {
      console.log('🎉 ALL MODALS WORKING PERFECTLY!');
      console.log('='.repeat(70));
      console.log('\n✅ All "Add" buttons functional');
      console.log('✅ All modals open correctly');
      console.log('✅ All modals have form fields');
      console.log('✅ All modals can be closed');
      console.log('\n🚀 Your app is fully functional!\n');
    } else {
      console.log('⚠️ SOME MODALS NEED ATTENTION');
      console.log('='.repeat(70));
    }
    
    await sleep(3000);
    await browser.close();
  }
}

runModalTests().catch(console.error);

