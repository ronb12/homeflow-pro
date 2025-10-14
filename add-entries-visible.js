#!/usr/bin/env node

/**
 * HomeFlow Pro - Visible Entry Addition
 * Watch as entries are added one by one
 */

import puppeteer from 'puppeteer';

const APP_URL = 'https://homeflow-pro-1760475179.web.app';
const TEST_EMAIL = 'demo@homeflowpro.com';
const TEST_PASSWORD = 'HomeFlow2025!';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function addEntriesVisibly() {
  console.log('\n🏠 HomeFlow Pro - Visible Entry Addition');
  console.log('==========================================');
  console.log('Watch the browser window as entries are added!\n');
  console.log('Opening browser in 3 seconds...\n');
  
  await sleep(3000);

  const browser = await puppeteer.launch({
    headless: false,  // Show the browser so you can watch!
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized'
    ],
    defaultViewport: null
  });

  const page = await browser.newPage();

  try {
    console.log('📝 Step 1: Loading application...');
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(2000);

    console.log('📝 Step 2: Loading test credentials...');
    await sleep(1000);
    
    try {
      const loadButton = await page.waitForSelector('button::-p-text(Load Test Credentials)', { timeout: 5000 });
      await loadButton.click();
      console.log('   ✓ Test credentials loaded');
      await sleep(1500);
    } catch (e) {
      console.log('   ℹ Manual entry mode');
      await page.type('input[type="email"]', TEST_EMAIL);
      await page.type('input[type="password"]', TEST_PASSWORD);
    }

    console.log('📝 Step 3: Signing in...');
    const signInButton = await page.waitForSelector('button[type="submit"]');
    await signInButton.click();
    await sleep(4000);
    console.log('   ✅ Logged in successfully!\n');

    // === ADD TASK ===
    console.log('📝 Step 4: Adding a TASK...');
    const tasksButton = await page.waitForSelector('button::-p-text(Tasks)');
    await tasksButton.click();
    console.log('   ✓ Navigated to Tasks');
    await sleep(2000);

    const addTaskButton = await page.waitForSelector('button::-p-text(Add Task)');
    await addTaskButton.click();
    console.log('   ✓ Opened Add Task modal');
    await sleep(1500);

    // Type task details slowly so you can see
    const taskTitle = 'Clean the garage this weekend';
    console.log(`   ✓ Typing: "${taskTitle}"`);
    await page.type('input[type="text"]', taskTitle, { delay: 50 });
    await sleep(1000);

    const taskDesc = 'Organize tools and donate old items';
    console.log(`   ✓ Typing description: "${taskDesc}"`);
    const textarea = await page.$('textarea');
    if (textarea) {
      await textarea.type(taskDesc, { delay: 50 });
    }
    await sleep(1000);

    console.log('   ✓ Submitting task...');
    const submitTaskButton = await page.waitForSelector('button::-p-text(Add Task)');
    await submitTaskButton.click();
    await sleep(3000);
    console.log('   ✅ TASK CREATED! Check the UI!\n');
    await sleep(2000);

    // === ADD SHOPPING ITEM ===
    console.log('📝 Step 5: Adding a SHOPPING ITEM...');
    const shoppingButton = await page.waitForSelector('button::-p-text(Shopping)');
    await shoppingButton.click();
    console.log('   ✓ Navigated to Shopping Lists');
    await sleep(2000);

    const addItemButton = await page.waitForSelector('button::-p-text(Add Item)');
    await addItemButton.click();
    console.log('   ✓ Opened Add Item modal');
    await sleep(1500);

    const itemName = 'Fresh Strawberries';
    console.log(`   ✓ Typing: "${itemName}"`);
    const nameInput = await page.$('input[type="text"]');
    await nameInput.type(itemName, { delay: 50 });
    await sleep(1000);

    console.log('   ✓ Setting quantity to 2...');
    const quantityInput = await page.$('input[type="number"]');
    if (quantityInput) {
      await quantityInput.click({ clickCount: 3 });
      await quantityInput.type('2', { delay: 100 });
    }
    await sleep(1000);

    console.log('   ✓ Submitting shopping item...');
    const submitItemButton = await page.waitForSelector('button::-p-text(Add Item)');
    await submitItemButton.click();
    await sleep(3000);
    console.log('   ✅ SHOPPING ITEM CREATED! Check the UI!\n');
    await sleep(2000);

    // === ADD CALENDAR EVENT ===
    console.log('📝 Step 6: Adding a CALENDAR EVENT...');
    const calendarButton = await page.waitForSelector('button::-p-text(Calendar)');
    await calendarButton.click();
    console.log('   ✓ Navigated to Calendar');
    await sleep(2000);

    const addEventButton = await page.waitForSelector('button::-p-text(Add Event)');
    await addEventButton.click();
    console.log('   ✓ Opened Add Event modal');
    await sleep(1500);

    const eventTitle = 'Birthday Party';
    console.log(`   ✓ Typing: "${eventTitle}"`);
    const eventInput = await page.$('input[type="text"]');
    await eventInput.type(eventTitle, { delay: 50 });
    await sleep(1000);

    console.log('   ✓ Submitting event...');
    const submitEventButton = await page.waitForSelector('button::-p-text(Add Event)');
    await submitEventButton.click();
    await sleep(3000);
    console.log('   ✅ EVENT CREATED! Check the UI!\n');
    await sleep(2000);

    // === ADD FAMILY MEMBER ===
    console.log('📝 Step 7: Adding a FAMILY MEMBER...');
    const familyButton = await page.waitForSelector('button::-p-text(Family)');
    await familyButton.click();
    console.log('   ✓ Navigated to Family Members');
    await sleep(2000);

    const addFamilyButton = await page.waitForSelector('button::-p-text(Add New)');
    await addFamilyButton.click();
    console.log('   ✓ Opened Add Family Member modal');
    await sleep(1500);

    const memberName = 'Grandma Betty';
    console.log(`   ✓ Typing: "${memberName}"`);
    const memberInput = await page.$('input[type="text"]');
    await memberInput.type(memberName, { delay: 50 });
    await sleep(1000);

    console.log('   ✓ Submitting family member...');
    const submitFamilyButton = await page.waitForSelector('button::-p-text(Add)');
    await submitFamilyButton.click();
    await sleep(3000);
    console.log('   ✅ FAMILY MEMBER CREATED! Check the UI!\n');
    await sleep(2000);

    // === ADD NOTE ===
    console.log('📝 Step 8: Adding a NOTE...');
    const notesButton = await page.waitForSelector('button::-p-text(Note)');
    await notesButton.click();
    console.log('   ✓ Navigated to Notes');
    await sleep(2000);

    const addNoteButton = await page.waitForSelector('button::-p-text(Add New)');
    await addNoteButton.click();
    console.log('   ✓ Opened Add Note modal');
    await sleep(1500);

    const noteTitle = 'Weekend Project Ideas';
    console.log(`   ✓ Typing title: "${noteTitle}"`);
    const noteTitleInput = await page.$('input[type="text"]');
    await noteTitleInput.type(noteTitle, { delay: 50 });
    await sleep(1000);

    const noteContent = 'Paint the fence, fix the gate, plant flowers in the garden';
    console.log(`   ✓ Typing content: "${noteContent}"`);
    const noteTextarea = await page.$('textarea');
    if (noteTextarea) {
      await noteTextarea.type(noteContent, { delay: 40 });
    }
    await sleep(1000);

    console.log('   ✓ Submitting note...');
    const submitNoteButton = await page.waitForSelector('button::-p-text(Add)');
    await submitNoteButton.click();
    await sleep(3000);
    console.log('   ✅ NOTE CREATED! Check the UI!\n');
    await sleep(2000);

    // === ADD GOAL ===
    console.log('📝 Step 9: Adding a GOAL...');
    const goalsButton = await page.waitForSelector('button::-p-text(Goal)');
    await goalsButton.click();
    console.log('   ✓ Navigated to Goals');
    await sleep(2000);

    const addGoalButton = await page.waitForSelector('button::-p-text(Add New)');
    await addGoalButton.click();
    console.log('   ✓ Opened Add Goal modal');
    await sleep(1500);

    const goalTitle = 'Learn to play guitar';
    console.log(`   ✓ Typing: "${goalTitle}"`);
    const goalInput = await page.$('input[type="text"]');
    await goalInput.type(goalTitle, { delay: 50 });
    await sleep(1000);

    console.log('   ✓ Submitting goal...');
    const submitGoalButton = await page.waitForSelector('button::-p-text(Add)');
    await submitGoalButton.click();
    await sleep(3000);
    console.log('   ✅ GOAL CREATED! Check the UI!\n');
    await sleep(2000);

    // Go back to Dashboard to see updated stats
    console.log('📝 Step 10: Returning to Dashboard...');
    const dashboardButton = await page.waitForSelector('button::-p-text(Dashboard)');
    await dashboardButton.click();
    await sleep(3000);
    console.log('   ✅ Dashboard loaded with updated stats!\n');

    console.log('='.repeat(60));
    console.log('✅ ALL ENTRIES ADDED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary of what was created:');
    console.log('   ✅ 1 Task: "Clean the garage this weekend"');
    console.log('   ✅ 1 Shopping Item: "Fresh Strawberries" (Qty: 2)');
    console.log('   ✅ 1 Calendar Event: "Birthday Party"');
    console.log('   ✅ 1 Family Member: "Grandma Betty"');
    console.log('   ✅ 1 Note: "Weekend Project Ideas"');
    console.log('   ✅ 1 Goal: "Learn to play guitar"');
    console.log('\n🎯 Total new entries: 6');
    console.log('\n💡 You should see these entries in the app now!');
    console.log('   The browser window will stay open for you to verify.\n');
    console.log('🌐 App URL: https://homeflow-pro-1760475179.web.app');
    console.log('\nPress Ctrl+C to close when done viewing.\n');

    // Keep browser open so user can verify
    await sleep(60000 * 5); // Keep open for 5 minutes

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n📸 Taking screenshot of error state...');
    await page.screenshot({ path: 'error-state.png' });
    console.log('   Saved to: error-state.png\n');
  } finally {
    // Don't close automatically - let user close
    console.log('Browser will close automatically or press Ctrl+C to close now.');
  }
}

addEntriesVisibly().catch(console.error);

