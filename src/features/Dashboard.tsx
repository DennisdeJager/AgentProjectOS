import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCode2,
  GitBranch,
  ListChecks,
  ListTodo,
  ShieldCheck
} from 'lucide-react';
import type { ViewKey } from '../components/AppShell';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import type { ProjectPayload, ValidationResult, WorkPackage } from '../types';

interface DashboardProps {
  payload: ProjectPayload;
  onNavigate: (view: ViewKey) => void;
}

const workflowSteps = [
  {
    title: 'Model begrijpen',
    detail: 'Projectdoel, bronmodellen en succescriteria bepalen wat waar is.',
    action: 'Open model',
    target: 'source',
    icon: FileCode2
  },
  {
    title: 'Rollen bewaken',
    detail: 'Verantwoordelijkheden, verboden acties en besluiten blijven expliciet.',
    action: 'Open rollen',
    target: 'governance',
    icon: ShieldCheck
  },
  {
    title: 'Werk klaarzetten',
    detail: 'Maak taken klein, toetsbaar en gekoppeld aan eigenaar en reviewer.',
    action: 'Open taken',
    target: 'work-packages',
    icon: ListTodo
  },
  {
    title: 'Regels controleren',
    detail: 'Run validatie voordat werk doorstroomt of release-ready wordt.',
    action: 'Run controle',
    target: 'validation',
    icon: ClipboardCheck
  },
  {
    title: 'Rapporteren',
    detail: 'Leg besluiten, risico\'s en audit vast voor overdracht en release.',
    action: 'Open rapportage',
    target: 'reporting',
    icon: Activity
  }
] satisfies Array<{
  title: string;
  detail: string;
  action: string;
  target: ViewKey;
  icon: typeof FileCode2;
}>;

export function Dashboard({ payload, onNavigate }: DashboardProps) {
  const { models, appData, validation } = payload;
  const activeWork = appData.workPackages.filter((item) => item.status !== 'done');
  const blocked = appData.workPackages.filter((item) => item.blockers.length > 0);
  const releaseStatus = validation.status === 'passed' ? 'ready' : 'not_ready';
  const validationLabel = validation.status === 'passed' ? 'geslaagd' : 'gefaald';
  const releaseLabel = releaseStatus === 'ready' ? 'klaar' : 'niet klaar';
  const charter = models.find((model) => model.kind === 'project_charter')?.data as ProjectCharter | undefined;
  const nextAction = getNextAction(activeWork, blocked, validation);
  const firstWorkItem = activeWork[0] ?? null;
  const lifecycleStates = models.find((model) => model.id === 'lifecycle-model')?.data as LifecycleModel | undefined;

  return (
    <div className="page-grid">
      <section className="orientation-panel">
        <div className="orientation-copy">
          <p className="eyebrow">Projectroute</p>
          <h2>{charter?.project?.name ?? 'Agent Project OS'}</h2>
          <p>Stuur multi-agent softwareontwikkeling vanuit bronmodellen, werkpakketten, controles en rapportage.</p>
          <div className="orientation-actions">
            <button className="primary-button" type="button" onClick={() => onNavigate(nextAction.target)}>
              {nextAction.action}
              <ArrowRight size={16} />
            </button>
            <button className="secondary-button" type="button" onClick={() => onNavigate('lifecycle')}>
              Bekijk flow
            </button>
          </div>
        </div>
        <aside className="next-action-panel" aria-label="Aanbevolen volgende stap">
          <span>Nu eerst</span>
          <strong>{nextAction.title}</strong>
          <p>{nextAction.detail}</p>
          {firstWorkItem ? (
            <div className="focus-item">
              <small>Actief werk</small>
              <b>{firstWorkItem.id}</b>
              <span>{firstWorkItem.title}</span>
            </div>
          ) : null}
        </aside>
      </section>

      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Projectroute</h3>
            <p>De app werkt van model naar taak, van taak naar controle, en daarna naar rapportage en release.</p>
          </div>
        </div>
        <div className="workflow-grid" aria-label="Primaire projectroute">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="workflow-step">
                <div className="workflow-step-header">
                  <span className="step-number">{index + 1}</span>
                  <Icon size={18} />
                </div>
                <h4>{step.title}</h4>
                <p>{step.detail}</p>
                <button className="text-link" type="button" onClick={() => onNavigate(step.target)}>
                  {step.action}
                  <ArrowRight size={14} />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="stat-grid" aria-label="Projectstatus">
        <StatCard label="Source-modellen" value={models.length} icon={<FileCode2 size={20} />} detail="baseline actief" />
        <StatCard label="Open werk" value={activeWork.length} icon={<ListTodo size={20} />} detail={`${blocked.length} geblokkeerd`} />
        <StatCard
          label="Validatie"
          value={validationLabel}
          icon={validation.status === 'passed' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          detail={`${validation.summary.total} findings`}
        />
        <StatCard label="Release" value={releaseLabel} icon={<CheckCircle2 size={20} />} detail="Dev-route voorbereid" />
      </section>

      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Procesflow</h3>
            <p>Werk beweegt alleen door gecontroleerde statusovergangen met eigenaar, criteria en review.</p>
          </div>
          <button className="secondary-button" type="button" onClick={() => onNavigate('lifecycle')}>
            <GitBranch size={16} />
            Details
          </button>
        </div>
        <div className="pipeline">
          {(lifecycleStates?.status_order ?? []).map((state) => (
            <div key={state} className="pipeline-step">
              <span>{formatLifecycleLabel(state)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Werkpakketten</h3>
            <p>{appData.workPackages.length} taken in de lokale projectstate.</p>
          </div>
          <button className="secondary-button" type="button" onClick={() => onNavigate('work-packages')}>
            <ListChecks size={16} />
            Open
          </button>
        </div>
        <div className="compact-list">
          {appData.workPackages.slice(0, 4).map((item) => (
            <button key={item.id} className="list-row clickable" type="button" onClick={() => onNavigate('work-packages')}>
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
            <h3>Controle</h3>
            <p>Blocking regels worden via de API gecontroleerd voordat werk doorstroomt.</p>
          </div>
          <button className="secondary-button" type="button" onClick={() => onNavigate('validation')}>
            <ClipboardCheck size={16} />
            Open
          </button>
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

function getNextAction(activeWork: WorkPackage[], blocked: WorkPackage[], validation: ValidationResult) {
  if (validation.status !== 'passed') {
    return {
      title: 'Los validatiefindings op',
      detail: `${validation.summary.total} findings blokkeren een betrouwbare volgende stap.`,
      action: 'Open controle',
      target: 'validation' as const
    };
  }

  if (blocked.length > 0) {
    return {
      title: 'Haal blockers van taken',
      detail: `${blocked.length} werkpakket${blocked.length === 1 ? '' : 'ten'} heeft nog een blocker.`,
      action: 'Open werkpakketten',
      target: 'work-packages' as const
    };
  }

  if (activeWork.length > 0) {
    const first = activeWork[0];
    return {
      title: `${first.id} naar de volgende fase`,
      detail: `${first.title} staat nu op ${formatLifecycleLabel(first.status)}.`,
      action: 'Open werkpakketten',
      target: 'work-packages' as const
    };
  }

  return {
    title: 'Start een nieuw werkpakket',
    detail: 'Er is geen actief werk. Maak eerst een kleine, toetsbare taak aan.',
    action: 'Nieuw werk plannen',
    target: 'work-packages' as const
  };
}

interface ProjectCharter {
  project?: {
    name?: string;
    product_goal?: string;
  };
}

interface LifecycleModel {
  status_order?: string[];
}

function formatLifecycleLabel(status: string) {
  const labels: Record<string, string> = {
    idea: 'Idee',
    intake: 'Intake',
    refinement: 'Uitwerken',
    architecture_review: 'Architectuurreview',
    ready_for_build: 'Klaar voor bouw',
    implementation: 'Bouwen',
    developer_validation: 'Developercontrole',
    test_review: 'Testreview',
    code_review: 'Codereview',
    release_review: 'Releasereview',
    done: 'Klaar',
    blocked: 'Geblokkeerd'
  };
  return labels[status] ?? status.replaceAll('_', ' ');
}
