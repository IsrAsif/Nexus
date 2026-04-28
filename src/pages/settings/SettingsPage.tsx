import React, { useState } from 'react';
import { User, Lock, Bell, Globe, Palette, Wallet, ShieldCheck, Smartphone, Eye, EyeOff, CheckCircle2, AlertTriangle, Check } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

type Tab = 'profile' | 'security' | 'notifications' | 'appearance' | 'billing';

const getStrength = (pw: string) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const sColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];
const sLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');

  // Profile state
  const [fullName, setFullName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState('San Francisco, CA');

  // Security state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [sessions] = useState([
    { id: '1', device: 'Chrome on macOS', location: 'San Francisco, CA', lastActive: 'Active now', current: true },
    { id: '2', device: 'Safari on iPhone', location: 'San Jose, CA', lastActive: '2 hours ago', current: false },
    { id: '3', device: 'Firefox on Windows', location: 'New York, NY', lastActive: '3 days ago', current: false },
  ]);

  // Notification state
  const [notifs, setNotifs] = useState({
    emailInvestor: true, emailMessage: true, emailDeal: true,
    pushAll: false, smsUrgent: true,
  });

  if (!user) return null;

  const tabs = [
    { id: 'profile' as Tab, icon: <User size={17} />, label: 'Profile' },
    { id: 'security' as Tab, icon: <Lock size={17} />, label: 'Security' },
    { id: 'notifications' as Tab, icon: <Bell size={17} />, label: 'Notifications' },
    { id: 'appearance' as Tab, icon: <Palette size={17} />, label: 'Appearance' },
    { id: 'billing' as Tab, icon: <Wallet size={17} />, label: 'Billing' },
  ];

  const handleSaveProfile = () => toast.success('Profile saved!');
  const handlePasswordChange = () => {
    if (!currentPw) { toast.error('Enter your current password'); return; }
    if (newPw !== confirmPw) { toast.error('New passwords do not match'); return; }
    if (getStrength(newPw) < 2) { toast.error('Choose a stronger password'); return; }
    toast.success('Password updated successfully!');
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
  };
  const handle2FAToggle = () => {
    if (!twoFAEnabled) { setShow2FASetup(true); }
    else { setTwoFAEnabled(false); toast.success('2FA disabled'); }
  };
  const handleVerify2FA = () => {
    if (otpCode.length < 6) { toast.error('Enter 6-digit code'); return; }
    setTwoFAEnabled(true); setShow2FASetup(false); setOtpCode('');
    toast.success('Two-factor authentication enabled!');
  };

  const pwStrength = getStrength(newPw);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <Card className="lg:col-span-1 h-fit">
          <CardBody className="p-2">
            <nav className="space-y-1">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors gap-3 ${
                    tab === t.id ? 'text-primary-700 bg-primary-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}>
                  {t.icon} {t.label}
                  {t.id === 'security' && !twoFAEnabled && (
                    <span className="ml-auto w-2 h-2 bg-yellow-400 rounded-full" title="2FA not enabled" />
                  )}
                </button>
              ))}
            </nav>
          </CardBody>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">

          {/* PROFILE TAB */}
          {tab === 'profile' && (
            <Card>
              <CardHeader><h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2></CardHeader>
              <CardBody className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar src={user.avatarUrl} alt={user.name} size="xl" />
                  <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="mt-1 text-xs text-gray-500">JPG, GIF or PNG. Max size 800KB</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} fullWidth />
                  <Input label="Email" type="email" defaultValue={user.email} fullWidth />
                  <Input label="Role" value={user.role} disabled fullWidth />
                  <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} fullWidth />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={4} value={bio} onChange={e => setBio(e.target.value)} />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* SECURITY TAB */}
          {tab === 'security' && (
            <>
              {/* 2FA Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security. When enabled, you'll need your password <em>and</em> a one-time code to sign in.
                      </p>
                      <div className="mt-2">
                        {twoFAEnabled
                          ? <Badge variant="success"><CheckCircle2 size={12} className="mr-1" />Enabled</Badge>
                          : <Badge variant="warning"><AlertTriangle size={12} className="mr-1" />Not Enabled</Badge>}
                      </div>
                    </div>
                    <button
                      onClick={handle2FAToggle}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${twoFAEnabled ? 'bg-primary-600' : 'bg-gray-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${twoFAEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* 2FA Setup flow */}
                  {show2FASetup && (
                    <div className="border border-primary-100 bg-primary-50 rounded-xl p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <Smartphone size={18} className="text-primary-600" />
                        <h3 className="font-semibold text-gray-800">Set up authenticator app</h3>
                      </div>
                      <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                        <li>Download Google Authenticator or Authy on your phone</li>
                        <li>Scan the QR code below (simulated)</li>
                        <li>Enter the 6-digit code to verify</li>
                      </ol>
                      {/* Fake QR code */}
                      <div className="flex justify-center">
                        <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg p-2 grid grid-cols-8 gap-px">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'}`} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter verification code</label>
                        <div className="flex gap-2">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <input key={i} type="text" maxLength={1}
                              value={otpCode[i] || ''}
                              onChange={e => {
                                const arr = otpCode.padEnd(6, ' ').split('');
                                arr[i] = e.target.value.replace(/\D/, '');
                                setOtpCode(arr.join('').trimEnd());
                                if (e.target.value && i < 5) {
                                  const next = (e.target as HTMLElement).parentElement?.children[i + 1] as HTMLInputElement;
                                  next?.focus();
                                }
                              }}
                              className="w-10 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setShow2FASetup(false)}>Cancel</Button>
                        <Button onClick={handleVerify2FA} leftIcon={<ShieldCheck size={16} />}>Verify & Enable</Button>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader><h2 className="text-lg font-semibold text-gray-900">Change Password</h2></CardHeader>
                <CardBody className="space-y-4">
                  <Input label="Current Password" type={showCurrent ? 'text' : 'password'} value={currentPw}
                    onChange={e => setCurrentPw(e.target.value)} fullWidth
                    endAdornment={
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)}>
                        {showCurrent ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                      </button>
                    } />
                  <div>
                    <Input label="New Password" type={showNew ? 'text' : 'password'} value={newPw}
                      onChange={e => setNewPw(e.target.value)} fullWidth
                      endAdornment={
                        <button type="button" onClick={() => setShowNew(!showNew)}>
                          {showNew ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                        </button>
                      } />
                    {newPw && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= pwStrength ? sColor[pwStrength] : 'bg-gray-200'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{sLabel[pwStrength]} password</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Input label="Confirm New Password" type="password" value={confirmPw}
                      onChange={e => setConfirmPw(e.target.value)} fullWidth />
                    {confirmPw && (
                      <p className={`text-xs mt-1 ${confirmPw === newPw ? 'text-green-600' : 'text-red-500'}`}>
                        {confirmPw === newPw ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handlePasswordChange}>Update Password</Button>
                  </div>
                </CardBody>
              </Card>

              {/* Active Sessions */}
              <Card>
                <CardHeader><h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2></CardHeader>
                <CardBody className="space-y-3">
                  {sessions.map(s => (
                    <div key={s.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                          {s.device}
                          {s.current && <Badge variant="success" size="sm"><Check size={10} className="mr-1" />Current</Badge>}
                        </p>
                        <p className="text-xs text-gray-500">{s.location} · {s.lastActive}</p>
                      </div>
                      {!s.current && (
                        <button onClick={() => toast.success('Session revoked')}
                          className="text-xs text-red-500 hover:text-red-700 font-medium">
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => toast.success('All other sessions signed out')}>
                    Sign out all other sessions
                  </Button>
                </CardBody>
              </Card>
            </>
          )}

          {/* NOTIFICATIONS TAB */}
          {tab === 'notifications' && (
            <Card>
              <CardHeader><h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2></CardHeader>
              <CardBody className="space-y-6">
                {[
                  { key: 'emailInvestor', label: 'Investor interest', desc: 'When an investor views or requests collaboration' },
                  { key: 'emailMessage', label: 'New messages', desc: 'When you receive a new chat message' },
                  { key: 'emailDeal', label: 'Deal updates', desc: 'Status changes on active deals or funding' },
                  { key: 'pushAll', label: 'Push notifications', desc: 'Browser push for all activity' },
                  { key: 'smsUrgent', label: 'SMS for urgent alerts', desc: 'Critical security or deal alerts via SMS' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${notifs[key as keyof typeof notifs] ? 'bg-primary-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${notifs[key as keyof typeof notifs] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button onClick={() => toast.success('Notification preferences saved!')}>Save Preferences</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* APPEARANCE TAB */}
          {tab === 'appearance' && (
            <Card>
              <CardHeader><h2 className="text-lg font-semibold text-gray-900">Appearance</h2></CardHeader>
              <CardBody className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {['Light', 'Dark', 'System'].map(t => (
                      <button key={t}
                        onClick={() => toast.success(`${t} theme selected (coming soon)`)}
                        className={`py-3 px-4 border-2 rounded-xl text-sm font-medium transition-colors ${t === 'Light' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Accent Color</p>
                  <div className="flex gap-3">
                    {['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-orange-500', 'bg-rose-500'].map(c => (
                      <button key={c} onClick={() => toast.success('Color theme applied (coming soon)')}
                        className={`w-8 h-8 rounded-full ${c} ring-2 ring-offset-2 ring-transparent hover:ring-gray-400 transition-all`} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Sidebar Density</p>
                  <div className="grid grid-cols-2 gap-3">
                    {['Comfortable', 'Compact'].map(d => (
                      <button key={d} onClick={() => toast.success(`${d} density (coming soon)`)}
                        className={`py-2.5 px-4 border-2 rounded-lg text-sm font-medium ${d === 'Comfortable' ? 'border-primary-500 text-primary-700' : 'border-gray-200 text-gray-600'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* BILLING TAB */}
          {tab === 'billing' && (
            <Card>
              <CardHeader><h2 className="text-lg font-semibold text-gray-900">Billing & Plan</h2></CardHeader>
              <CardBody className="space-y-6">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-5 text-white">
                  <p className="text-primary-200 text-sm">Current Plan</p>
                  <h3 className="text-2xl font-bold mt-1">Pro Plan</h3>
                  <p className="text-primary-200 text-sm mt-1">Renews on May 1, 2026 · $49/month</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => toast.success('Upgrade flow coming soon')}>Upgrade Plan</Button>
                  <Button variant="outline" onClick={() => toast.success('Billing history coming soon')}>View Invoices</Button>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Payment Method</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Visa ending in 4892</p>
                      <p className="text-xs text-gray-500">Expires 08/2028</p>
                    </div>
                    <button onClick={() => toast.success('Card update coming soon')}
                      className="ml-auto text-xs text-primary-600 hover:text-primary-700 font-medium">
                      Update
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
