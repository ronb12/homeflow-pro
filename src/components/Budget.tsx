import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../store';
import { Expense } from '../types';
import { Plus, DollarSign, Trash2, TrendingDown } from 'lucide-react';

export const Budget = () => {
  const { user } = useStore();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: 0, category: 'Food', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    if (!user) return;
    fetchExpenses();
  }, [user]);

  const fetchExpenses = async () => {
    if (!user) return;
    const q = query(collection(db, 'expenses'), where('userId', '==', user.uid), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expense[]);
  };

  const addExpense = async () => {
    if (!user) return;
    await addDoc(collection(db, 'expenses'), { ...newExpense, userId: user.uid });
    setShowModal(false);
    setNewExpense({ description: '', amount: 0, category: 'Food', date: new Date().toISOString().split('T')[0] });
    fetchExpenses();
  };

  const deleteExpense = async (id: string) => {
    await deleteDoc(doc(db, 'expenses', id));
    fetchExpenses();
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <h2 className="card-title"><DollarSign size={24} />Budget & Expenses</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />Add Expense
        </button>
      </div>

      <div className="grid grid-3" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-value">${totalExpenses.toFixed(2)}</div>
          <div className="stat-label">Total Expenses</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
          <div className="stat-value">{expenses.length}</div>
          <div className="stat-label">Transactions</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <div className="stat-value">${(totalExpenses / Math.max(expenses.length, 1)).toFixed(2)}</div>
          <div className="stat-label">Average</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>By Category</h3>
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <div key={category} className="list-item">
              <TrendingDown size={20} color="var(--danger)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600' }}>{category}</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(amount / totalExpenses) * 100}%` }} />
                </div>
              </div>
              <div style={{ fontWeight: '700' }}>${amount.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Recent Expenses</h3>
          {expenses.slice(0, 10).map(expense => (
            <div key={expense.id} className="list-item">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600' }}>{expense.description}</div>
                <div className="text-small text-muted">{new Date(expense.date).toLocaleDateString()} • {expense.category}</div>
              </div>
              <div style={{ fontWeight: '700', color: 'var(--danger)' }}>-${expense.amount.toFixed(2)}</div>
              <button className="btn btn-danger btn-sm" onClick={() => deleteExpense(expense.id)}>
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
              <h3 className="modal-title">Add Expense</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <input type="text" className="input" value={newExpense.description}
                onChange={e => setNewExpense({ ...newExpense, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Amount *</label>
              <input type="number" step="0.01" className="input" value={newExpense.amount}
                onChange={e => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="select" value={newExpense.category}
                onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}>
                <option>Food</option>
                <option>Transport</option>
                <option>Entertainment</option>
                <option>Bills</option>
                <option>Healthcare</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="input" value={newExpense.date}
                onChange={e => setNewExpense({ ...newExpense, date: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addExpense}>Add Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

