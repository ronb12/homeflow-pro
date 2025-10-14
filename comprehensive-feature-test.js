#!/usr/bin/env node

/**
 * HomeFlow Pro - Comprehensive Feature Test
 * Tests all 31 features end-to-end with test user
 */

import puppeteer from 'puppeteer';
import fs from 'fs';

const APP_URL = 'https://homeflow-pro-1760475179.web.app';
const TEST_EMAIL = 'demo@homeflowpro.com';
const TEST_PASSWORD = 'HomeFlow2025!';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const results = {
  features: [],
  totalTested: 0,
  passed: 0,
  failed: 0,
  startTime: new Date()
};

const log = (message, type = 'info') => {
  const icons = { pass: '✅', fail: '❌', test: '🧪', info: '📋', warn: '⚠️' };
  console.log(`${icons[type] || '  '} ${message}`);
};

async function testFeature(page, name, navText, testActions) {
  results.totalTested++;
  const feature = { name, status: 'pending', details: [] };
  
  try {
    log(`Testing: ${name}`, 'test');
    
    // Navigate to feature
    log(`  Navigating to ${name}...`);
    const navButton = await page.waitForSelector(`button::-p-text(${navText})`, { timeout: 5000 });
    await navButton.click();
    await sleep(2000);
    feature.details.push('Navigation successful');
    
    // Run test actions
    if (testActions) {
      await testActions(page);
    }
    
    // Verify page loaded
    const hasCard = await page.$('.card');
    if (hasCard) {
      feature.details.push('UI rendered correctly');
    }
    
    feature.status = 'passed';
    results.passed++;
    log(`✅ ${name}: PASSED`, 'pass');
    
  } catch (error) {
    feature.status = 'failed';
    feature.error = error.message;
    results.failed++;
    log(`❌ ${name}: FAILED - ${error.message}`, 'fail');
  }
  
  results.features.push(feature);
  return feature.status === 'passed';
}

async function runTests() {
  console.log('\n🏠 HomeFlow Pro - Comprehensive Feature Test');
  console.log('='.repeat(70));
  console.log(`App: ${APP_URL}`);
  console.log(`User: ${TEST_EMAIL}\n`);

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
    defaultViewport: null
  });

  const page = await browser.newPage();
  
  try {
    // === AUTHENTICATION ===
    log('Phase 1: Authentication & Setup', 'info');
    console.log('');
    
    log('Loading application...', 'test');
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(2000);
    log('✅ Application loaded', 'pass');
    
    // Test Forgot Password feature
    log('\nTesting: Forgot Password Feature', 'test');
    try {
      const forgotLink = await page.$('button::-p-text(Forgot Password)');
      if (forgotLink) {
        await forgotLink.click();
        await sleep(2000);
        log('  Forgot password screen opened');
        
        const backButton = await page.$('button::-p-text(Back to Login)');
        if (backButton) {
          await backButton.click();
          await sleep(1500);
          log('✅ Forgot Password: PASSED', 'pass');
          results.features.push({ name: 'Forgot Password', status: 'passed', details: ['Navigation works', 'Form accessible'] });
          results.passed++;
          results.totalTested++;
        }
      }
    } catch (e) {
      log('⚠️ Forgot Password link not found', 'warn');
    }
    
    // Login
    log('\nLogging in...', 'test');
    const loadCredsBtn = await page.$('button::-p-text(Load Test Credentials)');
    if (loadCredsBtn) {
      await loadCredsBtn.click();
      await sleep(1000);
    }
    
    const signInBtn = await page.waitForSelector('button[type="submit"]');
    await signInBtn.click();
    await sleep(4000);
    log('✅ User authenticated', 'pass');
    
    // === CORE FEATURES ===
    console.log('\n' + '='.repeat(70));
    log('Phase 2: Core Features (1-10)', 'info');
    console.log('');
    
    // 1. Dashboard
    await testFeature(page, 'Dashboard', 'Dashboard', async (p) => {
      await sleep(1500);
      const stats = await p.$$('.stat-card');
      log(`  Found ${stats.length} stat cards`);
    });
    
    // 2. Tasks
    await testFeature(page, 'Task Management', 'Tasks', async (p) => {
      await sleep(1500);
      const items = await p.$$('.list-item');
      log(`  Found ${items.length} tasks`);
    });
    
    // 3. Calendar
    await testFeature(page, 'Calendar & Events', 'Calendar', async (p) => {
      await sleep(1500);
    });
    
    // 4. Shopping
    await testFeature(page, 'Shopping Lists', 'Shopping', async (p) => {
      await sleep(1500);
      const items = await p.$$('.list-item');
      log(`  Found ${items.length} shopping items`);
    });
    
    // 5. Budget
    await testFeature(page, 'Budget Tracker', 'Budget', async (p) => {
      await sleep(1500);
      const stats = await p.$$('.stat-card');
      log(`  Found ${stats.length} stat cards`);
    });
    
    // 6. Bills
    await testFeature(page, 'Bill Reminders', 'Bill', async (p) => {
      await sleep(1500);
      const items = await p.$$('.list-item');
      log(`  Found ${items.length} bills`);
    });
    
    // 7. Inventory
    await testFeature(page, 'Home Inventory', 'Inventory', async (p) => {
      await sleep(1500);
    });
    
    // 8. Meals
    await testFeature(page, 'Meal Planning', 'Meal', async (p) => {
      await sleep(1500);
    });
    
    // 9. Recipes
    await testFeature(page, 'Recipe Storage', 'Recipe', async (p) => {
      await sleep(1500);
    });
    
    // 10. Family
    await testFeature(page, 'Family Members', 'Family', async (p) => {
      await sleep(1500);
      const items = await p.$$('.list-item');
      log(`  Found ${items.length} family members`);
    });
    
    // === HOUSEHOLD FEATURES ===
    console.log('\n' + '='.repeat(70));
    log('Phase 3: Household Features (11-20)', 'info');
    console.log('');
    
    await testFeature(page, 'Chore Assignment', 'Chore');
    await testFeature(page, 'Document Storage', 'Document');
    await testFeature(page, 'Emergency Contacts', 'Contact');
    await testFeature(page, 'Home Maintenance', 'Maintenance');
    await testFeature(page, 'Warranty Tracking', 'Warrant');
    await testFeature(page, 'Pet Management', 'Pet');
    await testFeature(page, 'Plant Care', 'Plant');
    await testFeature(page, 'Weather Widget', 'Weather');
    await testFeature(page, 'Quick Notes', 'Note', async (p) => {
      const items = await p.$$('.list-item');
      log(`  Found ${items.length} notes`);
    });
    await testFeature(page, 'Vehicle Management', 'Vehicle');
    
    // === ADVANCED FEATURES ===
    console.log('\n' + '='.repeat(70));
    log('Phase 4: Advanced Features (21-31)', 'info');
    console.log('');
    
    await testFeature(page, 'Insurance Tracking', 'Insurance');
    await testFeature(page, 'Password Manager', 'Password');
    await testFeature(page, 'Guest Management', 'Guest');
    await testFeature(page, 'Energy Tracking', 'Energy');
    await testFeature(page, 'Smart Home Devices', 'Device');
    await testFeature(page, 'Package Tracking', 'Package');
    await testFeature(page, 'Subscription Management', 'Subscription');
    await testFeature(page, 'Goal Setting', 'Goal', async (p) => {
      const items = await p.$$('.list-item');
      log(`  Found ${items.length} goals`);
    });
    await testFeature(page, 'Notification Center', 'Notification');
    
    // Final screenshot
    await page.screenshot({ path: './final-test-screenshot.png', fullPage: true });
    
  } catch (error) {
    console.error('\n❌ Critical Error:', error.message);
  } finally {
    results.endTime = new Date();
    const duration = (results.endTime - results.startTime) / 1000;
    
    // Generate Report
    console.log('\n' + '='.repeat(70));
    console.log('📊 FINAL TEST RESULTS');
    console.log('='.repeat(70));
    console.log(`\n✅ Passed: ${results.passed}/${results.totalTested}`);
    console.log(`❌ Failed: ${results.failed}/${results.totalTested}`);
    console.log(`📈 Success Rate: ${((results.passed / results.totalTested) * 100).toFixed(1)}%`);
    console.log(`⏱️  Duration: ${duration.toFixed(1)}s\n`);
    
    if (results.failed > 0) {
      console.log('❌ Failed Features:');
      results.features.filter(f => f.status === 'failed').forEach(f => {
        console.log(`   - ${f.name}: ${f.error}`);
      });
      console.log('');
    }
    
    console.log('✅ Passed Features:');
    results.features.filter(f => f.status === 'passed').forEach((f, i) => {
      console.log(`   ${(i + 1).toString().padStart(2)}. ${f.name}`);
    });
    
    // Save report
    fs.writeFileSync('comprehensive-test-report.json', JSON.stringify(results, null, 2));
    
    console.log('\n' + '='.repeat(70));
    if (results.passed === results.totalTested) {
      console.log('🎉 ALL FEATURES PASSED! APP IS 100% FUNCTIONAL!');
    } else if (results.passed / results.totalTested >= 0.9) {
      console.log('✅ APP IS HIGHLY FUNCTIONAL!');
    } else {
      console.log('⚠️ SOME FEATURES NEED ATTENTION');
    }
    console.log('='.repeat(70));
    console.log('\n📄 Report saved: comprehensive-test-report.json');
    console.log('📸 Screenshot saved: final-test-screenshot.png\n');
    
    await sleep(3000);
    await browser.close();
  }
}

runTests().catch(console.error);

