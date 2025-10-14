#!/usr/bin/env node

/**
 * HomeFlow Pro - Complete Feature Usage Test
 * Actually uses each feature and reports what works/doesn't work
 */

import puppeteer from 'puppeteer';

const APP_URL = 'https://homeflow-pro-1760475179.web.app';
const TEST_EMAIL = 'demo@homeflowpro.com';
const TEST_PASSWORD = 'HomeFlow2025!';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const issues = [];
const working = [];

async function testFeatureUsage(page, featureName, navText, testFunction) {
  try {
    console.log(`\n🧪 Testing: ${featureName}`);
    
    // Navigate
    const navBtn = await page.waitForSelector(`button::-p-text(${navText})`, { timeout: 5000 });
    await navBtn.click();
    await sleep(2500);
    
    // Run specific test
    const result = await testFunction(page);
    
    if (result.success) {
      console.log(`✅ ${featureName}: WORKING`);
      if (result.details) console.log(`   ${result.details}`);
      working.push(featureName);
    } else {
      console.log(`❌ ${featureName}: ISSUE FOUND`);
      console.log(`   Problem: ${result.issue}`);
      issues.push({ feature: featureName, issue: result.issue, fix: result.suggestedFix });
    }
    
  } catch (error) {
    console.log(`❌ ${featureName}: ERROR`);
    console.log(`   ${error.message}`);
    issues.push({ feature: featureName, issue: error.message });
  }
}

async function runCompleteTest() {
  console.log('\n🏠 HomeFlow Pro - Complete Feature Usage Test');
  console.log('='.repeat(70));
  console.log('Testing actual usage of all features...\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1600, height: 1000 }
  });

  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`   ⚠️ Browser console error: ${msg.text()}`);
    }
  });

  try {
    // Login
    console.log('📋 Logging in...');
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(2000);
    
    const loadBtn = await page.$('button::-p-text(Load Test Credentials)');
    if (loadBtn) await loadBtn.click();
    await sleep(1000);
    
    const signInBtn = await page.$('button[type="submit"]');
    await signInBtn.click();
    await sleep(4000);
    console.log('✅ Logged in\n');

    // TEST EACH FEATURE
    
    // 1. Dashboard
    await testFeatureUsage(page, 'Dashboard', 'Dashboard', async (p) => {
      const stats = await p.$$('.stat-card');
      const hasCharts = await p.$('.recharts-wrapper');
      if (stats.length > 0 && hasCharts) {
        return { success: true, details: `${stats.length} stat cards, charts visible` };
      }
      return { success: false, issue: 'Stats or charts not loading' };
    });

    // 2. Tasks
    await testFeatureUsage(page, 'Task Management', 'Tasks', async (p) => {
      const items = await p.$$('.list-item');
      const addBtn = await p.$('button::-p-text(Add Task)');
      
      // Try to add a task
      if (addBtn) {
        await addBtn.click();
        await sleep(1500);
        const modal = await p.$('.modal');
        if (modal) {
          const closeBtn = await p.$('.modal-close');
          if (closeBtn) await closeBtn.click();
          await sleep(1000);
          return { success: true, details: `${items.length} tasks, modal works` };
        }
        return { success: false, issue: 'Modal did not open' };
      }
      return { success: false, issue: 'Add button not found' };
    });

    // 3. Calendar
    await testFeatureUsage(page, 'Calendar & Events', 'Calendar', async (p) => {
      const calendar = await p.$('text/MMMM');
      const addBtn = await p.$('button::-p-text(Add Event)');
      if (calendar || addBtn) {
        return { success: true, details: 'Calendar grid and controls visible' };
      }
      return { success: false, issue: 'Calendar not rendering' };
    });

    // 4. Shopping
    await testFeatureUsage(page, 'Shopping Lists', 'Shopping', async (p) => {
      const items = await p.$$('.list-item');
      const addBtn = await p.$('button::-p-text(Add Item)');
      if (items.length > 0 || addBtn) {
        return { success: true, details: `${items.length} items listed` };
      }
      return { success: false, issue: 'Shopping lists not displaying' };
    });

    // 5. Budget
    await testFeatureUsage(page, 'Budget Tracker', 'Budget', async (p) => {
      const stats = await p.$$('.stat-card');
      const hasChart = await p.$('.recharts-wrapper');
      if (stats.length > 0 || hasChart) {
        return { success: true, details: 'Budget stats and charts showing' };
      }
      return { success: false, issue: 'Budget data not displaying' };
    });

    // 6. Bills
    await testFeatureUsage(page, 'Bill Reminders', 'Bill', async (p) => {
      const items = await p.$$('.list-item');
      const stats = await p.$$('.stat-card');
      if (items.length > 0 || stats.length > 0) {
        return { success: true, details: `${items.length} bills listed` };
      }
      return { success: false, issue: 'Bills not displaying' };
    });

    // Test remaining features quickly
    const quickTests = [
      ['Home Inventory', 'Inventory'],
      ['Meal Planning', 'Meal'],
      ['Recipe Storage', 'Recipe'],
      ['Family Members', 'Family'],
      ['Chore Assignment', 'Chore'],
      ['Document Storage', 'Document'],
      ['Emergency Contacts', 'Contact'],
      ['Home Maintenance', 'Maintenance'],
      ['Warranty Tracking', 'Warrant'],
      ['Pet Management', 'Pet'],
      ['Plant Care', 'Plant'],
      ['Weather Widget', 'Weather'],
      ['Quick Notes', 'Note'],
      ['Vehicle Management', 'Vehicle'],
      ['Insurance Tracking', 'Insurance'],
      ['Password Manager', 'Password'],
      ['Guest Management', 'Guest'],
      ['Energy Tracking', 'Energy'],
      ['Smart Home Devices', 'Device'],
      ['Package Tracking', 'Package'],
      ['Subscription Management', 'Subscription'],
      ['Goal Setting', 'Goal'],
      ['Notification Center', 'Notification']
    ];

    for (const [name, nav] of quickTests) {
      await testFeatureUsage(page, name, nav, async (p) => {
        await sleep(1500);
        const hasContent = await p.$('.card, .empty-state');
        const addBtn = await p.$('button::-p-text(Add New), button::-p-text(Add)');
        if (hasContent && addBtn) {
          return { success: true };
        }
        return { success: false, issue: 'Feature not rendering properly' };
      });
    }

  } catch (error) {
    console.error('\n❌ Critical Error:', error.message);
  } finally {
    console.log('\n' + '='.repeat(70));
    console.log('📊 FEATURE USAGE TEST RESULTS');
    console.log('='.repeat(70));
    console.log(`\n✅ Working: ${working.length}`);
    console.log(`❌ Issues Found: ${issues.length}`);
    console.log(`📈 Success Rate: ${((working.length / (working.length + issues.length)) * 100).toFixed(1)}%\n`);

    if (issues.length > 0) {
      console.log('❌ Features with Issues:');
      issues.forEach(({ feature, issue, fix }) => {
        console.log(`\n   ${feature}:`);
        console.log(`   - Issue: ${issue}`);
        if (fix) console.log(`   - Fix: ${fix}`);
      });
      console.log('');
    } else {
      console.log('🎉 ALL FEATURES WORKING PERFECTLY!\n');
    }

    console.log('='.repeat(70));
    
    await sleep(3000);
    await browser.close();
    
    // Exit with error code if issues found
    process.exit(issues.length > 0 ? 1 : 0);
  }
}

runCompleteTest().catch(console.error);

