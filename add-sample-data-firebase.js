#!/usr/bin/env node

/**
 * HomeFlow Pro - Direct Firebase Data Population
 * Adds sample data directly to Firestore for test user
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCniKVgVSbjYdg3QMlUASpDrEYXniBK1eA",
  authDomain: "homeflow-pro-1760475179.firebaseapp.com",
  projectId: "homeflow-pro-1760475179",
  storageBucket: "homeflow-pro-1760475179.firebasestorage.app",
  messagingSenderId: "674509054481",
  appId: "1:674509054481:web:7bb6c9682413a9f4c7c7b0"
};

const TEST_EMAIL = 'demo@homeflowpro.com';
const TEST_PASSWORD = 'HomeFlow2025!';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const log = (message, icon = '📝') => {
  console.log(`${icon} ${message}`);
};

async function populateData() {
  console.log('\n🏠 HomeFlow Pro - Firebase Data Population');
  console.log('==========================================\n');

  try {
    // Login
    log('Authenticating with test user...', '🔐');
    const userCredential = await signInWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD);
    const userId = userCredential.user.uid;
    log(`✅ Authenticated! User ID: ${userId.substring(0, 20)}...`, '✅');

    let totalCreated = 0;

    // 1. Add Tasks
    log('\nAdding tasks...', '✅');
    const tasks = [
      { title: 'Buy groceries for the week', description: 'Milk, eggs, bread, vegetables, fruits', priority: 'high', completed: false, dueDate: new Date(Date.now() + 86400000 * 2).toISOString() },
      { title: 'Call dentist for appointment', description: 'Regular checkup and cleaning', priority: 'medium', completed: false, dueDate: new Date(Date.now() + 86400000 * 5).toISOString() },
      { title: 'Change air filters', description: 'HVAC maintenance - replace all filters', priority: 'low', completed: false, dueDate: new Date(Date.now() + 86400000 * 7).toISOString() },
      { title: 'Pay utility bills', description: 'Electric, water, and internet bills', priority: 'high', completed: false, dueDate: new Date(Date.now() + 86400000 * 3).toISOString() },
      { title: 'Schedule car oil change', description: 'Due at 5000 miles', priority: 'medium', completed: false, dueDate: new Date(Date.now() + 86400000 * 10).toISOString() },
      { title: 'Organize garage', description: 'Sort and donate old items', priority: 'low', completed: false, dueDate: new Date(Date.now() + 86400000 * 14).toISOString() },
      { title: 'Buy birthday gift for Mom', description: 'Her birthday is coming up!', priority: 'high', completed: false, dueDate: new Date(Date.now() + 86400000 * 12).toISOString() }
    ];

    for (const task of tasks) {
      await addDoc(collection(db, 'tasks'), {
        ...task,
        userId,
        createdAt: new Date().toISOString()
      });
      log(`  ✓ ${task.title}`, '  ');
      totalCreated++;
    }

    // 2. Add Events
    log('\nAdding calendar events...', '📅');
    const events = [
      { title: 'Team Meeting', description: 'Monthly team sync', startDate: new Date(Date.now() + 86400000 * 2).toISOString(), endDate: new Date(Date.now() + 86400000 * 2 + 3600000).toISOString(), location: 'Conference Room A', color: '#3b82f6' },
      { title: 'Doctor Appointment', description: 'Annual physical checkup', startDate: new Date(Date.now() + 86400000 * 5).toISOString(), endDate: new Date(Date.now() + 86400000 * 5 + 3600000).toISOString(), location: 'Medical Center', color: '#ef4444' },
      { title: 'Family Dinner', description: 'Dinner with parents', startDate: new Date(Date.now() + 86400000 * 7).toISOString(), endDate: new Date(Date.now() + 86400000 * 7 + 7200000).toISOString(), location: 'Home', color: '#10b981' },
      { title: 'Dentist Appointment', description: 'Cleaning and checkup', startDate: new Date(Date.now() + 86400000 * 10).toISOString(), endDate: new Date(Date.now() + 86400000 * 10 + 3600000).toISOString(), location: 'Dental Clinic', color: '#8b5cf6' },
      { title: 'Car Service', description: 'Oil change and tire rotation', startDate: new Date(Date.now() + 86400000 * 12).toISOString(), endDate: new Date(Date.now() + 86400000 * 12 + 7200000).toISOString(), location: 'Auto Shop', color: '#f59e0b' }
    ];

    for (const event of events) {
      await addDoc(collection(db, 'events'), {
        ...event,
        userId
      });
      log(`  ✓ ${event.title}`, '  ');
      totalCreated++;
    }

    // 3. Add Shopping Items
    log('\nAdding shopping list items...', '🛒');
    const shoppingItems = [
      { name: 'Milk', quantity: 2, category: 'Groceries', purchased: false },
      { name: 'Eggs', quantity: 12, category: 'Groceries', purchased: false },
      { name: 'Bread', quantity: 1, category: 'Groceries', purchased: false },
      { name: 'Chicken Breast', quantity: 2, category: 'Groceries', purchased: false },
      { name: 'Rice', quantity: 1, category: 'Groceries', purchased: false },
      { name: 'Apples', quantity: 6, category: 'Groceries', purchased: false },
      { name: 'Bananas', quantity: 5, category: 'Groceries', purchased: false },
      { name: 'Tomatoes', quantity: 4, category: 'Groceries', purchased: false },
      { name: 'Cheese', quantity: 1, category: 'Groceries', purchased: false },
      { name: 'Coffee', quantity: 1, category: 'Groceries', purchased: false },
      { name: 'Dish Soap', quantity: 1, category: 'Household', purchased: false },
      { name: 'Paper Towels', quantity: 2, category: 'Household', purchased: false },
      { name: 'Laundry Detergent', quantity: 1, category: 'Household', purchased: false }
    ];

    for (const item of shoppingItems) {
      await addDoc(collection(db, 'shopping'), {
        ...item,
        userId,
        createdAt: new Date().toISOString()
      });
      log(`  ✓ ${item.name} (${item.quantity})`, '  ');
      totalCreated++;
    }

    // 4. Add Expenses
    log('\nAdding budget expenses...', '💰');
    const expenses = [
      { description: 'Grocery Shopping - Whole Foods', amount: 125.50, category: 'Food', date: new Date(Date.now() - 86400000 * 2).toISOString() },
      { description: 'Gas Station Fill-up', amount: 45.00, category: 'Transport', date: new Date(Date.now() - 86400000 * 3).toISOString() },
      { description: 'Restaurant Lunch - Italian Place', amount: 32.75, category: 'Food', date: new Date(Date.now() - 86400000 * 1).toISOString() },
      { description: 'Coffee Shop - Starbucks', amount: 15.80, category: 'Food', date: new Date(Date.now() - 86400000 * 1).toISOString() },
      { description: 'Online Shopping - Amazon', amount: 89.99, category: 'Other', date: new Date(Date.now() - 86400000 * 5).toISOString() },
      { description: 'Movie Tickets', amount: 28.00, category: 'Entertainment', date: new Date(Date.now() - 86400000 * 6).toISOString() },
      { description: 'Pharmacy - Medications', amount: 45.50, category: 'Healthcare', date: new Date(Date.now() - 86400000 * 4).toISOString() },
      { description: 'Gym Membership', amount: 49.99, category: 'Healthcare', date: new Date(Date.now() - 86400000 * 30).toISOString() }
    ];

    for (const expense of expenses) {
      await addDoc(collection(db, 'expenses'), {
        ...expense,
        userId
      });
      log(`  ✓ ${expense.description}: $${expense.amount}`, '  ');
      totalCreated++;
    }

    // 5. Add Bills
    log('\nAdding bills...', '📄');
    const bills = [
      { name: 'Electric Bill', amount: 120.00, dueDate: new Date(Date.now() + 86400000 * 15).toISOString(), paid: false, recurring: true, category: 'Utilities' },
      { name: 'Internet Service', amount: 79.99, dueDate: new Date(Date.now() + 86400000 * 20).toISOString(), paid: false, recurring: true, category: 'Utilities' },
      { name: 'Water Bill', amount: 45.00, dueDate: new Date(Date.now() + 86400000 * 18).toISOString(), paid: false, recurring: true, category: 'Utilities' },
      { name: 'Phone Bill', amount: 65.00, dueDate: new Date(Date.now() + 86400000 * 25).toISOString(), paid: false, recurring: true, category: 'Utilities' },
      { name: 'Streaming Services', amount: 29.99, dueDate: new Date(Date.now() + 86400000 * 10).toISOString(), paid: false, recurring: true, category: 'Subscriptions' },
      { name: 'Car Insurance', amount: 150.00, dueDate: new Date(Date.now() + 86400000 * 30).toISOString(), paid: false, recurring: true, category: 'Insurance' }
    ];

    for (const bill of bills) {
      await addDoc(collection(db, 'bills'), {
        ...bill,
        userId
      });
      log(`  ✓ ${bill.name}: $${bill.amount}`, '  ');
      totalCreated++;
    }

    // 6. Add Inventory
    log('\nAdding home inventory...', '🏠');
    const inventory = [
      { name: 'Samsung TV 65"', category: 'Electronics', location: 'Living Room', quantity: 1, purchaseDate: '2023-01-15' },
      { name: 'LG Refrigerator', category: 'Kitchen', location: 'Kitchen', quantity: 1, purchaseDate: '2022-06-20' },
      { name: 'Dyson Vacuum Cleaner', category: 'Tools', location: 'Garage', quantity: 1, purchaseDate: '2023-03-10' },
      { name: 'Ninja Blender', category: 'Kitchen', location: 'Kitchen', quantity: 1, purchaseDate: '2023-08-05' },
      { name: 'MacBook Pro', category: 'Electronics', location: 'Home Office', quantity: 1, purchaseDate: '2023-09-01' },
      { name: 'Dining Table Set', category: 'Furniture', location: 'Dining Room', quantity: 1, purchaseDate: '2022-05-15' },
      { name: 'King Size Bed', category: 'Furniture', location: 'Master Bedroom', quantity: 1, purchaseDate: '2022-04-10' }
    ];

    for (const item of inventory) {
      await addDoc(collection(db, 'inventory'), {
        ...item,
        userId,
        createdAt: new Date().toISOString()
      });
      log(`  ✓ ${item.name}`, '  ');
      totalCreated++;
    }

    // 7. Add Meals
    log('\nAdding meal plans...', '🍽️');
    const meals = [
      { name: 'Spaghetti Carbonara', date: new Date(Date.now() + 86400000).toISOString(), mealType: 'dinner' },
      { name: 'Grilled Chicken Salad', date: new Date(Date.now() + 86400000 * 2).toISOString(), mealType: 'lunch' },
      { name: 'Beef Tacos', date: new Date(Date.now() + 86400000 * 3).toISOString(), mealType: 'dinner' },
      { name: 'Vegetable Stir Fry', date: new Date(Date.now() + 86400000 * 4).toISOString(), mealType: 'dinner' },
      { name: 'Salmon with Rice', date: new Date(Date.now() + 86400000 * 5).toISOString(), mealType: 'dinner' },
      { name: 'Pancakes and Bacon', date: new Date(Date.now() + 86400000 * 6).toISOString(), mealType: 'breakfast' }
    ];

    for (const meal of meals) {
      await addDoc(collection(db, 'meals'), {
        ...meal,
        userId,
        createdAt: new Date().toISOString()
      });
      log(`  ✓ ${meal.name} (${meal.mealType})`, '  ');
      totalCreated++;
    }

    // 8. Add Recipes
    log('\nAdding recipes...', '📖');
    const recipes = [
      { name: 'Chocolate Chip Cookies', ingredients: ['flour', 'butter', 'sugar', 'chocolate chips', 'eggs'], instructions: ['Mix dry ingredients', 'Add wet ingredients', 'Bake at 350°F for 12 minutes'], prepTime: 15, cookTime: 12, servings: 24, category: 'Dessert' },
      { name: 'Homemade Pizza', ingredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'basil'], instructions: ['Roll out dough', 'Add toppings', 'Bake at 450°F for 15 minutes'], prepTime: 20, cookTime: 15, servings: 4, category: 'Dinner' },
      { name: 'Chicken Curry', ingredients: ['chicken', 'curry powder', 'coconut milk', 'onions', 'garlic'], instructions: ['Cook chicken', 'Add curry and coconut milk', 'Simmer for 30 minutes'], prepTime: 15, cookTime: 30, servings: 6, category: 'Dinner' },
      { name: 'Caesar Salad', ingredients: ['romaine lettuce', 'caesar dressing', 'parmesan', 'croutons'], instructions: ['Chop lettuce', 'Add dressing and toppings', 'Toss and serve'], prepTime: 10, cookTime: 0, servings: 4, category: 'Lunch' }
    ];

    for (const recipe of recipes) {
      await addDoc(collection(db, 'recipes'), {
        ...recipe,
        userId,
        createdAt: new Date().toISOString()
      });
      log(`  ✓ ${recipe.name}`, '  ');
      totalCreated++;
    }

    // 9. Add Family Members
    log('\nAdding family members...', '👨‍👩‍👧‍👦');
    const family = [
      { name: 'John Bradley', role: 'Father', birthday: '1980-05-15', phone: '555-0101', email: 'john@example.com' },
      { name: 'Sarah Bradley', role: 'Mother', birthday: '1982-08-22', phone: '555-0102', email: 'sarah@example.com' },
      { name: 'Emma Bradley', role: 'Daughter', birthday: '2010-03-10', phone: '555-0103', email: 'emma@example.com' },
      { name: 'Michael Bradley', role: 'Son', birthday: '2012-11-30', phone: '555-0104', email: 'michael@example.com' }
    ];

    for (const member of family) {
      await addDoc(collection(db, 'family'), {
        ...member,
        userId,
        createdAt: new Date().toISOString()
      });
      log(`  ✓ ${member.name} (${member.role})`, '  ');
      totalCreated++;
    }

    // 10. Add Notes
    log('\nAdding notes...', '📝');
    const notes = [
      { title: 'Home Improvement Ideas', content: 'Paint the living room, update kitchen backsplash, install new light fixtures in bedrooms', category: 'Home', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { title: 'Vacation Planning', content: 'Research destinations for summer vacation. Consider beach resorts or mountain retreats. Budget: $5000', category: 'Personal', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { title: 'Gift Ideas', content: 'Mom - new purse, Dad - golf clubs, Emma - art supplies, Michael - video game', category: 'Personal', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];

    for (const note of notes) {
      await addDoc(collection(db, 'notes'), {
        ...note,
        userId
      });
      log(`  ✓ ${note.title}`, '  ');
      totalCreated++;
    }

    // 11. Add Goals
    log('\nAdding goals...', '🎯');
    const goals = [
      { title: 'Save $10,000 for Emergency Fund', description: 'Build emergency savings', targetDate: new Date(Date.now() + 86400000 * 365).toISOString(), progress: 35, category: 'Financial', completed: false },
      { title: 'Exercise 3x per week', description: 'Maintain regular workout routine', targetDate: new Date(Date.now() + 86400000 * 180).toISOString(), progress: 60, category: 'Health', completed: false },
      { title: 'Organize entire house', description: 'Declutter and organize all rooms', targetDate: new Date(Date.now() + 86400000 * 90).toISOString(), progress: 45, category: 'Home', completed: false },
      { title: 'Read 12 books this year', description: 'One book per month', targetDate: new Date(Date.now() + 86400000 * 300).toISOString(), progress: 25, category: 'Personal', completed: false }
    ];

    for (const goal of goals) {
      await addDoc(collection(db, 'goals'), {
        ...goal,
        userId,
        createdAt: new Date().toISOString()
      });
      log(`  ✓ ${goal.title} (${goal.progress}% complete)`, '  ');
      totalCreated++;
    }

    // Summary
    log('\n' + '='.repeat(60), '');
    log('✅ DATA POPULATION COMPLETE!', '🎉');
    log('='.repeat(60), '');
    log(`\n📊 Total items created: ${totalCreated}`, '📊');
    log(`👤 User: ${TEST_EMAIL}`, '👤');
    log(`🔗 App URL: https://homeflow-pro-1760475179.web.app`, '🔗');
    log(`\n✨ All sample data has been added directly to Firestore!`, '✨');
    log(`🌐 Visit your app to see all the data!`, '🌐');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

populateData().catch(console.error);

