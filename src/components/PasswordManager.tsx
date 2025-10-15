import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../store';
import { Plus, Lock, Trash2, Eye, EyeOff, Copy, RefreshCw, Edit2, ExternalLink } from 'lucide-react';
import CryptoJS from 'crypto-js';

interface PasswordEntry {
  id: string;
  userId: string;
  service: string;
  websiteUrl?: string;
  username: string;
  encryptedPassword: string;
  notes?: string;
  createdAt: string;
  expiresAt?: string;
}

export const PasswordManager = () => {
  const { user } = useStore();
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [masterPasswordSet, setMasterPasswordSet] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    service: '',
    websiteUrl: '',
    username: '',
    password: '',
    notes: ''
  });

  useEffect(() => {
    if (!user) return;
    fetchEntries();
    checkMasterPassword();
  }, [user]);

  const checkMasterPassword = () => {
    const stored = localStorage.getItem(`masterPassword_${user?.uid}`);
    setMasterPasswordSet(!!stored);
  };

  const setupMasterPassword = () => {
    if (!masterPassword || masterPassword.length < 6) {
      alert('Master password must be at least 6 characters');
      return;
    }
    const hashed = CryptoJS.SHA256(masterPassword).toString();
    localStorage.setItem(`masterPassword_${user?.uid}`, hashed);
    setMasterPasswordSet(true);
    alert('✅ Master password set successfully! Write it down in a safe place.');
  };

  const verifyMasterPassword = (password: string): boolean => {
    const stored = localStorage.getItem(`masterPassword_${user?.uid}`);
    const hashed = CryptoJS.SHA256(password).toString();
    return stored === hashed;
  };

  const encryptPassword = (password: string): string => {
    return CryptoJS.AES.encrypt(password, masterPassword).toString();
  };

  const decryptPassword = (encrypted: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, masterPassword);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return 'Error decrypting';
    }
  };

  const fetchEntries = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'passwords'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PasswordEntry[]);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };

  const saveEntry = async () => {
    if (!user || !formData.service || !formData.password) return;
    if (!masterPasswordSet) {
      alert('Please set up a master password first');
      return;
    }

    const encrypted = encryptPassword(formData.password);
    
    try {
      if (editingEntry) {
        await updateDoc(doc(db, 'passwords', editingEntry.id), {
          service: formData.service,
          websiteUrl: formData.websiteUrl,
          username: formData.username,
          encryptedPassword: encrypted,
          notes: formData.notes
        });
      } else {
        await addDoc(collection(db, 'passwords'), {
          userId: user.uid,
          service: formData.service,
          websiteUrl: formData.websiteUrl,
          username: formData.username,
          encryptedPassword: encrypted,
          notes: formData.notes,
          createdAt: new Date().toISOString()
        });
      }
      
      const password = prompt('Enter master password to save:');
      if (!password || !verifyMasterPassword(password)) {
        alert('Incorrect master password');
        return;
      }
      setMasterPassword(password);
      
      setShowModal(false);
      setEditingEntry(null);
      setFormData({ service: '', websiteUrl: '', username: '', password: '', notes: '' });
      fetchEntries();
    } catch (error) {
      console.error('Error saving password:', error);
      alert('Error saving password');
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('Delete this password?')) return;
    await deleteDoc(doc(db, 'passwords', id));
    fetchEntries();
  };

  const editEntry = (entry: PasswordEntry) => {
    const password = prompt('Enter master password to edit:');
    if (!password || !verifyMasterPassword(password)) {
      alert('Incorrect master password');
      return;
    }
    
    const decrypted = decryptPassword(entry.encryptedPassword);
    setMasterPassword(password); // Store for encryption
    setEditingEntry(entry);
    setFormData({
      service: entry.service,
      websiteUrl: entry.websiteUrl || '',
      username: entry.username,
      password: decrypted,
      notes: entry.notes || ''
    });
    setShowModal(true);
  };

  const revealPassword = (entry: PasswordEntry) => {
    if (revealedPasswords[entry.id]) {
      const newRevealed = { ...revealedPasswords };
      delete newRevealed[entry.id];
      setRevealedPasswords(newRevealed);
      return;
    }

    const password = prompt('Enter master password to reveal:');
    if (!password || !verifyMasterPassword(password)) {
      alert('Incorrect master password');
      return;
    }

    setMasterPassword(password); // Store for decryption
    const decrypted = decryptPassword(entry.encryptedPassword);
    setRevealedPasswords({ ...revealedPasswords, [entry.id]: decrypted });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('✅ Password copied to clipboard!');
  };

  const generatePassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password });
  };

  if (!masterPasswordSet) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '40px' }}>
        <Lock size={64} style={{ color: 'var(--primary)', margin: '0 auto 24px' }} />
        <h2 style={{ marginBottom: '16px', fontSize: '24px' }}>Set Up Master Password</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '24px', fontSize: '14px' }}>
          Create a master password to encrypt and protect all your passwords. 
          You'll need this to view or edit any saved passwords.
        </p>
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '16px' }}>Master Password (min 6 characters)</label>
          <input
            type="text"
            className="input"
            value={masterPassword}
            onChange={e => setMasterPassword(e.target.value)}
            placeholder="Enter a master password you can remember"
            onKeyPress={e => e.key === 'Enter' && setupMasterPassword()}
            style={{ fontSize: '20px', fontFamily: 'monospace', textAlign: 'center', padding: '16px' }}
          />
          <div style={{ fontSize: '14px', color: 'var(--primary)', marginTop: '8px', textAlign: 'left' }}>
            💡 <strong>Tip:</strong> Use something memorable like:
            <div style={{ fontFamily: 'monospace', marginTop: '8px', padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '4px' }}>
              • MyDog2024!<br/>
              • BlueCar#Home<br/>
              • Summer!Garden99
            </div>
          </div>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={setupMasterPassword}
          style={{ width: '100%', fontSize: '16px', padding: '12px' }}
        >
          Set Master Password
        </button>
        <div style={{ marginTop: '24px', fontSize: '14px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', textAlign: 'left' }}>
          <div style={{ fontWeight: '700', color: 'var(--danger)', marginBottom: '8px', fontSize: '16px' }}>
            ⚠️ IMPORTANT: Write This Down!
          </div>
          <div style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: '1.6' }}>
            • Write your master password on paper<br/>
            • Keep it in a safe place (wallet, safe, etc.)<br/>
            • <strong>DO NOT</strong> save it on your computer<br/>
            • If you forget it, you <strong>CANNOT</strong> recover your passwords
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <h2 className="card-title">
          <Lock size={24} />
          Password Manager
          <span style={{ fontSize: '12px', color: 'var(--success)', marginLeft: '12px', padding: '4px 8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px' }}>
            🔒 AES-256 Encrypted
          </span>
        </h2>
        <button className="btn btn-primary" onClick={() => {
          setEditingEntry(null);
          setFormData({ service: '', websiteUrl: '', username: '', password: '', notes: '' });
          setShowModal(true);
        }}>
          <Plus size={18} />
          Add Password
        </button>
      </div>

      <div className="card">
        {entries.length === 0 ? (
          <div className="empty-state">
            <Lock size={64} />
            <p>No passwords saved yet</p>
            <p className="text-small text-muted">Click "Add Password" to save your first password</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="list-item">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{entry.service}</div>
                <div className="text-small text-muted" style={{ marginBottom: '4px' }}>
                  Username: {entry.username}
                </div>
                <div className="text-small" style={{ marginBottom: '8px' }}>
                  Password: {revealedPasswords[entry.id] ? (
                    <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontSize: '14px', fontWeight: '600' }}>
                      {revealedPasswords[entry.id]}
                    </span>
                  ) : (
                    <span style={{ fontSize: '16px' }}>••••••••••••</span>
                  )}
                </div>
                {entry.websiteUrl && (
                  <a 
                    href={entry.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-small"
                    style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ExternalLink size={12} />
                    Open Website
                  </a>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => revealPassword(entry)}
                  title={revealedPasswords[entry.id] ? 'Hide password' : 'Reveal password (requires master password)'}
                >
                  {revealedPasswords[entry.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {revealedPasswords[entry.id] && (
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => copyToClipboard(revealedPasswords[entry.id])}
                    title="Copy password to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => editEntry(entry)}
                  title="Edit (requires master password)"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteEntry(entry.id)}
                  title="Delete password"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingEntry ? 'Edit' : 'Add'} Password</h3>
              <button className="modal-close" onClick={() => {
                setShowModal(false);
                setEditingEntry(null);
                setFormData({ service: '', websiteUrl: '', username: '', password: '', notes: '' });
              }}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Service/Website *</label>
              <input
                type="text"
                className="input"
                value={formData.service}
                onChange={e => setFormData({ ...formData, service: e.target.value })}
                placeholder="e.g., Gmail, Netflix, Amazon"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Website URL (optional)</label>
              <input
                type="text"
                className="input"
                value={formData.websiteUrl}
                onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://www.example.com/login"
              />
              <div style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '4px' }}>
                💡 Add the login page URL for quick access
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Username/Email *</label>
              <input
                type="text"
                className="input"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                placeholder="username or email@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="input"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Type your own password or click generate →"
                  style={{ flex: 1, fontFamily: 'monospace', fontSize: '14px' }}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={generatePassword}
                  title="Generate strong password"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--primary)', marginTop: '6px', background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '4px' }}>
                💡 <strong>You can create your own password</strong> or click the 🔄 button to generate a strong one
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <textarea
                className="textarea"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Security questions, backup codes, etc."
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn btn-outline" onClick={() => {
                setShowModal(false);
                setEditingEntry(null);
                setFormData({ service: '', websiteUrl: '', username: '', password: '', notes: '' });
              }}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={saveEntry}
                disabled={!formData.service || !formData.username || !formData.password}
              >
                {editingEntry ? 'Update' : 'Save'} Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
