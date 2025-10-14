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
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.category} • {item.location} • Qty: {item.quantity}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{new Date(item.date).toLocaleDateString()} • {item.mealType}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">
            {item.category} • Prep: {item.prepTime}min • Cook: {item.cookTime}min • Serves: {item.servings}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.role} • {item.phone} • {item.email}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'title', label: 'Chore', type: 'text', required: true },
      { name: 'assignedTo', label: 'Assigned To', type: 'text' },
      { name: 'frequency', label: 'Frequency', type: 'select', options: ['daily', 'weekly', 'monthly'] },
      { name: 'nextDue', label: 'Next Due', type: 'date' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.title}</div>
          <div className="text-small text-muted">
            Assigned to: {item.assignedTo} • {item.frequency} • Due: {new Date(item.nextDue).toLocaleDateString()}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.category}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'phone', label: 'Phone', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'address', label: 'Address', type: 'textarea' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.relationship} • {item.phone}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'item', label: 'Item', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'text' },
      { name: 'lastServiced', label: 'Last Serviced', type: 'date' },
      { name: 'nextService', label: 'Next Service', type: 'date' },
      { name: 'cost', label: 'Cost', type: 'number' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.item}</div>
          <div className="text-small text-muted">
            Next: {new Date(item.nextService).toLocaleDateString()} • ${item.cost}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'item', label: 'Item', type: 'text', required: true },
      { name: 'purchaseDate', label: 'Purchase Date', type: 'date' },
      { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
      { name: 'provider', label: 'Provider', type: 'text' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.item}</div>
          <div className="text-small text-muted">
            {item.provider} • Expires: {new Date(item.expiryDate).toLocaleDateString()}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'type', label: 'Type', type: 'select', options: ['Dog', 'Cat', 'Bird', 'Fish', 'Other'] },
      { name: 'breed', label: 'Breed', type: 'text' },
      { name: 'birthday', label: 'Birthday', type: 'date' },
      { name: 'vetName', label: 'Vet Name', type: 'text' },
      { name: 'vetPhone', label: 'Vet Phone', type: 'text' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.type} • {item.breed} • Vet: {item.vetName}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'type', label: 'Type', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'wateringFrequency', label: 'Watering (days)', type: 'number' },
      { name: 'lastWatered', label: 'Last Watered', type: 'date' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">
            {item.type} • {item.location} • Water every {item.wateringFrequency} days
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Weather = () => (
  <div className="card">
    <div className="card-header">
      <h2 className="card-title"><Cloud size={24} />Weather Widget</h2>
    </div>
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <Cloud size={64} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
      <h3 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px' }}>72°F</h3>
      <p style={{ fontSize: '18px', color: 'var(--gray)' }}>Partly Cloudy</p>
      <div className="grid grid-3" style={{ marginTop: '24px', gap: '16px' }}>
        <div><strong>Humidity:</strong> 65%</div>
        <div><strong>Wind:</strong> 8 mph</div>
        <div><strong>UV Index:</strong> 5</div>
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
      { name: 'content', label: 'Content', type: 'textarea', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Personal', 'Work', 'Home', 'Ideas', 'Other'] },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.title}</div>
          <div className="text-small text-muted">{item.content.substring(0, 100)}...</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'model', label: 'Model', type: 'text', required: true },
      { name: 'year', label: 'Year', type: 'number' },
      { name: 'licensePlate', label: 'License Plate', type: 'text' },
      { name: 'mileage', label: 'Mileage', type: 'number' },
      { name: 'nextService', label: 'Next Service', type: 'date' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.year} {item.make} {item.model}</div>
          <div className="text-small text-muted">{item.licensePlate} • {item.mileage} miles</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'type', label: 'Type', type: 'select', options: ['Health', 'Auto', 'Home', 'Life', 'Other'] },
      { name: 'provider', label: 'Provider', type: 'text', required: true },
      { name: 'policyNumber', label: 'Policy Number', type: 'text' },
      { name: 'premium', label: 'Premium', type: 'number' },
      { name: 'renewalDate', label: 'Renewal Date', type: 'date' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.type} Insurance</div>
          <div className="text-small text-muted">
            {item.provider} • ${item.premium} • Renews: {new Date(item.renewalDate).toLocaleDateString()}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'service', label: 'Service', type: 'text', required: true },
      { name: 'username', label: 'Username', type: 'text' },
      { name: 'encryptedPassword', label: 'Password', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Social', 'Work', 'Banking', 'Shopping', 'Other'] },
      { name: 'url', label: 'URL', type: 'text' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.service}</div>
          <div className="text-small text-muted">{item.username} • {item.category}</div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'arrivalDate', label: 'Arrival', type: 'date' },
      { name: 'departureDate', label: 'Departure', type: 'date' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">
            {new Date(item.arrivalDate).toLocaleDateString()} - {new Date(item.departureDate).toLocaleDateString()}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['electricity', 'gas', 'water'] },
      { name: 'usage', label: 'Usage', type: 'number' },
      { name: 'cost', label: 'Cost', type: 'number' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.type}</div>
          <div className="text-small text-muted">
            {new Date(item.date).toLocaleDateString()} • {item.usage} units • ${item.cost}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'type', label: 'Type', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['online', 'offline'] },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.name}</div>
          <div className="text-small text-muted">{item.type} • {item.location}</div>
        </div>
        <span className={`badge ${item.status === 'online' ? 'badge-success' : 'badge-danger'}`}>
          {item.status}
        </span>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'carrier', label: 'Carrier', type: 'select', options: ['UPS', 'FedEx', 'USPS', 'DHL', 'Amazon', 'Other'] },
      { name: 'trackingNumber', label: 'Tracking Number', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'expectedDelivery', label: 'Expected Delivery', type: 'date' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.description}</div>
          <div className="text-small text-muted">
            {item.carrier} • {item.trackingNumber} • Due: {new Date(item.expectedDelivery).toLocaleDateString()}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'service', label: 'Service', type: 'text', required: true },
      { name: 'cost', label: 'Cost', type: 'number' },
      { name: 'billingCycle', label: 'Billing Cycle', type: 'select', options: ['monthly', 'yearly'] },
      { name: 'nextBilling', label: 'Next Billing', type: 'date' },
      { name: 'category', label: 'Category', type: 'select', options: ['Entertainment', 'Software', 'Utilities', 'Other'] },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.service}</div>
          <div className="text-small text-muted">
            ${item.cost}/{item.billingCycle} • Next: {new Date(item.nextBilling).toLocaleDateString()}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

export const Goals = () => (
  <GenericFeature
    collectionName="goals"
    title="Goal Setting & Tracking"
    icon={<Target size={24} />}
    fields={[
      { name: 'title', label: 'Goal', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'targetDate', label: 'Target Date', type: 'date' },
      { name: 'category', label: 'Category', type: 'select', options: ['Personal', 'Financial', 'Health', 'Home', 'Other'] },
      { name: 'progress', label: 'Progress (%)', type: 'number' },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.title}</div>
          <div className="text-small text-muted">
            {item.category} • Target: {new Date(item.targetDate).toLocaleDateString()}
          </div>
          <div className="progress-bar" style={{ marginTop: '8px' }}>
            <div className="progress-fill" style={{ width: `${item.progress || 0}%` }} />
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
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
      { name: 'type', label: 'Type', type: 'select', options: ['info', 'warning', 'success', 'error'] },
    ]}
    renderItem={(item, onDelete) => (
      <div className="list-item">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600' }}>{item.title}</div>
          <div className="text-small text-muted">{item.message}</div>
        </div>
        <span className={`badge badge-${item.type === 'error' ? 'danger' : item.type}`}>{item.type}</span>
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={16} /></button>
      </div>
    )}
  />
);

