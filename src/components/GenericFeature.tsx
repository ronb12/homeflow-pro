// Generic reusable component template for simple CRUD features
import { useState, useEffect, ReactNode } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../store';
import { Plus, Trash2, Clock } from 'lucide-react';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  options?: string[];
  required?: boolean;
}

interface GenericFeatureProps {
  collectionName: string;
  title: string;
  icon: ReactNode;
  fields: Field[];
  renderItem: (item: any, onDelete: () => void, onEdit?: () => void) => ReactNode;
  emptyMessage?: string;
}

export const GenericFeature = ({ 
  collectionName, 
  title, 
  icon, 
  fields,
  renderItem,
  emptyMessage = 'No items yet'
}: GenericFeatureProps) => {
  const { user } = useStore();
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchItems();
  }, [user]);

  useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      if (field.type === 'checkbox') initialData[field.name] = false;
      else if (field.type === 'number') initialData[field.name] = 0;
      else if (field.type === 'date') initialData[field.name] = new Date().toISOString().split('T')[0];
      else initialData[field.name] = '';
    });
    setFormData(initialData);
  }, [fields]);

  const fetchItems = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, collectionName), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setEditingItem(null);
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      if (field.type === 'checkbox') initialData[field.name] = false;
      else if (field.type === 'number') initialData[field.name] = 0;
      else if (field.type === 'date') initialData[field.name] = new Date().toISOString().split('T')[0];
      else initialData[field.name] = '';
    });
    setFormData(initialData);
    setShowModal(true);
  };

  const editItem = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const saveItem = async () => {
    if (!user) return;
    try {
      if (editingItem) {
        // Update existing item
        await updateDoc(doc(db, collectionName, editingItem.id), formData);
      } else {
        // Add new item
        await addDoc(collection(db, collectionName), { ...formData, userId: user.uid, createdAt: new Date().toISOString() });
      }
      setShowModal(false);
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return <div className="loading"><Clock className="spinner" size={32} /><p>Loading...</p></div>;
  }

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <h2 className="card-title">{icon}{title}</h2>
        <button className="btn btn-primary" onClick={openModal}>
          <Plus size={18} />Add New
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state"><p>{emptyMessage}</p></div>
      ) : (
        <div className="card">
          {items.map(item => (
            <div key={item.id}>
              {renderItem(item, () => deleteItem(item.id), () => editItem(item))}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => {
          setShowModal(false);
          setEditingItem(null);
        }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingItem ? 'Edit' : 'Add New'} {title.replace(/s$/, '')}</h3>
              <button className="modal-close" onClick={() => {
                setShowModal(false);
                setEditingItem(null);
              }}>×</button>
            </div>

            {fields.map(field => (
              <div key={field.name} className="form-group">
                <label className="form-label">
                  {field.label} {field.required && '*'}
                </label>
                {field.type === 'select' ? (
                  <select
                    className="select"
                    value={formData[field.name] || ''}
                    onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                  >
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    className="textarea"
                    value={formData[field.name] || ''}
                    onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                  />
                ) : field.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    checked={formData[field.name] || false}
                    onChange={e => setFormData({ ...formData, [field.name]: e.target.checked })}
                  />
                ) : (
                  <input
                    type={field.type}
                    className="input"
                    value={formData[field.name] || ''}
                    onChange={e => setFormData({ ...formData, [field.name]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                  />
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => {
                setShowModal(false);
                setEditingItem(null);
              }}>Cancel</button>
              <button className="btn btn-primary" onClick={saveItem}>
                {editingItem ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

