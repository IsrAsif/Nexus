import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, CheckCircle2, Wallet, ShieldCheck, Sparkles, Users, Video,
  FolderLock, CalendarDays, MessageCircle, FileText, Building2,
  CircleDollarSign, ArrowRight, Star, Zap, Globe, Lock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const features = [
  {
    week: 'Week 1',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    icon: <Building2 size={22} className="text-blue-600" />,
    title: 'Core Platform',
    items: ['Role-based dashboards (Investor & Entrepreneur)', 'User profiles & discovery', 'Chat & messaging', 'Meeting scheduler', 'Collaboration requests'],
  },
  {
    week: 'Week 2',
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    icon: <Video size={22} className="text-emerald-600" />,
    title: 'Collaboration Tools',
    items: ['HD Video calls with screen share', 'Document Chamber (NDA-gated)', 'e-Signature on documents', 'Kanban deal pipeline', 'Real-time notifications'],
  },
  {
    week: 'Week 3',
    color: 'from-purple-500 to-primary-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    icon: <Wallet size={22} className="text-purple-600" />,
    title: 'Payments & Security',
    items: ['Wallet with deposit/withdraw/transfer', 'Investor deal funding flow (3-step)', 'Transaction history & filters', 'Two-factor authentication (2FA)', 'Password strength meter & requirements', 'Guided onboarding tour'],
  },
];

const demoSteps = [
  { icon: <CircleDollarSign size={20} className="text-white" />, bg: 'bg-blue-500', title: 'Login as Investor', desc: 'Use demo credentials with 2FA OTP step', path: '/login' },
  { icon: <Users size={20} className="text-white" />, bg: 'bg-emerald-500', title: 'Discover Startups', desc: 'Browse and filter entrepreneur profiles', path: '/entrepreneurs' },
  { icon: <Wallet size={20} className="text-white" />, bg: 'bg-purple-500', title: 'Fund a Deal', desc: 'Use Payments to invest in a startup (3-step)', path: '/payments' },
  { icon: <Video size={20} className="text-white" />, bg: 'bg-orange-500', title: 'Launch Video Call', desc: 'Start a pitch meeting with an entrepreneur', path: '/videocall' },
  { icon: <FolderLock size={20} className="text-white" />, bg: 'bg-rose-500', title: 'Document Chamber', desc: 'Share NDA-protected pitch decks securely', path: '/chamber' },
  { icon: <ShieldCheck size={20} className="text-white" />, bg: 'bg-gray-700', title: 'Security Settings', desc: 'Enable 2FA and manage active sessions', path: '/settings' },
];

const stats = [
  { value: '3', label: 'Weeks Built', icon: <Zap size={20} className="text-yellow-500" /> },
  { value: '20+', label: 'Features', icon: <Star size={20} className="text-blue-500" /> },
  { value: '100%', label: 'TypeScript', icon: <Globe size={20} className="text-emerald-500" /> },
  { value: '0', label: 'TS Errors', icon: <CheckCircle2 size={20} className="text-green-500" /> },
  { value: '2FA', label: 'Security Ready', icon: <Lock size={20} className="text-purple-500" /> },
  { value: 'Live', label: 'Deployed', icon: <Sparkles size={20} className="text-pink-500" /> },
];

export const DemoPage: React.FC = () => {
  const [activeWeek, setActiveWeek] = useState(2);

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-purple-600 text-white p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
              <Sparkles size={12} /> Week 3 Complete
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Business Nexus
            <span className="block text-primary-200 mt-1">Demo Presentation</span>
          </h1>
          <p className="mt-4 text-primary-100 text-base leading-relaxed max-w-lg">
            A full-stack investor–entrepreneur matching platform. 3 weeks of builds — authentication, video calls, documents, payments, security & more.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/login">
              <button className="flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm shadow">
                <Play size={15} /> Start Demo
              </button>
            </Link>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-medium px-5 py-2.5 rounded-lg transition-colors text-sm">
                GitHub Repo
              </button>
            </a>
          </div>
        </div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -right-8 top-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute right-20 bottom-4 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardBody className="text-center py-4">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Feature timeline */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Feature Milestones</h2>
        <div className="flex gap-2 mb-5 flex-wrap">
          {features.map((f, i) => (
            <button key={i} onClick={() => setActiveWeek(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeWeek === i ? `bg-gradient-to-r ${f.color} text-white shadow-md` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f.week}: {f.title}
            </button>
          ))}
        </div>
        <Card className={`${features[activeWeek].bg} border ${features[activeWeek].border}`}>
          <CardBody>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-white rounded-lg shadow-sm">{features[activeWeek].icon}</div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{features[activeWeek].week}</p>
                <h3 className="text-lg font-bold text-gray-900">{features[activeWeek].title}</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {features[activeWeek].items.map((item, j) => (
                <div key={j} className="flex items-center gap-2 bg-white/70 rounded-lg px-3 py-2.5">
                  <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Demo walkthrough */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Demo Walkthrough</h2>
        <p className="text-gray-500 text-sm mb-5">Click any step to navigate directly to that feature.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoSteps.map((step, i) => (
            <Link key={i} to={step.path}>
              <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group h-full">
                <CardBody>
                  <div className="flex items-start gap-4">
                    <div className={`${step.bg} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-gray-400">STEP {i + 1}</span>
                      <h3 className="text-sm font-semibold text-gray-900 mt-0.5">{step.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors mt-1" />
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tech Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'React 18', desc: 'UI framework', color: 'text-blue-600', bg: 'bg-blue-50' },
            { name: 'TypeScript', desc: 'Type safety', color: 'text-blue-800', bg: 'bg-blue-100' },
            { name: 'Tailwind CSS', desc: 'Styling', color: 'text-cyan-700', bg: 'bg-cyan-50' },
            { name: 'React Router v6', desc: 'Navigation', color: 'text-red-600', bg: 'bg-red-50' },
            { name: 'Vite', desc: 'Build tool', color: 'text-purple-600', bg: 'bg-purple-50' },
            { name: 'Lucide Icons', desc: 'Icon library', color: 'text-gray-700', bg: 'bg-gray-100' },
            { name: 'Vercel', desc: 'Deployment', color: 'text-gray-900', bg: 'bg-gray-50' },
            { name: 'react-hot-toast', desc: 'Notifications', color: 'text-orange-700', bg: 'bg-orange-50' },
          ].map((t, i) => (
            <div key={i} className={`${t.bg} rounded-xl p-3 border border-white`}>
              <p className={`text-sm font-semibold ${t.color}`}>{t.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Credentials */}
      <Card className="bg-gray-900 border-0">
        <CardBody>
          <h2 className="text-lg font-bold mb-4 text-white">Demo Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-blue-400" />
                <p className="text-sm font-semibold text-gray-300">Entrepreneur Account</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm space-y-1">
                <p><span className="text-green-400">email: </span><span className="text-white">sarah@techwave.io</span></p>
                <p><span className="text-green-400">pass:  </span><span className="text-white">password123</span></p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CircleDollarSign size={16} className="text-yellow-400" />
                <p className="text-sm font-semibold text-gray-300">Investor Account</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm space-y-1">
                <p><span className="text-green-400">email: </span><span className="text-white">michael@vcinnovate.com</span></p>
                <p><span className="text-green-400">pass:  </span><span className="text-white">password123</span></p>
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-4">
            2FA Step: enter any 6-digit code (e.g. <span className="text-gray-300 font-mono">123456</span>) to complete login.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};
