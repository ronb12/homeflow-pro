export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  color?: string;
}

export interface ShoppingItem {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  category: string;
  purchased: boolean;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Bill {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  recurring: boolean;
  category: string;
}

export interface InventoryItem {
  id: string;
  userId: string;
  name: string;
  category: string;
  location: string;
  quantity: number;
  purchaseDate?: string;
  expiryDate?: string;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId?: string;
}

export interface Recipe {
  id: string;
  userId: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  category: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  role: string;
  birthday?: string;
  phone?: string;
  email?: string;
  avatar?: string;
}

export interface Chore {
  id: string;
  userId: string;
  title: string;
  assignedTo?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  lastCompleted?: string;
  nextDue: string;
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  category: string;
  url?: string;
  notes?: string;
  uploadDate: string;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface Maintenance {
  id: string;
  userId: string;
  item: string;
  type: string;
  lastServiced?: string;
  nextService: string;
  cost?: number;
  notes?: string;
}

export interface Warranty {
  id: string;
  userId: string;
  item: string;
  purchaseDate: string;
  expiryDate: string;
  provider: string;
  documentUrl?: string;
}

export interface Pet {
  id: string;
  userId: string;
  name: string;
  type: string;
  breed?: string;
  birthday?: string;
  vetName?: string;
  vetPhone?: string;
  medications?: string[];
}

export interface Plant {
  id: string;
  userId: string;
  name: string;
  type: string;
  location: string;
  wateringFrequency: number;
  lastWatered?: string;
  nextWatering: string;
  notes?: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  mileage?: number;
  lastService?: string;
  nextService?: string;
}

export interface Insurance {
  id: string;
  userId: string;
  type: string;
  provider: string;
  policyNumber: string;
  premium: number;
  renewalDate: string;
  coverage: string;
}

export interface Password {
  id: string;
  userId: string;
  service: string;
  username: string;
  encryptedPassword: string;
  category: string;
  url?: string;
  notes?: string;
}

export interface Guest {
  id: string;
  userId: string;
  name: string;
  arrivalDate: string;
  departureDate: string;
  phone?: string;
  notes?: string;
}

export interface EnergyReading {
  id: string;
  userId: string;
  date: string;
  type: 'electricity' | 'gas' | 'water';
  usage: number;
  cost: number;
}

export interface SmartDevice {
  id: string;
  userId: string;
  name: string;
  type: string;
  location: string;
  status: 'online' | 'offline';
  lastActive?: string;
}

export interface Package {
  id: string;
  userId: string;
  carrier: string;
  trackingNumber: string;
  description: string;
  expectedDelivery?: string;
  delivered: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  service: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  nextBilling: string;
  category: string;
  active: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: string;
  progress: number;
  category: string;
  completed: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

