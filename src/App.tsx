import { useEffect, useMemo, useState } from 'react';
import { getProjectOs, updateSettings } from './api/client';
import { AppShell, type ViewKey } from './components/AppShell';
import { Admin } from './features/Admin';
import { Dashboard } from './features/Dashboard';
import { Governance } from './features/Governance';
import { Lifecycle } from './features/Lifecycle';
import { Reporting } from './features/Reporting';
import { SourceModels } from './features/SourceModels';
import { Validation } from './features/Validation';
import { WorkPackages } from './features/WorkPackages';
import type { AppSettings, ProjectPayload } from './types';

export function App() {
  const [payload, setPayload] = useState<ProjectPayload | null>(null);
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setError(null);
    const next = await getProjectOs();
    setPayload(next);
    applyTheme(next.appData.settings.ui.theme);
  }

  useEffect(() => {
    refresh()
      .catch((caught: Error) => setError(caught.message))
      .finally(() => setLoading(false));
  }, []);

  const settings = payload?.appData.settings ?? null;

  async function handleThemeChange(theme: AppSettings['ui']['theme']) {
    if (!payload) return;
    const nextSettings = {
      ...payload.appData.settings,
      ui: { theme }
    };
    setPayload({
      ...payload,
      appData: {
        ...payload.appData,
        settings: nextSettings
      }
    });
    applyTheme(theme);
    await updateSettings({ ui: { theme } });
    await refresh();
  }

  const content = useMemo(() => {
    if (loading) {
      return <div className="loading-state">Laden...</div>;
    }

    if (error) {
      return <div className="error-state">{error}</div>;
    }

    if (!payload) {
      return <div className="error-state">Geen projectdata beschikbaar.</div>;
    }

    switch (activeView) {
      case 'source':
        return <SourceModels models={payload.models} />;
      case 'governance':
        return <Governance models={payload.models} />;
      case 'lifecycle':
        return <Lifecycle models={payload.models} />;
      case 'work-packages':
        return <WorkPackages items={payload.appData.workPackages} onChanged={refresh} />;
      case 'validation':
        return <Validation validation={payload.validation} onValidated={refresh} />;
      case 'reporting':
        return (
          <Reporting
            decisions={payload.appData.decisions}
            risks={payload.appData.risks}
            audit={payload.appData.audit}
            workPackages={payload.appData.workPackages}
            onChanged={refresh}
          />
        );
      case 'admin':
        return (
          <Admin
            settings={payload.appData.settings}
            users={payload.appData.users}
            domainRoles={payload.appData.domainRoles}
            onChanged={refresh}
          />
        );
      default:
        return (
          <Dashboard
            payload={payload}
            onOpenWorkPackages={() => setActiveView('work-packages')}
            onOpenValidation={() => setActiveView('validation')}
          />
        );
    }
  }, [activeView, error, loading, payload]);

  return (
    <AppShell activeView={activeView} settings={settings} version={payload?.version ?? null} onNavigate={setActiveView} onThemeChange={handleThemeChange}>
      {content}
    </AppShell>
  );
}

function applyTheme(theme: AppSettings['ui']['theme']) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const actual = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
  document.documentElement.dataset.theme = actual;
}

