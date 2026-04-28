import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CircleDollarSign, Building2, LogIn, AlertCircle, ShieldCheck, Eye, EyeOff, Smartphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';

const getStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];

const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
  const strength = getStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className={`text-xs mt-1 ${strength <= 1 ? 'text-red-500' : strength === 2 ? 'text-yellow-600' : strength === 3 ? 'text-blue-600' : 'text-green-600'}`}>
        Password strength: {strengthLabel[strength]}
      </p>
    </div>
  );
};

const OTPInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const digits = value.padEnd(6, ' ').split('');
  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input key={i} type="text" maxLength={1}
          value={d === ' ' ? '' : d}
          onChange={e => {
            const raw = e.target.value.replace(/\D/, '');
            const arr = value.padEnd(6, ' ').split('');
            arr[i] = raw || ' ';
            onChange(arr.join('').trimEnd());
            if (raw && i < 5) {
              const next = (e.target as HTMLElement).parentElement?.children[i + 1] as HTMLInputElement;
              next?.focus();
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Backspace' && !digits[i].trim() && i > 0) {
              const prev = (e.target as HTMLElement).parentElement?.children[i - 1] as HTMLInputElement;
              prev?.focus();
            }
          }}
          className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:outline-none transition-colors bg-gray-50"
        />
      ))}
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);
    setStep('2fa');
  };

  const handleOtpSubmit = async () => {
    if (otp.replace(/\s/g, '').length < 6) { setError('Enter the 6-digit code'); return; }
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password, role);
      navigate(role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (userRole: UserRole) => {
    if (userRole === 'entrepreneur') {
      setEmail('sarah@techwave.io');
      setPassword('password123');
    } else {
      setEmail('michael@vcinnovate.com');
      setPassword('password123');
    }
    setRole(userRole);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 'credentials' ? 'Sign in to Business Nexus' : 'Two-Factor Authentication'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 'credentials' ? 'Connect with investors and entrepreneurs' : `Code sent to ${email}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {step === 'credentials' && (
            <>
              <form className="space-y-5" onSubmit={handleCredentialSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button"
                      className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${role === 'entrepreneur' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setRole('entrepreneur')}>
                      <Building2 size={18} className="mr-2" /> Entrepreneur
                    </button>
                    <button type="button"
                      className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${role === 'investor' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setRole('investor')}>
                      <CircleDollarSign size={18} className="mr-2" /> Investor
                    </button>
                  </div>
                </div>

                <Input label="Email address" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} required fullWidth
                  startAdornment={<User size={18} />} />

                <div>
                  <Input label="Password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} required fullWidth
                    endAdornment={
                      <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                      </button>
                    } />
                  <PasswordStrengthMeter password={password} />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-300 rounded" />
                    <span className="text-sm text-gray-900">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </a>
                </div>

                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <ShieldCheck size={16} className="text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-blue-700">2FA enabled — you'll receive an OTP code next.</p>
                </div>

                <Button type="submit" fullWidth isLoading={isLoading} leftIcon={<LogIn size={18} />}>
                  Continue
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => fillDemoCredentials('entrepreneur')} leftIcon={<Building2 size={16} />}>
                    Entrepreneur
                  </Button>
                  <Button variant="outline" onClick={() => fillDemoCredentials('investor')} leftIcon={<CircleDollarSign size={16} />}>
                    Investor
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">Sign up</Link>
                </p>
              </div>
            </>
          )}

          {step === '2fa' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <Smartphone size={32} className="text-primary-600" />
                </div>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code from your authenticator app or SMS.
                </p>
                <p className="text-xs text-gray-400 mt-1">(Demo: enter any 6 digits, e.g. 123456)</p>
              </div>

              <OTPInput value={otp} onChange={setOtp} />

              <Button onClick={handleOtpSubmit} isLoading={isLoading} fullWidth leftIcon={<ShieldCheck size={18} />}>
                Verify & Sign In
              </Button>

              <div className="text-center space-y-2">
                <button className="block w-full text-sm text-primary-600 hover:text-primary-500">
                  Resend code
                </button>
                <button onClick={() => { setStep('credentials'); setOtp(''); setError(null); }}
                  className="block w-full text-sm text-gray-500 hover:text-gray-700">
                  ← Back to login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
