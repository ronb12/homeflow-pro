import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
  const { user, setUser } = useStore();

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

  return (
    <BrowserRouter>
      {!user ? (
        <>
          <Login />
          <PWAInstall />
        </>
      ) : (
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
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/shopping" element={<Shopping />} />
                  <Route path="/budget" element={<Budget />} />
                  <Route path="/bills" element={<Bills />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/meals" element={<Meals />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/family" element={<Family />} />
                  <Route path="/chores" element={<Chores />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="/warranties" element={<Warranties />} />
                  <Route path="/pets" element={<Pets />} />
                  <Route path="/plants" element={<Plants />} />
                  <Route path="/weather" element={<Weather />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/insurance" element={<Insurance />} />
                  <Route path="/passwords" element={<Passwords />} />
                  <Route path="/guests" element={<Guests />} />
                  <Route path="/energy" element={<Energy />} />
                  <Route path="/devices" element={<Devices />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </main>
          </div>
          <PWAInstall />
        </>
      )}
    </BrowserRouter>
  );
};

export default App;

