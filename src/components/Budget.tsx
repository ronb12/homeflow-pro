import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../store';
import { Expense } from '../types';
import { Plus, DollarSign, Trash2, TrendingDown, Settings, TrendingUp } from 'lucide-react';

export const Budget = () => {
  const { user } = useStore();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(2000); // Default budget
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [budgetInputs, setBudgetInputs] = useState({ income: '', budget: '' }); // Separate input states
  const [newExpense, setNewExpense] = useState({ description: '', amount: 0, category: 'Food', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    if (!user) return;
    fetchExpenses();
    loadBudgetSettings();
  }, [user]);

  const loadBudgetSettings = () => {
    // Load from localStorage (or could be from Firestore)
    const savedBudget = localStorage.getItem(`budget_${user?.uid}`);
    const savedIncome = localStorage.getItem(`income_${user?.uid}`);
    if (savedBudget) {
      const budgetVal = parseFloat(savedBudget);
      setMonthlyBudget(budgetVal);
      setBudgetInputs(prev => ({ ...prev, budget: budgetVal.toString() }));
    }
    if (savedIncome) {
      const incomeVal = parseFloat(savedIncome);
      setMonthlyIncome(incomeVal);
      setBudgetInputs(prev => ({ ...prev, income: incomeVal.toString() }));
    }
  };

  const openBudgetModal = () => {
    // Pre-fill inputs with current values
    setBudgetInputs({
      income: monthlyIncome > 0 ? monthlyIncome.toString() : '',
      budget: monthlyBudget > 0 ? monthlyBudget.toString() : ''
    });
    setShowBudgetModal(true);
  };

  const saveBudgetSettings = () => {
    if (!user) return;
    const income = parseFloat(budgetInputs.income) || 0;
    const budget = parseFloat(budgetInputs.budget) || 0;
    setMonthlyIncome(income);
    setMonthlyBudget(budget);
    localStorage.setItem(`budget_${user.uid}`, budget.toString());
    localStorage.setItem(`income_${user.uid}`, income.toString());
    setShowBudgetModal(false);
  };

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
  
  const remainingBudget = monthlyBudget - totalExpenses;
  const budgetPercentUsed = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;
  const netIncome = monthlyIncome - totalExpenses;

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <h2 className="card-title"><DollarSign size={24} />Budget & Expenses</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={openBudgetModal}>
            <Settings size={18} />Set Budget
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />Add Expense
          </button>
        </div>
      </div>

      {/* Budget Overview Card */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))' }}>
        <div className="grid grid-3" style={{ gap: '24px' }}>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '8px' }}>Monthly Income</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--success)' }}>
              ${monthlyIncome.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '8px' }}>Monthly Budget</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)' }}>
              ${monthlyBudget.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '8px' }}>Remaining</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: remainingBudget >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              ${remainingBudget.toFixed(2)}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span>Budget Used: {budgetPercentUsed.toFixed(1)}%</span>
            <span>${totalExpenses.toFixed(2)} / ${monthlyBudget.toFixed(2)}</span>
          </div>
          <div className="progress-bar" style={{ height: '12px' }}>
            <div 
              className="progress-fill" 
              style={{ 
                width: `${Math.min(budgetPercentUsed, 100)}%`,
                background: budgetPercentUsed > 100 ? 'var(--danger)' : budgetPercentUsed > 80 ? 'var(--warning)' : 'var(--success)'
              }} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-value">${totalExpenses.toFixed(2)}</div>
          <div className="stat-label">Total Spent</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
          <div className="stat-value">{expenses.length}</div>
          <div className="stat-label">Transactions</div>
        </div>
        <div className="stat-card" style={{ background: remainingBudget >= 0 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
          <div className="stat-value">${Math.abs(remainingBudget).toFixed(2)}</div>
          <div className="stat-label">{remainingBudget >= 0 ? 'Left to Spend' : 'Over Budget'}</div>
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

      {/* Budget Settings Modal */}
      {showBudgetModal && (
        <div className="modal-overlay" onClick={() => setShowBudgetModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Budget Settings</h3>
              <button className="modal-close" onClick={() => setShowBudgetModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Income *</label>
              <input 
                type="number" 
                step="0.01" 
                className="input" 
                value={budgetInputs.income}
                onChange={e => setBudgetInputs({ ...budgetInputs, income: e.target.value })} 
                placeholder="Enter your monthly income"
                onFocus={e => e.target.select()}
              />
              <div style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '4px' }}>
                Your total monthly income (salary, side income, etc.)
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Budget *</label>
              <input 
                type="number" 
                step="0.01" 
                className="input" 
                value={budgetInputs.budget}
                onChange={e => setBudgetInputs({ ...budgetInputs, budget: e.target.value })} 
                placeholder="Enter your monthly budget"
                onFocus={e => e.target.select()}
              />
              <div style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '4px' }}>
                How much you plan to spend each month
              </div>
            </div>
            <div style={{ 
              padding: '12px', 
              background: 'rgba(59, 130, 246, 0.1)', 
              borderRadius: 'var(--radius)',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Quick Calculation:</div>
              <div style={{ fontSize: '14px' }}>Income: ${(parseFloat(budgetInputs.income) || 0).toFixed(2)}</div>
              <div style={{ fontSize: '14px' }}>Budget: ${(parseFloat(budgetInputs.budget) || 0).toFixed(2)}</div>
              <div style={{ fontSize: '14px' }}>Savings Goal: ${((parseFloat(budgetInputs.income) || 0) - (parseFloat(budgetInputs.budget) || 0)).toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowBudgetModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveBudgetSettings}>Save Budget</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
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
                onChange={e => setNewExpense({ ...newExpense, amount: e.target.value === '' ? 0 : parseFloat(e.target.value) })} />
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

