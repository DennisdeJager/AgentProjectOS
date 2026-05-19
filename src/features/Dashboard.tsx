import { AlertTriangle, CheckCircle2, FileCode2, ListTodo } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import type { ProjectPayload } from '../types';

interface DashboardProps {
  payload: ProjectPayload;
  onOpenWorkPackages: () => void;
  onOpenValidation: () => void;
}

export function Dashboard({ payload, onOpenWorkPackages, onOpenValidation }: DashboardProps) {
  const { models, appData, validation } = payload;
  const activeWork = appData.workPackages.filter((item) => item.status !== 'done');
  const blocked = appData.workPackages.filter((item) => item.blockers.length > 0);
  const releaseStatus = validation.status === 'passed' ? 'ready' : 'not_ready';

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <h2>Agent Project OS</h2>
          <p>
            Multi-agent softwareontwikkeling bestuurd vanuit source-modellen, governance, lifecycle, werkpakketten en
            validatie.
          </p>
        </div>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={onOpenWorkPackages}>
            Werkpakketten
          </button>
          <button className="secondary-button" type="button" onClick={onOpenValidation}>
            Validatie
          </button>
        </div>
      </section>

      <section className="stat-grid" aria-label="Projectstatus">
        <StatCard label="Source-modellen" value={models.length} icon={<FileCode2 size={20} />} detail="baseline actief" />
        <StatCard label="Open werk" value={activeWork.length} icon={<ListTodo size={20} />} detail={`${blocked.length} geblokkeerd`} />
        <StatCard
          label="Validatie"
          value={validation.status}
          icon={validation.status === 'passed' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          detail={`${validation.summary.total} findings`}
        />
        <StatCard label="Release" value={releaseStatus} icon={<CheckCircle2 size={20} />} detail="Dev-route voorbereid" />
      </section>

      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Lifecycle</h3>
            <p>Werk beweegt alleen door gecontroleerde statusovergangen.</p>
          </div>
        </div>
        <div className="pipeline">
          {(models.find((model) => model.id === 'lifecycle-model')?.data?.status_order as string[] | undefined)?.map((state) => (
            <div key={state} className="pipeline-step">
              <span>{state.replaceAll('_', ' ')}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Werkpakketten</h3>
            <p>{appData.workPackages.length} items in de lokale projectstate.</p>
          </div>
        </div>
        <div className="compact-list">
          {appData.workPackages.slice(0, 4).map((item) => (
            <button key={item.id} className="list-row clickable" type="button" onClick={onOpenWorkPackages}>
              <span>
                <strong>{item.title}</strong>
                <small>{item.id}</small>
              </span>
              <StatusBadge value={item.status} tone={item.blockers.length ? 'warning' : 'neutral'} />
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Validatie</h3>
            <p>Blocking regels worden via de API gecontroleerd.</p>
          </div>
        </div>
        <div className="validation-summary">
          <StatusBadge value={validation.status} tone={validation.status === 'passed' ? 'success' : 'danger'} />
          <dl>
            <div>
              <dt>Blocker</dt>
              <dd>{validation.summary.blocker}</dd>
            </div>
            <div>
              <dt>High</dt>
              <dd>{validation.summary.high}</dd>
            </div>
            <div>
              <dt>Medium</dt>
              <dd>{validation.summary.medium}</dd>
            </div>
            <div>
              <dt>Low</dt>
              <dd>{validation.summary.low}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}

