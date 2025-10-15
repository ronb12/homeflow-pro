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
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [masterPasswordSet, setMasterPasswordSet] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, string>>({});
  const [showChangeMasterPassword, setShowChangeMasterPassword] = useState(false);
  const [oldMasterPassword, setOldMasterPassword] = useState('');
  const [newMasterPassword, setNewMasterPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    service: '',
    websiteUrl: '',
    username: '',
    password: '',
    notes: '',
    expiresAt: ''
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
          createdAt: new Date().toISOString(),
          expiresAt: formData.expiresAt || null
        });
      }
      
      setShowModal(false);
      setEditingEntry(null);
      setFormData({ service: '', websiteUrl: '', username: '', password: '', notes: '', expiresAt: '' });
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
      notes: entry.notes || '',
      expiresAt: entry.expiresAt || ''
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

  const calculatePasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score, label: 'Fair', color: '#f59e0b' };
    if (score <= 5) return { score, label: 'Good', color: '#3b82f6' };
    return { score, label: 'Strong', color: '#10b981' };
  };

  const changeMasterPassword = async () => {
    if (!oldMasterPassword || !newMasterPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (!verifyMasterPassword(oldMasterPassword)) {
      alert('Current master password is incorrect');
      return;
    }

    if (newMasterPassword.length < 6) {
      alert('New master password must be at least 6 characters');
      return;
    }

    try {
      const updatedEntries = entries.map(entry => {
        const decrypted = decryptPassword(entry.encryptedPassword);
        const reencrypted = CryptoJS.AES.encrypt(decrypted, newMasterPassword).toString();
        return { ...entry, encryptedPassword: reencrypted };
      });

      for (const entry of updatedEntries) {
        await updateDoc(doc(db, 'passwords', entry.id), {
          encryptedPassword: entry.encryptedPassword
        });
      }

      const hashed = CryptoJS.SHA256(newMasterPassword).toString();
      localStorage.setItem(`masterPassword_${user?.uid}`, hashed);
      setMasterPassword(newMasterPassword);

      setOldMasterPassword('');
      setNewMasterPassword('');
      setShowChangeMasterPassword(false);
      setShowOldPassword(false);
      setShowNewPassword(false);

      alert('Master password changed successfully!');
      fetchEntries();
    } catch (error) {
      console.error('Error changing master password:', error);
      alert('Error changing master password. Please try again.');
    }
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
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-outline" 
            onClick={() => setShowChangeMasterPassword(true)}
            title="Change Master Password"
          >
            <Lock size={18} />
            Change Master Password
          </button>
          <button 
            className="btn btn-outline" 
            onClick={() => {
              if (confirm('⚠️ WARNING: Resetting your master password will require you to delete all saved passwords.\n\nYou will need to set a new master password and re-add all passwords.\n\nContinue?')) {
                localStorage.removeItem(`masterPassword_${user?.uid}`);
                setMasterPasswordSet(false);
                setMasterPassword('');
                alert('Master password reset! You will now set up a new master password.');
                window.location.reload();
              }
            }}
            title="Forgot Master Password? Reset it"
            style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
          >
            Reset Master Password
          </button>
          <button className="btn btn-primary" onClick={() => {
            setEditingEntry(null);
            setFormData({ service: '', websiteUrl: '', username: '', password: '', notes: '', expiresAt: '' });
            setShowModal(true);
          }}>
            <Plus size={18} />
            Add Password
          </button>
        </div>
      </div>

      <div className="card">
        {entries.length === 0 ? (
          <div className="empty-state">
            <Lock size={64} />
            <p>No passwords saved yet</p>
            <p className="text-small text-muted">Click "Add Password" to save your first password</p>
          </div>
        ) : (
          entries.map(entry => {
            const isExpired = entry.expiresAt && new Date(entry.expiresAt) < new Date();
            const isExpiringSoon = entry.expiresAt && !isExpired && 
              new Date(entry.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            
            return (
            <div key={entry.id} className="list-item">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {entry.service}
                  {isExpired && (
                    <span style={{ 
                      fontSize: '11px', 
                      padding: '2px 8px', 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      color: '#ef4444',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      ⚠️ EXPIRED
                    </span>
                  )}
                  {isExpiringSoon && (
                    <span style={{ 
                      fontSize: '11px', 
                      padding: '2px 8px', 
                      background: 'rgba(234, 179, 8, 0.1)', 
                      color: '#ca8a04',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      ⏰ EXPIRES SOON
                    </span>
                  )}
                </div>
                <div className="text-small text-muted" style={{ marginBottom: '4px' }}>
                  Username: {entry.username}
                </div>
                {entry.expiresAt && (
                  <div className="text-small" style={{ marginBottom: '4px', color: isExpired ? '#ef4444' : isExpiringSoon ? '#ca8a04' : 'var(--gray)' }}>
                    📅 Expires: {new Date(entry.expiresAt).toLocaleDateString()}
                  </div>
                )}
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
            );
          })
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
                setFormData({ service: '', websiteUrl: '', username: '', password: '', notes: '', expiresAt: '' });
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
              {formData.password && (() => {
                const strength = calculatePasswordStrength(formData.password);
                return (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${(strength.score / 6) * 100}%`, 
                        height: '100%', 
                        background: strength.color,
                        transition: 'all 0.3s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                );
              })()}
              <div style={{ fontSize: '13px', color: 'var(--primary)', marginTop: '6px', background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '4px' }}>
                💡 <strong>You can create your own password</strong> or click the 🔄 button to generate a strong one
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password Expiration (Optional)</label>
              <input
                type="date"
                className="input"
                value={formData.expiresAt}
                onChange={e => setFormData({ ...formData, expiresAt: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
              <div style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '4px' }}>
                📅 Get reminded when it's time to change this password
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
                setFormData({ service: '', websiteUrl: '', username: '', password: '', notes: '', expiresAt: '' });
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

      {showChangeMasterPassword && (
        <div className="modal-overlay" onClick={() => setShowChangeMasterPassword(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Change Master Password</h3>
              <button className="modal-close" onClick={() => setShowChangeMasterPassword(false)}>×</button>
            </div>

            <div style={{ 
              padding: '12px', 
              background: 'rgba(234, 179, 8, 0.1)', 
              color: '#ca8a04',
              borderRadius: 'var(--radius)',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              ⚠️ Warning: All your saved passwords will be re-encrypted with the new master password.
            </div>

            <div className="form-group">
              <label className="form-label">Current Master Password *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type={showOldPassword ? "text" : "password"}
                  className="input"
                  value={oldMasterPassword}
                  onChange={e => setOldMasterPassword(e.target.value)}
                  placeholder="Enter current master password"
                  style={{ flex: 1 }}
                />
                <button
                  className="btn btn-outline"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  title={showOldPassword ? "Hide password" : "Show password"}
                  type="button"
                >
                  {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">New Master Password * (min 6 characters)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="input"
                  value={newMasterPassword}
                  onChange={e => setNewMasterPassword(e.target.value)}
                  placeholder="Enter new master password"
                  style={{ flex: 1 }}
                />
                <button
                  className="btn btn-outline"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  title={showNewPassword ? "Hide password" : "Show password"}
                  type="button"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => {
                  setShowChangeMasterPassword(false);
                  setOldMasterPassword('');
                  setNewMasterPassword('');
                  setShowOldPassword(false);
                  setShowNewPassword(false);
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={changeMasterPassword}
                disabled={!oldMasterPassword || !newMasterPassword}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
