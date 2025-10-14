import { useState } from 'react';
import { login, register } from '../utils/auth';
import { Home } from 'lucide-react';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = isLogin 
      ? await login(email, password)
      : await register(email, password);

    if (result.error) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const loadTestCredentials = () => {
    setEmail('demo@homeflowpro.com');
    setPassword('HomeFlow2025!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Home size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            HomeFlow Pro
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: '14px' }}>
            by Bradley Virtual Solutions, LLC
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius)',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '12px' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>

          <button
            type="button"
            className="btn btn-outline"
            style={{ width: '100%', marginBottom: '12px' }}
            onClick={loadTestCredentials}
          >
            Load Test Credentials
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--gray)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(59, 130, 246, 0.05)',
          borderRadius: 'var(--radius)',
          fontSize: '12px',
          color: 'var(--gray)'
        }}>
          <strong>Test Account:</strong><br />
          Email: demo@homeflowpro.com<br />
          Password: HomeFlow2025!
        </div>
      </div>
    </div>
  );
};

