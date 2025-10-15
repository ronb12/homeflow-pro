import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../store';
import { Bill } from '../types';
import { Plus, FileText, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export const Bills = () => {
  const { user } = useStore();
  const [bills, setBills] = useState<Bill[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newBill, setNewBill] = useState({ name: '', amount: 0, dueDate: '', category: 'Utilities', recurring: false });

  useEffect(() => {
    if (!user) return;
    fetchBills();
  }, [user]);

  const fetchBills = async () => {
    if (!user) return;
    const q = query(collection(db, 'bills'), where('userId', '==', user.uid), orderBy('dueDate', 'asc'));
    const snapshot = await getDocs(q);
    setBills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Bill[]);
  };

  const addBill = async () => {
    if (!user) return;
    await addDoc(collection(db, 'bills'), { ...newBill, userId: user.uid, paid: false });
    setShowModal(false);
    setNewBill({ name: '', amount: 0, dueDate: '', category: 'Utilities', recurring: false });
    fetchBills();
  };

  const togglePaid = async (bill: Bill) => {
    await updateDoc(doc(db, 'bills', bill.id), { paid: !bill.paid });
    fetchBills();
  };

  const deleteBill = async (id: string) => {
    await deleteDoc(doc(db, 'bills', id));
    fetchBills();
  };

  const totalUnpaid = bills.filter(b => !b.paid).reduce((sum, b) => sum + b.amount, 0);

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <h2 className="card-title"><FileText size={24} />Bill Reminders</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />Add Bill
        </button>
      </div>

      <div className="grid grid-2" style={{ marginBottom: '24px' }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
          <div className="stat-value">${totalUnpaid.toFixed(2)}</div>
          <div className="stat-label">Total Unpaid</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <div className="stat-value">{bills.filter(b => !b.paid).length}</div>
          <div className="stat-label">Pending Bills</div>
        </div>
      </div>

      <div className="card">
        {bills.map(bill => (
          <div key={bill.id} className="list-item">
            <button onClick={() => togglePaid(bill)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              {bill.paid ? <CheckCircle size={24} color="var(--success)" /> : <AlertCircle size={24} color="var(--warning)" />}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', textDecoration: bill.paid ? 'line-through' : 'none' }}>{bill.name}</div>
              <div className="text-small text-muted">
                Due: {new Date(bill.dueDate).toLocaleDateString()} • {bill.category}
                {bill.recurring && ' • Recurring'}
              </div>
            </div>
            <div style={{ fontWeight: '700', fontSize: '18px' }}>${bill.amount.toFixed(2)}</div>
            <button className="btn btn-danger btn-sm" onClick={() => deleteBill(bill.id)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Bill</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Bill Name *</label>
              <input type="text" className="input" value={newBill.name}
                onChange={e => setNewBill({ ...newBill, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Amount *</label>
              <input type="number" step="0.01" className="input" value={newBill.amount}
                onChange={e => setNewBill({ ...newBill, amount: e.target.value === '' ? 0 : parseFloat(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date *</label>
              <input type="date" className="input" value={newBill.dueDate}
                onChange={e => setNewBill({ ...newBill, dueDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="select" value={newBill.category}
                onChange={e => setNewBill({ ...newBill, category: e.target.value })}>
                <option>Utilities</option>
                <option>Rent/Mortgage</option>
                <option>Insurance</option>
                <option>Subscriptions</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={newBill.recurring}
                  onChange={e => setNewBill({ ...newBill, recurring: e.target.checked })} />
                Recurring Bill
              </label>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addBill}>Add Bill</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

