import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useStore } from './store';
import { formatUser } from './utils/auth';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { PWAInstall } from './components/PWAInstall';
import { Dashboard, Tasks, Calendar, Shopping, Budget, Bills } from './components/FeaturesList';
import { Inventory, Meals, Recipes, Family, Chores, Documents, Contacts, Maintenance, Warranties, Pets, Plants, Weather, Notes, Vehicles, Insurance, Passwords, Guests, Energy, Devices, Packages, Subscriptions, Goals, Notifications } from './components/AllFeatures';

const App = () => {
  const { user, setUser, currentView } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(formatUser(firebaseUser));
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  if (!user) {
    return (
      <>
        <Login />
        <PWAInstall />
      </>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <Tasks />;
      case 'calendar': return <Calendar />;
      case 'shopping': return <Shopping />;
      case 'budget': return <Budget />;
      case 'bills': return <Bills />;
      case 'inventory': return <Inventory />;
      case 'meals': return <Meals />;
      case 'recipes': return <Recipes />;
      case 'family': return <Family />;
      case 'chores': return <Chores />;
      case 'documents': return <Documents />;
      case 'contacts': return <Contacts />;
      case 'maintenance': return <Maintenance />;
      case 'warranties': return <Warranties />;
      case 'pets': return <Pets />;
      case 'plants': return <Plants />;
      case 'weather': return <Weather />;
      case 'notes': return <Notes />;
      case 'vehicles': return <Vehicles />;
      case 'insurance': return <Insurance />;
      case 'passwords': return <Passwords />;
      case 'guests': return <Guests />;
      case 'energy': return <Energy />;
      case 'devices': return <Devices />;
      case 'packages': return <Packages />;
      case 'subscriptions': return <Subscriptions />;
      case 'goals': return <Goals />;
      case 'notifications': return <Notifications />;
      default: return <Dashboard />;
    }
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{
          marginLeft: '280px',
          flex: 1,
          padding: '32px',
          minHeight: '100vh',
          background: 'var(--light)'
        }}>
          <div className="container">
            {renderView()}
          </div>
        </main>
      </div>
      <PWAInstall />
    </>
  );
};

export default App;

