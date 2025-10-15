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
import { Inventory, Meals, Recipes, Family, Chores, Documents, Contacts, Maintenance, Warranties, Pets, Plants, QuickLinks, Notes, Vehicles, Insurance, Guests, Energy, Devices, Packages, Subscriptions, Goals, Notifications } from './components/AllFeatures';
import { PasswordManager } from './components/PasswordManager';

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
      <Routes>
        {!user ? (
          <>
            <Route path="*" element={
              <>
                <Login />
                <PWAInstall />
              </>
            } />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Dashboard /></div>
                </main>
              </div>
            } />
            <Route path="/tasks" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Tasks /></div>
                </main>
              </div>
            } />
            <Route path="/calendar" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Calendar /></div>
                </main>
              </div>
            } />
            <Route path="/shopping" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Shopping /></div>
                </main>
              </div>
            } />
            <Route path="/budget" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Budget /></div>
                </main>
              </div>
            } />
            <Route path="/bills" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Bills /></div>
                </main>
              </div>
            } />
            <Route path="/inventory" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Inventory /></div>
                </main>
              </div>
            } />
            <Route path="/meals" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Meals /></div>
                </main>
              </div>
            } />
            <Route path="/recipes" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Recipes /></div>
                </main>
              </div>
            } />
            <Route path="/family" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Family /></div>
                </main>
              </div>
            } />
            <Route path="/chores" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Chores /></div>
                </main>
              </div>
            } />
            <Route path="/documents" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Documents /></div>
                </main>
              </div>
            } />
            <Route path="/contacts" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Contacts /></div>
                </main>
              </div>
            } />
            <Route path="/maintenance" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Maintenance /></div>
                </main>
              </div>
            } />
            <Route path="/warranties" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Warranties /></div>
                </main>
              </div>
            } />
            <Route path="/pets" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Pets /></div>
                </main>
              </div>
            } />
            <Route path="/plants" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Plants /></div>
                </main>
              </div>
            } />
            <Route path="/quicklinks" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><QuickLinks /></div>
                </main>
              </div>
            } />
            <Route path="/notes" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Notes /></div>
                </main>
              </div>
            } />
            <Route path="/vehicles" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Vehicles /></div>
                </main>
              </div>
            } />
            <Route path="/insurance" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Insurance /></div>
                </main>
              </div>
            } />
            <Route path="/passwords" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><PasswordManager /></div>
                </main>
              </div>
            } />
            <Route path="/guests" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Guests /></div>
                </main>
              </div>
            } />
            <Route path="/energy" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Energy /></div>
                </main>
              </div>
            } />
            <Route path="/devices" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Devices /></div>
                </main>
              </div>
            } />
            <Route path="/packages" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Packages /></div>
                </main>
              </div>
            } />
            <Route path="/subscriptions" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Subscriptions /></div>
                </main>
              </div>
            } />
            <Route path="/goals" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Goals /></div>
                </main>
              </div>
            } />
            <Route path="/notifications" element={
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '280px', flex: 1, padding: '32px', minHeight: '100vh', background: 'var(--light)' }}>
                  <div className="container"><Notifications /></div>
                </main>
              </div>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
      <PWAInstall />
    </BrowserRouter>
  );
};

export default App;

