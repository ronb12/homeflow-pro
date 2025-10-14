import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../store';
import { ShoppingItem } from '../types';
import { Plus, ShoppingCart, Trash2, Check, Clock } from 'lucide-react';

export const Shopping = () => {
  const { user } = useStore();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, category: 'Groceries' });

  useEffect(() => {
    if (!user) return;
    fetchItems();
  }, [user]);

  const fetchItems = async () => {
    if (!user) return;
    const q = query(collection(db, 'shopping'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ShoppingItem[]);
  };

  const addItem = async () => {
    if (!user || !newItem.name) return;
    await addDoc(collection(db, 'shopping'), {
      ...newItem,
      userId: user.uid,
      purchased: false,
      createdAt: new Date().toISOString(),
    });
    setShowModal(false);
    setNewItem({ name: '', quantity: 1, category: 'Groceries' });
    fetchItems();
  };

  const togglePurchased = async (item: ShoppingItem) => {
    await updateDoc(doc(db, 'shopping', item.id), { purchased: !item.purchased });
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, 'shopping', id));
    fetchItems();
  };

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <h2 className="card-title"><ShoppingCart size={24} />Shopping Lists</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />Add Item
        </button>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>To Buy</h3>
          {items.filter(i => !i.purchased).length === 0 ? (
            <div className="empty-state"><p>All items purchased! 🎉</p></div>
          ) : (
            items.filter(i => !i.purchased).map(item => (
              <div key={item.id} className="list-item">
                <button onClick={() => togglePurchased(item)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Check size={20} color="var(--gray)" />
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>{item.name}</div>
                  <div className="text-small text-muted">Qty: {item.quantity} • {item.category}</div>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Purchased</h3>
          {items.filter(i => i.purchased).map(item => (
            <div key={item.id} className="list-item" style={{ opacity: 0.6 }}>
              <Check size={20} color="var(--success)" />
              <div style={{ flex: 1, textDecoration: 'line-through' }}>{item.name}</div>
              <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Shopping Item</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Item Name *</label>
              <input type="text" className="input" value={newItem.name}
                onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input type="number" className="input" value={newItem.quantity}
                onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="select" value={newItem.category}
                onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                <option>Groceries</option>
                <option>Household</option>
                <option>Personal Care</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addItem} disabled={!newItem.name}>Add Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

