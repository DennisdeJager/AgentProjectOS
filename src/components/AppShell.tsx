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
  { id: 'dashboard', label: 'Start', description: 'Wat nu eerst?', group: 'Project', icon: LayoutDashboard },
  { id: 'source', label: 'Procesmodel', description: 'Bron van waarheid', group: 'Model', icon: FileCode2 },
  { id: 'governance', label: 'Rollen & regels', description: 'Wie mag wat?', group: 'Model', icon: ShieldCheck },
  { id: 'lifecycle', label: 'Flow', description: 'Van idee naar done', group: 'Model', icon: GitBranch },
  { id: 'work-packages', label: 'Werkpakketten', description: 'Taken agent-ready maken', group: 'Uitvoering', icon: ListTodo },
  { id: 'validation', label: 'Controle', description: 'Regels en blockers', group: 'Uitvoering', icon: ClipboardCheck },
  { id: 'reporting', label: 'Rapportage', description: 'Risico, besluit, audit', group: 'Uitvoering', icon: Activity },
  { id: 'admin', label: 'Beheer', description: 'Auth, LLM, gebruikers', group: 'Beheer', icon: Settings }
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
  const activeItem = navigation.find((item) => item.id === activeView) ?? navigation[0];
  const groupedNavigation = navigation.reduce<Record<string, typeof navigation[number][]>>((groups, item) => {
    groups[item.group] ??= [];
    groups[item.group].push(item);
    return groups;
  }, {});

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
          {Object.entries(groupedNavigation).map(([group, items]) => (
            <div key={group} className="nav-group">
              <div className="nav-group-label">{group}</div>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={item.id === activeView ? 'nav-item active' : 'nav-item'}
                    onClick={() => onNavigate(item.id)}
                    type="button"
                  >
                    <Icon size={18} />
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Agent Project OS / {activeItem.group}</p>
            <h1>{activeItem.label}</h1>
            <p className="page-subtitle">{activeItem.description}</p>
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
