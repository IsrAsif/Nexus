import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Building2, CircleDollarSign, Users, MessageCircle, 
  Bell, FileText, Settings, HelpCircle, Video, FolderLock, CalendarDays, Wallet, MonitorPlay
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  tourId?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, tourId }) => {
  return (
    <NavLink
      to={to}
      data-tour={tourId}
      className={({ isActive }) => 
        `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${
          isActive 
            ? 'bg-primary-50 text-primary-700' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const entrepreneurItems = [
    { to: '/dashboard/entrepreneur', icon: <Home size={20} />,             text: 'Dashboard',      tourId: undefined },
    { to: '/profile/entrepreneur/' + user.id, icon: <Building2 size={20} />, text: 'My Startup',   tourId: undefined },
    { to: '/investors',              icon: <CircleDollarSign size={20} />,  text: 'Find Investors', tourId: 'sidebar-investors' },
    { to: '/scheduler',              icon: <CalendarDays size={20} />,      text: 'Scheduler',      tourId: undefined },
    { to: '/messages',               icon: <MessageCircle size={20} />,     text: 'Messages',       tourId: undefined },
    { to: '/notifications',          icon: <Bell size={20} />,              text: 'Notifications',  tourId: undefined },
    { to: '/documents',              icon: <FileText size={20} />,          text: 'Documents',      tourId: undefined },
    { to: '/payments',               icon: <Wallet size={20} />,            text: 'Payments',       tourId: 'sidebar-payments' },
    { to: '/videocall',              icon: <Video size={20} />,             text: 'Video Calls',    tourId: 'sidebar-videocall' },
    { to: '/chamber',                icon: <FolderLock size={20} />,        text: 'Doc Chamber',    tourId: 'sidebar-chamber' },
  ];
  
  const investorItems = [
    { to: '/dashboard/investor',     icon: <Home size={20} />,             text: 'Dashboard',       tourId: undefined },
    { to: '/profile/investor/' + user.id, icon: <CircleDollarSign size={20} />, text: 'My Portfolio', tourId: undefined },
    { to: '/entrepreneurs',          icon: <Users size={20} />,            text: 'Find Startups',   tourId: 'sidebar-entrepreneurs' },
    { to: '/scheduler',              icon: <CalendarDays size={20} />,     text: 'Scheduler',       tourId: undefined },
    { to: '/messages',               icon: <MessageCircle size={20} />,    text: 'Messages',        tourId: undefined },
    { to: '/notifications',          icon: <Bell size={20} />,             text: 'Notifications',   tourId: undefined },
    { to: '/deals',                  icon: <FileText size={20} />,         text: 'Deals',           tourId: 'sidebar-deals' },
    { to: '/payments',               icon: <Wallet size={20} />,           text: 'Payments',        tourId: 'sidebar-payments' },
    { to: '/videocall',              icon: <Video size={20} />,            text: 'Video Calls',     tourId: undefined },
    { to: '/chamber',                icon: <FolderLock size={20} />,       text: 'Doc Chamber',     tourId: undefined },
  ];
  
  const sidebarItems = user.role === 'entrepreneur' ? entrepreneurItems : investorItems;
  
  const commonItems = [
    { to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
    { to: '/help', icon: <HelpCircle size={20} />, text: 'Help & Support' },
    { to: '/demo', icon: <MonitorPlay size={20} />, text: 'Demo / About' },
  ];
  
  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 hidden md:block">
      <div className="h-full flex flex-col">
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                to={item.to}
                icon={item.icon}
                text={item.text}
                tourId={item.tourId}
              />
            ))}
          </div>
          
          <div className="mt-8 px-3">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Settings
            </h3>
            <div className="mt-2 space-y-1">
              {commonItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  to={item.to}
                  icon={item.icon}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-xs text-gray-600">Need assistance?</p>
            <h4 className="text-sm font-medium text-gray-900 mt-1">Contact Support</h4>
            <a 
              href="mailto:support@businessnexus.com" 
              className="mt-2 inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-500"
            >
              support@businessnexus.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
