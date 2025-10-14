#!/usr/bin/env node

/**
 * Populate ALL features with sample data
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCniKVgVSbjYdg3QMlUASpDrEYXniBK1eA",
  authDomain: "homeflow-pro-1760475179.firebaseapp.com",
  projectId: "homeflow-pro-1760475179",
  storageBucket: "homeflow-pro-1760475179.firebasestorage.app",
  messagingSenderId: "674509054481",
  appId: "1:674509054481:web:7bb6c9682413a9f4c7c7b0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function populateAll() {
  console.log('\n🏠 Populating ALL Features with Sample Data\n');
  
  const cred = await signInWithEmailAndPassword(auth, 'demo@homeflowpro.com', 'HomeFlow2025!');
  const userId = cred.user.uid;
  
  let added = 0;

  // Chores
  console.log('Adding chores...');
  const chores = [
    { title: 'Take out trash', assignedTo: 'John', frequency: 'weekly', completed: false, nextDue: new Date(Date.now() + 86400000 * 3).toISOString() },
    { title: 'Vacuum living room', assignedTo: 'Sarah', frequency: 'weekly', completed: false, nextDue: new Date(Date.now() + 86400000 * 2).toISOString() },
    { title: 'Clean bathrooms', assignedTo: 'Emma', frequency: 'weekly', completed: false, nextDue: new Date(Date.now() + 86400000 * 5).toISOString() }
  ];
  for (const chore of chores) {
    await addDoc(collection(db, 'chores'), { ...chore, userId });
    added++;
  }

  // Documents
  console.log('Adding documents...');
  const documents = [
    { name: 'Birth Certificate', category: 'Legal', notes: 'Stored in safe', uploadDate: new Date().toISOString() },
    { name: 'Property Deed', category: 'Legal', notes: 'Original document', uploadDate: new Date().toISOString() },
    { name: 'Tax Returns 2024', category: 'Financial', notes: 'Filed and approved', uploadDate: new Date().toISOString() }
  ];
  for (const doc of documents) {
    await addDoc(collection(db, 'documents'), { ...doc, userId });
    added++;
  }

  // Emergency Contacts
  console.log('Adding emergency contacts...');
  const contacts = [
    { name: 'Dr. Smith', relationship: 'Family Doctor', phone: '555-1234', email: 'drsmith@medical.com', address: '123 Medical Center Dr' },
    { name: 'Police Department', relationship: 'Emergency', phone: '911', email: 'emergency@city.gov', address: 'City Hall' },
    { name: 'Neighbor - Bob', relationship: 'Neighbor', phone: '555-5678', email: 'bob@email.com', address: 'Next door' }
  ];
  for (const contact of contacts) {
    await addDoc(collection(db, 'contacts'), { ...contact, userId });
    added++;
  }

  // Maintenance
  console.log('Adding maintenance items...');
  const maintenance = [
    { item: 'HVAC System', type: 'Air Conditioning', lastServiced: '2024-06-15', nextService: new Date(Date.now() + 86400000 * 60).toISOString(), cost: 150, notes: 'Annual checkup' },
    { item: 'Water Heater', type: 'Plumbing', lastServiced: '2024-03-10', nextService: new Date(Date.now() + 86400000 * 180).toISOString(), cost: 200, notes: 'Flush tank annually' },
    { item: 'Gutters', type: 'Exterior', lastServiced: '2024-08-20', nextService: new Date(Date.now() + 86400000 * 90).toISOString(), cost: 100, notes: 'Clean twice yearly' }
  ];
  for (const item of maintenance) {
    await addDoc(collection(db, 'maintenance'), { ...item, userId });
    added++;
  }

  // Warranties
  console.log('Adding warranties...');
  const warranties = [
    { item: 'Refrigerator', purchaseDate: '2023-01-15', expiryDate: '2028-01-15', provider: 'LG 5-Year Warranty' },
    { item: 'Laptop', purchaseDate: '2023-09-01', expiryDate: '2026-09-01', provider: 'AppleCare+' },
    { item: 'TV', purchaseDate: '2023-03-20', expiryDate: '2025-03-20', provider: 'Samsung Warranty' }
  ];
  for (const warranty of warranties) {
    await addDoc(collection(db, 'warranties'), { ...warranty, userId });
    added++;
  }

  // Pets
  console.log('Adding pets...');
  const pets = [
    { name: 'Max', type: 'Dog', breed: 'Golden Retriever', birthday: '2020-05-15', vetName: 'Dr. Anderson', vetPhone: '555-PETS', medications: ['Heartworm prevention'] },
    { name: 'Whiskers', type: 'Cat', breed: 'Tabby', birthday: '2021-03-10', vetName: 'Dr. Anderson', vetPhone: '555-PETS', medications: [] }
  ];
  for (const pet of pets) {
    await addDoc(collection(db, 'pets'), { ...pet, userId });
    added++;
  }

  // Plants
  console.log('Adding plants...');
  const plants = [
    { name: 'Monstera', type: 'Tropical', location: 'Living Room', wateringFrequency: 7, lastWatered: new Date().toISOString(), nextWatering: new Date(Date.now() + 86400000 * 7).toISOString() },
    { name: 'Snake Plant', type: 'Succulent', location: 'Bedroom', wateringFrequency: 14, lastWatered: new Date().toISOString(), nextWatering: new Date(Date.now() + 86400000 * 14).toISOString() },
    { name: 'Pothos', type: 'Vine', location: 'Kitchen', wateringFrequency: 5, lastWatered: new Date().toISOString(), nextWatering: new Date(Date.now() + 86400000 * 5).toISOString() }
  ];
  for (const plant of plants) {
    await addDoc(collection(db, 'plants'), { ...plant, userId });
    added++;
  }

  // Vehicles
  console.log('Adding vehicles...');
  const vehicles = [
    { make: 'Honda', model: 'Accord', year: 2020, licensePlate: 'ABC-1234', mileage: 45000, lastService: '2024-08-15', nextService: new Date(Date.now() + 86400000 * 30).toISOString() },
    { make: 'Toyota', model: 'RAV4', year: 2021, licensePlate: 'XYZ-5678', mileage: 28000, lastService: '2024-09-20', nextService: new Date(Date.now() + 86400000 * 60).toISOString() }
  ];
  for (const vehicle of vehicles) {
    await addDoc(collection(db, 'vehicles'), { ...vehicle, userId });
    added++;
  }

  // Insurance
  console.log('Adding insurance policies...');
  const insurance = [
    { type: 'Auto', provider: 'State Farm', policyNumber: 'AUTO-123456', premium: 150.00, renewalDate: new Date(Date.now() + 86400000 * 90).toISOString(), coverage: 'Full Coverage' },
    { type: 'Home', provider: 'Allstate', policyNumber: 'HOME-789012', premium: 120.00, renewalDate: new Date(Date.now() + 86400000 * 120).toISOString(), coverage: 'Comprehensive' },
    { type: 'Health', provider: 'Blue Cross', policyNumber: 'HEALTH-345678', premium: 300.00, renewalDate: new Date(Date.now() + 86400000 * 180).toISOString(), coverage: 'Family Plan' }
  ];
  for (const policy of insurance) {
    await addDoc(collection(db, 'insurance'), { ...policy, userId });
    added++;
  }

  // Passwords
  console.log('Adding passwords...');
  const passwords = [
    { service: 'Amazon', username: 'user@email.com', encryptedPassword: 'encrypted_pass_123', category: 'Shopping', url: 'https://amazon.com' },
    { service: 'Netflix', username: 'user@email.com', encryptedPassword: 'encrypted_pass_456', category: 'Social', url: 'https://netflix.com' },
    { service: 'Bank Portal', username: 'johndoe', encryptedPassword: 'encrypted_pass_789', category: 'Banking', url: 'https://bank.com' }
  ];
  for (const pwd of passwords) {
    await addDoc(collection(db, 'passwords'), { ...pwd, userId });
    added++;
  }

  // Guests
  console.log('Adding guests...');
  const guests = [
    { name: 'Aunt Mary', arrivalDate: new Date(Date.now() + 86400000 * 14).toISOString(), departureDate: new Date(Date.now() + 86400000 * 17).toISOString(), phone: '555-1111', notes: 'Visiting for weekend' },
    { name: 'College Friend Tom', arrivalDate: new Date(Date.now() + 86400000 * 30).toISOString(), departureDate: new Date(Date.now() + 86400000 * 32).toISOString(), phone: '555-2222', notes: 'Passing through town' }
  ];
  for (const guest of guests) {
    await addDoc(collection(db, 'guests'), { ...guest, userId });
    added++;
  }

  // Energy
  console.log('Adding energy readings...');
  const energy = [
    { date: new Date(Date.now() - 86400000 * 30).toISOString(), type: 'electricity', usage: 850, cost: 120.00 },
    { date: new Date(Date.now() - 86400000 * 60).toISOString(), type: 'electricity', usage: 920, cost: 135.00 },
    { date: new Date(Date.now() - 86400000 * 30).toISOString(), type: 'gas', usage: 45, cost: 65.00 }
  ];
  for (const reading of energy) {
    await addDoc(collection(db, 'energy'), { ...reading, userId });
    added++;
  }

  // Smart Devices
  console.log('Adding smart devices...');
  const devices = [
    { name: 'Smart Thermostat', type: 'Climate Control', location: 'Hallway', status: 'online', lastActive: new Date().toISOString() },
    { name: 'Smart Doorbell', type: 'Security', location: 'Front Door', status: 'online', lastActive: new Date().toISOString() },
    { name: 'Smart Lights - Bedroom', type: 'Lighting', location: 'Master Bedroom', status: 'online', lastActive: new Date().toISOString() }
  ];
  for (const device of devices) {
    await addDoc(collection(db, 'devices'), { ...device, userId });
    added++;
  }

  // Packages
  console.log('Adding packages...');
  const packages = [
    { carrier: 'Amazon', trackingNumber: '1Z999AA10123456784', description: 'Kitchen appliances', expectedDelivery: new Date(Date.now() + 86400000 * 3).toISOString(), delivered: false },
    { carrier: 'FedEx', trackingNumber: '771234567890', description: 'Office supplies', expectedDelivery: new Date(Date.now() + 86400000 * 5).toISOString(), delivered: false }
  ];
  for (const pkg of packages) {
    await addDoc(collection(db, 'packages'), { ...pkg, userId });
    added++;
  }

  // Subscriptions
  console.log('Adding subscriptions...');
  const subscriptions = [
    { service: 'Netflix', cost: 15.99, billingCycle: 'monthly', nextBilling: new Date(Date.now() + 86400000 * 15).toISOString(), category: 'Entertainment', active: true },
    { service: 'Spotify', cost: 9.99, billingCycle: 'monthly', nextBilling: new Date(Date.now() + 86400000 * 20).toISOString(), category: 'Entertainment', active: true },
    { service: 'Amazon Prime', cost: 139.00, billingCycle: 'yearly', nextBilling: new Date(Date.now() + 86400000 * 200).toISOString(), category: 'Shopping', active: true }
  ];
  for (const sub of subscriptions) {
    await addDoc(collection(db, 'subscriptions'), { ...sub, userId });
    added++;
  }

  // Notifications
  console.log('Adding notifications...');
  const notifications = [
    { title: 'Bill Due Soon', message: 'Electric bill due in 3 days', type: 'warning', read: false, createdAt: new Date().toISOString() },
    { title: 'Task Completed', message: 'You completed 5 tasks today!', type: 'success', read: false, createdAt: new Date().toISOString() },
    { title: 'Welcome!', message: 'Welcome to HomeFlow Pro', type: 'info', read: false, createdAt: new Date().toISOString() }
  ];
  for (const notif of notifications) {
    await addDoc(collection(db, 'notifications'), { ...notif, userId });
    added++;
  }

  console.log(`\n✅ Added ${added} new items!`);
  console.log('🎉 All features now have sample data!\n');
  
  process.exit(0);
}

populateAll().catch(console.error);

