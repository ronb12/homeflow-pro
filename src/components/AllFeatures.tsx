// Simplified implementations for remaining features
import { GenericFeature } from './GenericFeature';
import { Trash2, Home, UtensilsCrossed, BookOpen, Users, Briefcase, FolderOpen, Phone, Wrench, Shield, Dog, Leaf, Cloud, StickyNote, Car, CreditCard, Lock, UserPlus, Zap, Smartphone, Package, Repeat, Target, Bell } from 'lucide-react';

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
      { name: 'purchaseDate', label: 'Purchase Date', type: 'date' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.category} • {item.location} • Qty: {item.quantity}</div>
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
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{new Date(item.date).toLocaleDateString()} • {item.mealType}</div>
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
      { name: 'prepTime', label: 'Prep Time (min)', type: 'number' },
      { name: 'cookTime', label: 'Cook Time (min)', type: 'number' },
      { name: 'servings', label: 'Servings', type: 'number' },
      { name: 'ingredients', label: 'Ingredients (one per line)', type: 'textarea' },
      { name: 'instructions', label: 'Instructions', type: 'textarea' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">
            {item.category} • Prep: {item.prepTime}min • Cook: {item.cookTime}min • Serves: {item.servings}
          </div>
          {item.ingredients && (
            <div className="text-small" style={{ marginTop: '8px', fontStyle: 'italic' }}>
              📝 {item.ingredients.split('\n').filter((l: string) => l.trim()).length} ingredients
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
      { name: 'purchaseDate', label: 'Purchase Date', type: 'date' },
      { name: 'expiryDate', label: 'Warranty Expiry', type: 'date' },
      { name: 'store', label: 'Store/Vendor', type: 'text' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.product}</div>
          <div className="text-small text-muted">Expires: {new Date(item.expiryDate).toLocaleDateString()} • {item.store}</div>
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

export const Weather = () => (
  <div className="card">
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <Cloud size={64} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
      <h2 style={{ fontSize: '48px', fontWeight: '700', margin: '0' }}>72°F</h2>
      <p style={{ fontSize: '18px', color: 'var(--gray)', margin: '8px 0' }}>Partly Cloudy</p>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '24px' }}>
        <div>
          <div className="text-small text-muted">Humidity</div>
          <div style={{ fontWeight: '600' }}>65%</div>
        </div>
        <div>
          <div className="text-small text-muted">Wind</div>
          <div style={{ fontWeight: '600' }}>8 mph</div>
        </div>
        <div>
          <div className="text-small text-muted">UV Index</div>
          <div style={{ fontWeight: '600' }}>4</div>
        </div>
      </div>
    </div>
  </div>
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
      { name: 'mileage', label: 'Current Mileage', type: 'number' },
      { name: 'nextService', label: 'Next Service Date', type: 'date' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.year} {item.make} {item.model}</div>
          <div className="text-small text-muted">{item.mileage?.toLocaleString()} miles</div>
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
      { name: 'username', label: 'Username/Email', type: 'text' },
      { name: 'password', label: 'Password', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.service}</div>
          <div className="text-small text-muted">{item.username}</div>
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

export const Packages = () => (
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
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item">
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.description}</div>
          <div className="text-small text-muted">
            {item.carrier} • {item.status} • {new Date(item.expectedDelivery).toLocaleDateString()}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

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

export const Notifications = () => (
  <GenericFeature
    collectionName="notifications"
    title="Notification Center"
    icon={<Bell size={24} />}
    fields={[
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'message', label: 'Message', type: 'textarea' },
      { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Urgent'] },
      { name: 'read', label: 'Mark as Read', type: 'checkbox' },
    ]}
    renderItem={(item, onDelete, onEdit) => (
      <div className="list-item" style={{ opacity: item.read ? 0.6 : 1 }}>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={onEdit}>
          <div style={{ fontWeight: '600' }}>{item.title}</div>
          <div className="text-small text-muted">{item.message}</div>
          <div className="text-small" style={{ color: item.priority === 'Urgent' || item.priority === 'High' ? 'var(--danger)' : 'var(--gray)' }}>
            {item.priority} Priority
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button>
      </div>
    )}
  />
);
