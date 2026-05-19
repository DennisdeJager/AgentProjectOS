import {
  Activity,
  Boxes,
  ClipboardCheck,
  FileCode2,
  GitBranch,
  LayoutDashboard,
  ListTodo,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  UsersRound
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { AppSettings, VersionInfo } from '../types';

export type ViewKey =
  | 'dashboard'
  | 'source'
  | 'governance'
  | 'lifecycle'
  | 'work-packages'
  | 'validation'
  | 'reporting'
  | 'admin';

const navigation = [
  { id: 'dashboard', label: 'Overzicht', icon: LayoutDashboard },
  { id: 'source', label: 'Source', icon: FileCode2 },
  { id: 'governance', label: 'Governance', icon: ShieldCheck },
  { id: 'lifecycle', label: 'Lifecycle', icon: GitBranch },
  { id: 'work-packages', label: 'Werkpakketten', icon: ListTodo },
  { id: 'validation', label: 'Validatie', icon: ClipboardCheck },
  { id: 'reporting', label: 'Rapportage', icon: Activity },
  { id: 'admin', label: 'Beheer', icon: Settings }
] as const;

interface AppShellProps {
  activeView: ViewKey;
  children: ReactNode;
  settings: AppSettings | null;
  version: VersionInfo | null;
  onNavigate: (view: ViewKey) => void;
  onThemeChange: (theme: AppSettings['ui']['theme']) => void;
}

export function AppShell({ activeView, children, settings, version, onNavigate, onThemeChange }: AppShellProps) {
  const theme = settings?.ui.theme ?? 'system';

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Hoofdnavigatie">
        <div className="brand">
          <div className="brand-mark">
            <Boxes size={20} />
          </div>
          <div>
            <strong>Agent Project OS</strong>
            <span>Smawa operating model</span>
          </div>
        </div>

        <nav className="nav-list">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={item.id === activeView ? 'nav-item active' : 'nav-item'}
                onClick={() => onNavigate(item.id)}
                type="button"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Project</p>
            <h1>{navigation.find((item) => item.id === activeView)?.label ?? 'Overzicht'}</h1>
          </div>
          <div className="topbar-actions">
            <div className="theme-switch" role="group" aria-label="Thema">
              <button className={theme === 'light' ? 'active' : ''} onClick={() => onThemeChange('light')} title="Light" type="button">
                <Sun size={15} />
              </button>
              <button className={theme === 'dark' ? 'active' : ''} onClick={() => onThemeChange('dark')} title="Dark" type="button">
                <Moon size={15} />
              </button>
              <button className={theme === 'system' ? 'active' : ''} onClick={() => onThemeChange('system')} title="Volg systeem" type="button">
                <UsersRound size={15} />
              </button>
            </div>
          </div>
        </header>

        <main className="content">{children}</main>
        <div className="version-stamp">{version ? `${version.version} · ${version.versionedAt}` : '0.1.0'}</div>
      </div>
    </div>
  );
}

