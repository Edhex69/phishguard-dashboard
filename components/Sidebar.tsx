import React from 'react';
import { ShieldCheckIcon, LayoutDashboardIcon, AlertTriangleIcon, SettingsIcon } from './icons';
import { View } from '../App';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-left ${
      active
        ? 'bg-primary-700 text-white'
        : 'text-text-secondary hover:bg-surface hover:text-text-primary'
    }`}
    aria-current={active ? 'page' : undefined}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

interface SidebarProps {
    activeView: View;
    onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  return (
    <div className="w-64 flex-shrink-0 bg-surface border-r border-slate-700/50 flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-slate-700/50">
        <ShieldCheckIcon className="h-8 w-8 text-accent" />
        <h1 className="ml-3 text-2xl font-bold text-text-primary">PhishGuard</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem 
            icon={<LayoutDashboardIcon className="h-5 w-5" />} 
            label="Dashboard" 
            active={activeView === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
        />
        <NavItem 
            icon={<AlertTriangleIcon className="h-5 w-5" />} 
            label="Threat Explorer" 
            active={activeView === 'explorer'}
            onClick={() => onNavigate('explorer')}
        />
        <NavItem 
            icon={<SettingsIcon className="h-5 w-5" />} 
            label="Model Management" 
            active={activeView === 'models'}
            onClick={() => onNavigate('models')}
        />
      </nav>
      <div className="px-4 py-4 border-t border-slate-700/50">
        <div className="text-xs text-text-secondary">
          &copy; {new Date().getFullYear()} PhishGuard Inc.
        </div>
      </div>
    </div>
  );
};

export default Sidebar;