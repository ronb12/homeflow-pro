import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckSquare, Calendar, ShoppingCart, DollarSign, TrendingUp, AlertCircle, Clock, CheckCircle, Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { requestNotificationPermission } from '../utils/pushNotifications';

export const Dashboard = () => {
  const { user } = useStore();
  const {
    checkBillDueNotifications,
    checkTaskDueNotifications,
    checkPasswordExpirationNotifications,
    checkPackageDeliveredNotifications,
    checkBudgetWarningNotifications
  } = useNotifications();
  
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    upcomingEvents: 0,
    unpaidBills: 0,
    monthlyExpenses: 0,
    activeGoals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // Request notification permission on first load
    const hasAskedPermission = localStorage.getItem('notification-permission-asked');
    if (!hasAskedPermission) {
      setTimeout(async () => {
        const granted = await requestNotificationPermission();
        localStorage.setItem('notification-permission-asked', 'true');
        if (granted) {
          console.log('✅ Browser notifications enabled');
        }
      }, 3000); // Ask after 3 seconds
    }
    
    const fetchStats = async () => {
      try {
        // Fetch tasks
        const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', user.uid));
        const tasksSnap = await getDocs(tasksQuery);
        const tasks = tasksSnap.docs.map(doc => doc.data());
        
        // Fetch events (show all events, not just future ones)
        const eventsQuery = query(
          collection(db, 'events'),
          where('userId', '==', user.uid),
          limit(10)
        );
        const eventsSnap = await getDocs(eventsQuery);
        
        // Fetch bills
        const billsQuery = query(
          collection(db, 'bills'),
          where('userId', '==', user.uid),
          where('paid', '==', false)
        );
        const billsSnap = await getDocs(billsQuery);
        
        // Fetch all expenses (show all, not just this month)
        const expensesQuery = query(
          collection(db, 'expenses'),
          where('userId', '==', user.uid)
        );
        const expensesSnap = await getDocs(expensesQuery);
        const expenses = expensesSnap.docs.map(doc => doc.data());
        const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0);
        
        // Fetch goals
        const goalsQuery = query(
          collection(db, 'goals'),
          where('userId', '==', user.uid),
          where('completed', '==', false)
        );
        const goalsSnap = await getDocs(goalsQuery);

        setStats({
          totalTasks: tasks.length,
          completedTasks: tasks.filter((t: any) => t.completed).length,
          upcomingEvents: eventsSnap.size,
          unpaidBills: billsSnap.size,
          monthlyExpenses: totalExpenses,
          activeGoals: goalsSnap.size,
        });
        
        // Auto-check and create notifications
        const bills = billsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const tasksData = tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Fetch passwords for expiration check
        const passwordsQuery = query(collection(db, 'passwords'), where('userId', '==', user.uid));
        const passwordsSnap = await getDocs(passwordsQuery);
        const passwords = passwordsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Fetch packages for delivery check
        const packagesQuery = query(collection(db, 'packages'), where('userId', '==', user.uid));
        const packagesSnap = await getDocs(packagesQuery);
        const packages = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Run notification checks (async in background)
        Promise.all([
          checkBillDueNotifications(user.uid, bills),
          checkTaskDueNotifications(user.uid, tasksData),
          checkPasswordExpirationNotifications(user.uid, passwords),
          checkPackageDeliveredNotifications(user.uid, packages),
        ]).catch(err => console.error('Error checking notifications:', err));
        
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, checkBillDueNotifications, checkTaskDueNotifications, checkPasswordExpirationNotifications, checkPackageDeliveredNotifications]);

  const expenseData = [
    { name: 'Food', value: 450 },
    { name: 'Bills', value: 800 },
    { name: 'Entertainment', value: 200 },
    { name: 'Transport', value: 300 },
    { name: 'Other', value: 250 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  const activityData = [
    { day: 'Mon', tasks: 12 },
    { day: 'Tue', tasks: 19 },
    { day: 'Wed', tasks: 15 },
    { day: 'Thu', tasks: 25 },
    { day: 'Fri', tasks: 22 },
    { day: 'Sat', tasks: 18 },
    { day: 'Sun', tasks: 10 },
  ];

  if (loading) {
    return (
      <div className="loading">
        <Clock className="spinner" size={32} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Welcome back! 👋
        </h1>
        <p style={{ color: 'var(--gray)' }}>
          Here's what's happening with your home today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div className="stat-value">{stats.completedTasks}/{stats.totalTasks}</div>
              <div className="stat-label">Tasks Completed</div>
            </div>
            <CheckSquare size={32} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div className="stat-value">{stats.upcomingEvents}</div>
              <div className="stat-label">Upcoming Events</div>
            </div>
            <Calendar size={32} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div className="stat-value">{stats.unpaidBills}</div>
              <div className="stat-label">Unpaid Bills</div>
            </div>
            <AlertCircle size={32} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div className="stat-value">${stats.monthlyExpenses.toFixed(0)}</div>
              <div className="stat-label">This Month</div>
            </div>
            <DollarSign size={32} style={{ opacity: 0.8 }} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-2" style={{ marginBottom: '32px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={20} />
              Weekly Activity
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <DollarSign size={20} />
              Expense Breakdown
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Stats</h3>
        </div>
        <div className="grid grid-3">
          <div style={{
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.05)',
            borderRadius: 'var(--radius)',
            textAlign: 'center'
          }}>
            <CheckCircle size={32} color="var(--success)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
              {stats.activeGoals}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Active Goals</div>
          </div>
          
          <div style={{
            padding: '16px',
            background: 'rgba(139, 92, 246, 0.05)',
            borderRadius: 'var(--radius)',
            textAlign: 'center'
          }}>
            <ShoppingCart size={32} color="var(--secondary)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
              24
            </div>
            <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Shopping Items</div>
          </div>
          
          <div style={{
            padding: '16px',
            background: 'rgba(16, 185, 129, 0.05)',
            borderRadius: 'var(--radius)',
            textAlign: 'center'
          }}>
            <TrendingUp size={32} color="var(--success)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
              95%
            </div>
            <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Task Completion</div>
          </div>
        </div>
      </div>

      {/* Recent Notifications Widget */}
      <RecentNotificationsWidget />
    </div>
  );
};

// Recent Notifications Widget Component
const RecentNotificationsWidget = () => {
  const { user } = useStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchRecentNotifications = async () => {
      try {
        const q = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid),
          where('read', '==', false)
        );
        const snapshot = await getDocs(q);
        let notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort by priority and date
        notifs.sort((a: any, b: any) => {
          const priorityOrder = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          if (aPriority !== bPriority) return bPriority - aPriority;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(notifs.slice(0, 5)); // Show top 5
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchRecentNotifications();
  }, [user]);
  
  if (notifications.length === 0) return null;
  
  const typeEmojis: Record<string, string> = {
    bill: '💵',
    task: '📋',
    package: '📦',
    password: '🔐',
    budget: '💰',
    general: '🔔'
  };
  
  return (
    <div className="card" style={{ marginTop: '32px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={20} />
          Recent Alerts
          <span style={{ 
            fontSize: '12px', 
            background: 'var(--danger)', 
            color: 'white',
            padding: '2px 8px',
            borderRadius: '10px',
            fontWeight: '600'
          }}>
            {notifications.length}
          </span>
        </h3>
        <Link 
          to="/notifications"
          style={{
            fontSize: '14px',
            color: 'var(--primary)',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          View All →
        </Link>
      </div>
      
      {notifications.map(notif => {
        const priorityColor = 
          notif.priority === 'Urgent' ? 'var(--danger)' :
          notif.priority === 'High' ? '#f59e0b' :
          notif.priority === 'Medium' ? 'var(--primary)' :
          'var(--gray)';
        
        return (
          <div 
            key={notif.id}
            style={{
              padding: '12px',
              borderLeft: `4px solid ${priorityColor}`,
              background: 'rgba(59, 130, 246, 0.02)',
              borderRadius: '8px',
              marginBottom: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{typeEmojis[notif.type] || '🔔'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{notif.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--gray)' }}>{notif.message}</div>
                <div style={{ fontSize: '11px', color: priorityColor, fontWeight: '600', marginTop: '4px' }}>
                  {notif.priority} Priority
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

