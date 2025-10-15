// Simplified implementations for remaining features
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../store';
import { GenericFeature } from './GenericFeature';
import { useNotifications } from '../hooks/useNotifications';
import { Trash2, Home, UtensilsCrossed, BookOpen, Users, Briefcase, FolderOpen, Phone, Wrench, Shield, Dog, Leaf, Link as LinkIcon, StickyNote, Car, CreditCard, Lock, UserPlus, Zap, Smartphone, Package, Repeat, Target, Bell, ExternalLink } from 'lucide-react';

export const Inventory = () => (
  <GenericFeature
    collectionName="inventory"
    title="Home Inventory"
    icon={<Home size={24} />}
    fields={[
      { name: 'name', label: 'Item Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Kitchen', 'Electronics', 'Furniture', 'Tools', 'Other'] },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'quantity', label: 'Quantity', type: 'number' },
      { name: 'serialNumber', label: 'Serial Number (if applicable)', type: 'text' },
      { name: 'purchaseDate', label: 'Purchase Date', type: 'date' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">
            {item.category} • {item.location} • Qty: {item.quantity}
            {item.serialNumber && ` • SN: ${item.serialNumber}`}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Meals = () => (
  <GenericFeature
    collectionName="meals"
    title="Meal Planning"
    icon={<UtensilsCrossed size={24} />}
    fields={[
      { name: 'name', label: 'Meal Name', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'mealType', label: 'Type', type: 'select', options: ['breakfast', 'lunch', 'dinner', 'snack'] },
      { name: 'servings', label: 'Number of People', type: 'number' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">
            {new Date(item.date).toLocaleDateString()} • {item.mealType}
            {item.servings && ` • ${item.servings} people`}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Recipes = () => (
  <GenericFeature
    collectionName="recipes"
    title="Recipe Storage"
    icon={<BookOpen size={24} />}
    fields={[
      { name: 'name', label: 'Recipe Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'] },
      { name: 'sourceUrl', label: 'Recipe Source URL (optional)', type: 'text' },
      { name: 'prepTime', label: 'Prep Time (min)', type: 'number' },
      { name: 'cookTime', label: 'Cook Time (min)', type: 'number' },
      { name: 'servings', label: 'Servings', type: 'number' },
      { name: 'ingredients', label: 'Ingredients (one per line)', type: 'textarea' },
      { name: 'instructions', label: 'Instructions', type: 'textarea' },
      { name: 'notes', label: 'Personal Notes (optional)', type: 'textarea' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">
            {item.category} • Prep: {item.prepTime}min • Cook: {item.cookTime}min • Serves: {item.servings}
          </div>
          {item.ingredients && typeof item.ingredients === 'string' && item.ingredients.trim() && (
            <div className="text-small" style={{ marginTop: '8px', fontStyle: 'italic' }}>
              📝 {item.ingredients.split('\n').filter((l: string) => l.trim()).length} ingredients
            </div>
          )}
          {item.sourceUrl && (
            <a 
              href={item.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-small"
              style={{ color: 'var(--primary)', marginTop: '4px', display: 'inline-block' }}
              onClick={(e) => e.stopPropagation()}
            >
              📎 View Original Recipe
            </a>
          )}
          {item.notes && (
            <div className="text-small" style={{ marginTop: '4px', color: 'var(--warning)', fontStyle: 'italic' }}>
              💡 {item.notes.substring(0, 60)}{item.notes.length > 60 ? '...' : ''}
            </div>
          )}
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 size={16} />
        </button>
      </div>
    )}
  />
);

export const Family = () => (
  <GenericFeature
    collectionName="family"
    title="Family Members"
    icon={<Users size={24} />}
    fields={[
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'birthday', label: 'Birthday', type: 'date' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.role} • {item.phone} • {item.email}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Chores = () => (
  <GenericFeature
    collectionName="chores"
    title="Chore Assignment"
    icon={<Briefcase size={24} />}
    fields={[
      { name: 'name', label: 'Chore Name', type: 'text', required: true },
      { name: 'assignedTo', label: 'Assigned To', type: 'text' },
      { name: 'frequency', label: 'Frequency', type: 'select', options: ['daily', 'weekly', 'monthly'] },
      { name: 'nextDue', label: 'Next Due', type: 'date' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.assignedTo} • {item.frequency} • Due: {new Date(item.nextDue).toLocaleDateString()}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Documents = () => (
  <GenericFeature
    collectionName="documents"
    title="Document Storage"
    icon={<FolderOpen size={24} />}
    fields={[
      { name: 'name', label: 'Document Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Legal', 'Financial', 'Medical', 'Personal', 'Other'] },
      { name: 'url', label: 'Document URL (Google Drive, Dropbox, etc.)', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.category}</div>
          {item.url && (
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-small"
              style={{ color: 'var(--primary)', marginTop: '4px', display: 'inline-block' }}
              onClick={(e) => e.stopPropagation()}
            >
              📎 View Document
            </a>
          )}
          {item.notes && <div className="text-small text-muted" style={{ marginTop: '4px' }}>📝 {item.notes.substring(0, 50)}{item.notes.length > 50 ? '...' : ''}</div>}
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 size={16} />
        </button>
      </div>
    )}
  />
);

export const Contacts = () => (
  <GenericFeature
    collectionName="contacts"
    title="Emergency Contacts"
    icon={<Phone size={24} />}
    fields={[
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'relationship', label: 'Relationship', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.relationship} • {item.phone}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Maintenance = () => (
  <GenericFeature
    collectionName="maintenance"
    title="Home Maintenance"
    icon={<Wrench size={24} />}
    fields={[
      { name: 'item', label: 'Item/System', type: 'text', required: true },
      { name: 'lastService', label: 'Last Service Date', type: 'date' },
      { name: 'nextService', label: 'Next Service Date', type: 'date' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.item}</div>
          <div className="text-small text-muted">Next: {new Date(item.nextService).toLocaleDateString()}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Warranties = () => (
  <GenericFeature
    collectionName="warranties"
    title="Warranty Tracking"
    icon={<Shield size={24} />}
    fields={[
      { name: 'product', label: 'Product Name', type: 'text', required: true },
      { name: 'warrantyNumber', label: 'Warranty Number (optional)', type: 'text' },
      { name: 'purchaseDate', label: 'Purchase Date', type: 'date' },
      { name: 'expiryDate', label: 'Warranty Expiry', type: 'date' },
      { name: 'store', label: 'Store/Vendor', type: 'text' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.product}</div>
          <div className="text-small text-muted">
            Expires: {new Date(item.expiryDate).toLocaleDateString()} • {item.store}
            {item.warrantyNumber && ` • #${item.warrantyNumber}`}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Pets = () => (
  <GenericFeature
    collectionName="pets"
    title="Pet Management"
    icon={<Dog size={24} />}
    fields={[
      { name: 'name', label: 'Pet Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['dog', 'cat', 'bird', 'fish', 'other'] },
      { name: 'breed', label: 'Breed', type: 'text' },
      { name: 'birthday', label: 'Birthday', type: 'date' },
      { name: 'vet', label: 'Veterinarian', type: 'text' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.type} • {item.breed}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Plants = () => (
  <GenericFeature
    collectionName="plants"
    title="Plant Care"
    icon={<Leaf size={24} />}
    fields={[
      { name: 'name', label: 'Plant Name', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'wateringFrequency', label: 'Water Every (days)', type: 'number' },
      { name: 'lastWatered', label: 'Last Watered', type: 'date' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.location} • Water every {item.wateringFrequency} days</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const QuickLinks = () => (
  <GenericFeature
    collectionName="quicklinks"
    title="Quick Links"
    icon={<LinkIcon size={24} />}
    fields={[
      { name: 'name', label: 'Link Name', type: 'text', required: true },
      { name: 'url', label: 'URL', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Utilities', 'Banking', 'School', 'Medical', 'Shopping', 'Other'] },
      { name: 'description', label: 'Description (optional)', type: 'text' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ fontWeight: '600', color: 'var(--primary)', textDecoration: 'none', flex: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              🔗 {item.name}
            </a>
            <button 
              className="btn btn-sm btn-outline"
              onClick={(e) => { e.stopPropagation(); if (onEdit) onEdit(); }}
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              Edit
            </button>
          </div>
          <div className="text-small text-muted" style={{ marginTop: '4px' }}>
            {item.category}
            {item.description && ` • ${item.description}`}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 size={16} />
        </button>
      </div>
    )}
    emptyMessage="No quick links yet. Add your favorite websites!"
  />
);

export const Notes = () => (
  <GenericFeature
    collectionName="notes"
    title="Quick Notes"
    icon={<StickyNote size={24} />}
    fields={[
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'textarea' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.title}</div>
          {item.content && <div className="text-small text-muted">{item.content.substring(0, 100)}{item.content.length > 100 ? '...' : ''}</div>}
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Vehicles = () => (
  <GenericFeature
    collectionName="vehicles"
    title="Vehicle Management"
    icon={<Car size={24} />}
    fields={[
      { name: 'make', label: 'Make', type: 'text', required: true },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'year', label: 'Year', type: 'number' },
      { name: 'licensePlate', label: 'License Plate #', type: 'text' },
      { name: 'mileage', label: 'Current Mileage', type: 'number' },
      { name: 'nextService', label: 'Next Service Date', type: 'date' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.year} {item.make} {item.model}</div>
          <div className="text-small text-muted">
            {item.mileage?.toLocaleString()} miles
            {item.licensePlate && ` • 🚗 ${item.licensePlate}`}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Insurance = () => (
  <GenericFeature
    collectionName="insurance"
    title="Insurance Tracking"
    icon={<CreditCard size={24} />}
    fields={[
      { name: 'type', label: 'Insurance Type', type: 'select', options: ['Home', 'Auto', 'Health', 'Life', 'Other'] },
      { name: 'provider', label: 'Provider', type: 'text', required: true },
      { name: 'policyNumber', label: 'Policy Number', type: 'text' },
      { name: 'renewalDate', label: 'Renewal Date', type: 'date' },
      { name: 'premium', label: 'Premium Amount', type: 'number' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.type} - {item.provider}</div>
          <div className="text-small text-muted">Renews: {new Date(item.renewalDate).toLocaleDateString()} • ${item.premium}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Passwords = () => (
  <GenericFeature
    collectionName="passwords"
    title="Password Manager"
    icon={<Lock size={24} />}
    fields={[
      { name: 'service', label: 'Service/Website', type: 'text', required: true },
      { name: 'websiteUrl', label: 'Website URL (optional)', type: 'text' },
      { name: 'username', label: 'Username/Email', type: 'text' },
      { name: 'password', label: 'Password', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.service}</div>
          <div className="text-small text-muted">{item.username}</div>
          {item.websiteUrl && (
            <a 
              href={item.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-small"
              style={{ color: 'var(--primary)', marginTop: '4px', display: 'inline-block' }}
              onClick={(e) => e.stopPropagation()}
            >
              🔗 Open Website
            </a>
          )}
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Guests = () => (
  <GenericFeature
    collectionName="guests"
    title="Guest Management"
    icon={<UserPlus size={24} />}
    fields={[
      { name: 'name', label: 'Guest Name', type: 'text', required: true },
      { name: 'arrivalDate', label: 'Arrival Date', type: 'date' },
      { name: 'departureDate', label: 'Departure Date', type: 'date' },
      { name: 'room', label: 'Room/Location', type: 'text' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">
            {new Date(item.arrivalDate).toLocaleDateString()} - {new Date(item.departureDate).toLocaleDateString()}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Energy = () => (
  <GenericFeature
    collectionName="energy"
    title="Energy Tracking"
    icon={<Zap size={24} />}
    fields={[
      { name: 'month', label: 'Month', type: 'date' },
      { name: 'electricity', label: 'Electricity (kWh)', type: 'number' },
      { name: 'gas', label: 'Gas (therms)', type: 'number' },
      { name: 'water', label: 'Water (gallons)', type: 'number' },
      { name: 'cost', label: 'Total Cost', type: 'number' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{new Date(item.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
          <div className="text-small text-muted">
            ⚡ {item.electricity} kWh • 🔥 {item.gas} therms • 💧 {item.water} gal • ${item.cost}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Devices = () => (
  <GenericFeature
    collectionName="devices"
    title="Smart Home Devices"
    icon={<Smartphone size={24} />}
    fields={[
      { name: 'name', label: 'Device Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['Light', 'Thermostat', 'Camera', 'Lock', 'Speaker', 'Other'] },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['Online', 'Offline', 'Maintenance'] },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.type} • {item.location} • {item.status}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Packages = () => {
  // Generate tracking URL based on carrier
  const getTrackingUrl = (carrier: string, trackingNumber: string) => {
    if (!trackingNumber) return null;
    
    const carriers: Record<string, string> = {
      'USPS': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      'FedEx': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
      'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
      'Amazon': `https://www.amazon.com/gp/css/order-history?search=${trackingNumber}`,
    };
    
    return carriers[carrier] || null;
  };

  return (
    <GenericFeature
      collectionName="packages"
      title="Package Tracking"
      icon={<Package size={24} />}
      fields={[
        { name: 'description', label: 'Package Description', type: 'text', required: true },
        { name: 'trackingNumber', label: 'Tracking Number', type: 'text' },
        { name: 'carrier', label: 'Carrier', type: 'select', options: ['USPS', 'FedEx', 'UPS', 'Amazon', 'Other'] },
        { name: 'expectedDelivery', label: 'Expected Delivery', type: 'date' },
        { name: 'status', label: 'Status', type: 'select', options: ['Ordered', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'] },
      ]}
      renderItem={(item, onDelete, onEdit) => {
        const trackingUrl = getTrackingUrl(item.carrier, item.trackingNumber);
        const statusColor = item.status === 'Delivered' ? 'var(--success)' : 
                           item.status === 'Out for Delivery' ? 'var(--warning)' : 
                           'var(--gray)';
        
        return (
          <div className="list-item">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.description}</div>
              <div className="text-small text-muted" style={{ marginBottom: '4px' }}>
                {item.carrier}
                {item.trackingNumber && ` • ${item.trackingNumber}`}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span 
                  className="text-small" 
                  style={{ 
                    color: statusColor, 
                    fontWeight: '600',
                    padding: '2px 8px',
                    background: `${statusColor}20`,
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}
                >
                  {item.status}
                </span>
                {item.expectedDelivery && (
                  <span className="text-small text-muted">
                    Expected: {new Date(item.expectedDelivery).toLocaleDateString()}
                  </span>
                )}
              </div>
              {trackingUrl && (
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-small"
                  style={{ 
                    color: 'var(--primary)', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    textDecoration: 'none'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={12} />
                  Track Package on {item.carrier}
                </a>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                className="btn btn-outline btn-sm" 
                onClick={(e) => { e.stopPropagation(); if (onEdit) onEdit(); }}
                title="Edit package"
              >
                Edit
              </button>
              <button 
                className="btn btn-danger btn-sm" 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                title="Delete package"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      }}
    />
  );
};

export const Subscriptions = () => (
  <GenericFeature
    collectionName="subscriptions"
    title="Subscription Management"
    icon={<Repeat size={24} />}
    fields={[
      { name: 'service', label: 'Service Name', type: 'text', required: true },
      { name: 'cost', label: 'Monthly Cost', type: 'number' },
      { name: 'billingDate', label: 'Billing Date', type: 'date' },
      { name: 'category', label: 'Category', type: 'select', options: ['Entertainment', 'Software', 'Fitness', 'Food', 'Other'] },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.service}</div>
          <div className="text-small text-muted">${item.cost}/mo • {item.category}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Goals = () => (
  <GenericFeature
    collectionName="goals"
    title="Goal Setting"
    icon={<Target size={24} />}
    fields={[
      { name: 'goal', label: 'Goal', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Financial', 'Health', 'Home', 'Personal', 'Other'] },
      { name: 'targetDate', label: 'Target Date', type: 'date' },
      { name: 'progress', label: 'Progress (%)', type: 'number' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.goal}</div>
          <div className="text-small text-muted">{item.category} • {item.progress}% complete</div>
          <div className="progress-bar" style={{ marginTop: '8px' }}>
            <div className="progress-fill" style={{ width: `${item.progress}%` }} />
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Notifications = () => {
  const { user } = useStore();
  const { markAllAsRead } = useNotifications();
  const [items, setItems] = useState<any[]>([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);
  
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by created date, newest first
      notifs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setItems(notifs);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllAsRead(user.uid);
    fetchNotifications();
  };

  const toggleRead = async (item: any) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'notifications', item.id), { read: !item.read });
      fetchNotifications();
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'notifications', id));
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  const displayItems = showUnreadOnly ? items.filter((i: any) => !i.read) : items;
  const unreadCount = items.filter((i: any) => !i.read).length;
  
  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <Bell size={20} />
          <h2>System Notifications</h2>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div className="loading">Loading notifications...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <h2 className="card-title">
          <Bell size={24} />
          System Notifications
          {unreadCount > 0 && (
            <span style={{ 
              fontSize: '12px', 
              background: 'var(--danger)', 
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              marginLeft: '12px',
              fontWeight: '600'
            }}>
              {unreadCount} unread
            </span>
          )}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn btn-sm ${showUnreadOnly ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          >
            {showUnreadOnly ? 'Show All' : 'Unread Only'}
          </button>
          {unreadCount > 0 && (
            <button 
              className="btn btn-sm btn-outline"
              onClick={handleMarkAllRead}
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>
      
      <div className="card">
        {displayItems.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>
            <Bell size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <h3>No notifications</h3>
            <p>You're all caught up! System notifications will appear here automatically.</p>
            <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--gray)' }}>
              <p>Notifications are created automatically for:</p>
              <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '8px' }}>
                <li>💵 Bills due soon or overdue</li>
                <li>📋 Tasks due today or overdue</li>
                <li>🔐 Passwords expiring soon</li>
                <li>📦 Package delivery updates</li>
                <li>💰 Budget warnings</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="list">
            {displayItems.map((item: any) => {
              const typeEmojis: Record<string, string> = {
                bill: '💵',
                task: '📋',
                package: '📦',
                password: '🔐',
                budget: '💰',
                general: '🔔'
              };
              
              const priorityColor = 
                item.priority === 'Urgent' ? 'var(--danger)' :
                item.priority === 'High' ? '#f59e0b' :
                item.priority === 'Medium' ? 'var(--primary)' :
                'var(--gray)';
              
              return (
                <div 
                  key={item.id}
                  className="list-item" 
                  style={{ 
                    opacity: item.read ? 0.6 : 1,
                    borderLeft: `4px solid ${item.read ? 'transparent' : priorityColor}`,
                    background: item.read ? 'transparent' : 'rgba(59, 130, 246, 0.02)'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '20px' }}>{typeEmojis[item.type] || '🔔'}</span>
                      <div style={{ fontWeight: '600', flex: 1 }}>{item.title}</div>
                      {!item.read && (
                        <span style={{ 
                          fontSize: '10px', 
                          background: 'var(--primary)', 
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontWeight: '600'
                        }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="text-small text-muted" style={{ marginBottom: '4px' }}>{item.message}</div>
                    <div className="text-small" style={{ color: priorityColor, fontWeight: '600' }}>
                      {item.priority} Priority
                      {item.createdAt && (
                        <span style={{ color: 'var(--gray)', marginLeft: '8px', fontWeight: 'normal' }}>
                          • {new Date(item.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      className="btn btn-outline btn-sm" 
                      onClick={() => toggleRead(item)}
                      title={item.read ? "Mark as unread" : "Mark as read"}
                    >
                      {item.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => deleteNotification(item.id)}
                      title="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
