import { useState, useEffect } from 'react';
import {
  LayoutDashboard, CheckSquare, Calendar, ShoppingCart, DollarSign,
  FileText, Home as HomeIcon, UtensilsCrossed, BookOpen, Users,
  Briefcase, FolderOpen, Phone, Wrench, Shield, Dog, Leaf,
  Cloud, StickyNote, Car, CreditCard, Lock, UserPlus,
  Zap, Smartphone, Package, Repeat, Target, Bell, LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../store';
import { logout } from '../utils/auth';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'shopping', label: 'Shopping Lists', icon: ShoppingCart },
  { id: 'budget', label: 'Budget Tracker', icon: DollarSign },
  { id: 'bills', label: 'Bill Reminders', icon: FileText },
  { id: 'inventory', label: 'Home Inventory', icon: HomeIcon },
  { id: 'meals', label: 'Meal Planning', icon: UtensilsCrossed },
  { id: 'recipes', label: 'Recipes', icon: BookOpen },
  { id: 'family', label: 'Family Members', icon: Users },
  { id: 'chores', label: 'Chore Assignment', icon: Briefcase },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'contacts', label: 'Emergency Contacts', icon: Phone },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'warranties', label: 'Warranties', icon: Shield },
  { id: 'pets', label: 'Pet Management', icon: Dog },
  { id: 'plants', label: 'Plant Care', icon: Leaf },
  { id: 'quicklinks', label: 'Quick Links', icon: Cloud },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'vehicles', label: 'Vehicles', icon: Car },
  { id: 'insurance', label: 'Insurance', icon: CreditCard },
  { id: 'passwords', label: 'Password Manager', icon: Lock },
  { id: 'guests', label: 'Guest Management', icon: UserPlus },
  { id: 'energy', label: 'Energy Tracking', icon: Zap },
  { id: 'devices', label: 'Smart Devices', icon: Smartphone },
  { id: 'packages', label: 'Package Tracking', icon: Package },
  { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export const Sidebar = () => {
  const { user } = useStore();
  const location = useLocation();
  const currentPath = location.pathname.substring(1) || 'dashboard';
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    const fetchUnreadCount = async () => {
      try {
        const q = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid),
          where('read', '==', false)
        );
        const snapshot = await getDocs(q);
        setUnreadCount(snapshot.size);
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };
    
    fetchUnreadCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user, currentPath]); // Refresh when navigating

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div style={{
      width: '280px',
      height: '100vh',
      background: 'var(--dark)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowY: 'auto'
    }}>
      <div style={{
        padding: '24px',
        borderBottom: '1px solid var(--dark-light)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <HomeIcon size={24} />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '18px' }}>HomeFlow Pro</div>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>Bradley Virtual Solutions</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 0' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.id;
          
          return (
            <Link
              key={item.id}
              to={`/${item.id}`}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: 'white',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                transition: 'all 0.2s',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon size={18} />
              {item.label}
              {item.id === 'notifications' && unreadCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'var(--danger)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid var(--dark-light)'
      }}>
        <button
          onClick={handleLogout}
          className="btn btn-danger"
          style={{ width: '100%' }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

