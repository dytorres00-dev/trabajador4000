import React from 'react';
import {
  LayoutDashboard,
  Timer,
  Lightbulb,
  CheckSquare
} from 'lucide-react';
import { Section } from '../../types';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
      ${active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
    `}
  >
    <Icon size={20} className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
    <span className="font-medium">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  currentSection: Section;
  setSection: (section: Section) => void;
}

export const Layout = ({ children, currentSection, setSection }: LayoutProps) => {
  const navItems: { id: Section; label: string; icon: any }[] = [
    { id: 'tareas', label: 'Tareas', icon: CheckSquare },
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
    { id: 'ideas', label: 'Ideas', icon: Lightbulb },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            WorkFlow <span className="text-indigo-500">Dash</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={currentSection === item.id}
              onClick={() => setSection(item.id)}
            />
          ))}
        </nav>

        <div className="mt-auto p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <p className="text-xs text-slate-500 mb-1">Estado del sistema</p>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Sincronizado localmente
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto relative">
        <div className="p-8 max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
