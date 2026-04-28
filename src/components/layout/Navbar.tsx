import React, { useState } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import {
  Menu, X, Bell, MessageCircle, LogOut, Building2, CircleDollarSign,
  Home, Users, CalendarDays, FileText, Settings, HelpCircle,
  Video, FolderLock, Wallet, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardRoute = user?.role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor';
  const profileRoute = user ? `/profile/${user.role}/${user.id}` : '/login';

  // Mobile sidebar nav items (mirrors Sidebar but for mobile)
  const entrepreneurItems = [
    { to: dashboardRoute, icon: <Home size={20} />, text: 'Dashboard' },
    { to: `/profile/entrepreneur/${user?.id}`, icon: <Building2 size={20} />, text: 'My Startup' },
    { to: '/investors', icon: <CircleDollarSign size={20} />, text: 'Find Investors' },
    { to: '/scheduler', icon: <CalendarDays size={20} />, text: 'Scheduler' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/documents', icon: <FileText size={20} />, text: 'Documents' },
    { to: '/payments', icon: <Wallet size={20} />, text: 'Payments' },
    { to: '/videocall', icon: <Video size={20} />, text: 'Video Calls' },
    { to: '/chamber', icon: <FolderLock size={20} />, text: 'Doc Chamber' },
  ];

  const investorItems = [
    { to: dashboardRoute, icon: <Home size={20} />, text: 'Dashboard' },
    { to: `/profile/investor/${user?.id}`, icon: <CircleDollarSign size={20} />, text: 'My Portfolio' },
    { to: '/entrepreneurs', icon: <Users size={20} />, text: 'Find Startups' },
    { to: '/scheduler', icon: <CalendarDays size={20} />, text: 'Scheduler' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/deals', icon: <FileText size={20} />, text: 'Deals' },
    { to: '/payments', icon: <Wallet size={20} />, text: 'Payments' },
    { to: '/videocall', icon: <Video size={20} />, text: 'Video Calls' },
    { to: '/chamber', icon: <FolderLock size={20} />, text: 'Doc Chamber' },
  ];

  const mobileItems = user?.role === 'entrepreneur' ? entrepreneurItems : investorItems;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 z-30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left: hamburger (mobile) + logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              <Link to={dashboardRoute || '/'} className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-900 hidden sm:block">Business Nexus</span>
              </Link>
            </div>

            {/* Right: actions + avatar */}
            {user && (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link to="/payments"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
                  <Wallet size={17} />
                  <span className="hidden lg:inline font-medium">Payments</span>
                </Link>

                <Link to="/messages"
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
                  <MessageCircle size={20} />
                </Link>

                <Link to="/notifications"
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
                  <Bell size={20} />
                </Link>

                {/* Role badge */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                  {user.role === 'entrepreneur'
                    ? <><Building2 size={13} className="text-primary-600" /><span>Entrepreneur</span></>
                    : <><CircleDollarSign size={13} className="text-primary-600" /><span>Investor</span></>}
                </div>

                {/* Avatar + name dropdown */}
                <div className="flex items-center gap-2 ml-1">
                  <Link to={profileRoute}>
                    <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-1.5 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Sign out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile slide-out sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-bold text-gray-900">Business Nexus</span>
              </div>
              <button onClick={closeMobileMenu} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            {/* User info */}
            {user && (
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatarUrl} alt={user.name} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                      {user.role === 'entrepreneur'
                        ? <Building2 size={11} />
                        : <CircleDollarSign size={11} />}
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
              {mobileItems.map((item, i) => (
                <NavLink
                  key={i}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm">{item.text}</span>
                  </span>
                  <ChevronRight size={14} className="text-gray-400" />
                </NavLink>
              ))}

              <div className="pt-3 border-t border-gray-100 mt-3 space-y-1">
                <NavLink to="/settings" onClick={closeMobileMenu}
                  className={({ isActive }) => `flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-colors ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <Settings size={20} /> Settings
                </NavLink>
                <NavLink to="/help" onClick={closeMobileMenu}
                  className={({ isActive }) => `flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-colors ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <HelpCircle size={20} /> Help & Support
                </NavLink>
              </div>
            </nav>

            {/* Sign out */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => { handleLogout(); closeMobileMenu(); }}
                className="flex items-center gap-3 w-full py-2.5 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                <LogOut size={18} /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
