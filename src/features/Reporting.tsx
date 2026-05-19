import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { createItem, deleteItem, updateItem } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import type { AuditEntry, Decision, Risk, WorkPackage } from '../types';

interface ReportingProps {
  decisions: Decision[];
  risks: Risk[];
  audit: AuditEntry[];
  workPackages: WorkPackage[];
  onChanged: () => Promise<void>;
}

export function Reporting({ decisions, risks, audit, workPackages, onChanged }: ReportingProps) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [risk, setRisk] = useState<Risk | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ collection: 'decisions' | 'risks'; id: string; label: string } | null>(null);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteItem(deleteTarget.collection, deleteTarget.id);
    setDeleteTarget(null);
    await onChanged();
  }

  return (
    <div className="stack">
      <section className="stat-grid">
        <div className="stat-card">
          <div>
            <span>Werkpakketten</span>
            <strong>{workPackages.length}</strong>
            <small>{workPackages.filter((item) => item.status === 'done').length} klaar</small>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <span>Risico's</span>
            <strong>{risks.filter((item) => item.status !== 'closed').length}</strong>
            <small>open</small>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <span>Besluiten</span>
            <strong>{decisions.length}</strong>
            <small>{decisions.filter((item) => item.status === 'accepted').length} accepted</small>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <span>Audit</span>
            <strong>{audit.length}</strong>
            <small>laatste events</small>
          </div>
        </div>
      </section>

      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Besluiten</h3>
            <p>Besluiten blijven traceerbaar naar taken en gevolgen.</p>
          </div>
          <button className="primary-button" type="button" onClick={() => setDecision(blankDecision())}>
            <Plus size={16} />
            Nieuw
          </button>
        </div>
        {decisions.length === 0 ? (
          <EmptyState title="Er zijn nog geen besluiten." action={<button className="primary-button" onClick={() => setDecision(blankDecision())}>Nieuw</button>} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titel</th>
                  <th>Status</th>
                  <th>Eigenaar</th>
                  <th>Acties</th>
                </tr>
              </thead>
              <tbody>
                {decisions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <strong>{item.title}</strong>
                      <small>{item.decision}</small>
                    </td>
                    <td>
                      <StatusBadge value={item.status} tone={item.status === 'accepted' ? 'success' : 'neutral'} />
                    </td>
                    <td>{item.ownerRole}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-button" type="button" onClick={() => setDecision(item)} title="Wijzigen">
                          <Edit3 size={16} />
                        </button>
                        <button className="icon-button danger" type="button" onClick={() => setDeleteTarget({ collection: 'decisions', id: item.id, label: item.title })} title="Verwijderen">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Risico's</h3>
            <p>Risico's hebben eigenaar, kans, impact, mitigatie en status.</p>
          </div>
          <button className="primary-button" type="button" onClick={() => setRisk(blankRisk())}>
            <Plus size={16} />
            Nieuw
          </button>
        </div>
        {risks.length === 0 ? (
          <EmptyState title="Er zijn nog geen risico's." action={<button className="primary-button" onClick={() => setRisk(blankRisk())}>Nieuw</button>} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titel</th>
                  <th>Severity</th>
                  <th>Kans</th>
                  <th>Status</th>
                  <th>Acties</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <strong>{item.title}</strong>
                      <small>{item.mitigation}</small>
                    </td>
                    <td>
                      <StatusBadge value={item.severity} tone={item.severity === 'high' ? 'danger' : 'warning'} />
                    </td>
                    <td>{item.likelihood}</td>
                    <td>{item.status}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-button" type="button" onClick={() => setRisk(item)} title="Wijzigen">
                          <Edit3 size={16} />
                        </button>
                        <button className="icon-button danger" type="button" onClick={() => setDeleteTarget({ collection: 'risks', id: item.id, label: item.title })} title="Verwijderen">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Audit</h3>
            <p>Mutaties worden lokaal vastgelegd zonder secrets.</p>
          </div>
        </div>
        <div className="compact-list">
          {audit.slice(0, 8).map((item) => (
            <div key={item.id} className="list-row">
              <span>
                <strong>{item.action}</strong>
                <small>{item.subject}</small>
              </span>
              <time>{new Date(item.at).toLocaleString('nl-NL')}</time>
            </div>
          ))}
        </div>
      </section>

      {decision ? <DecisionModal item={decision} onClose={() => setDecision(null)} onSaved={async () => { setDecision(null); await onChanged(); }} /> : null}
      {risk ? <RiskModal item={risk} onClose={() => setRisk(null)} onSaved={async () => { setRisk(null); await onChanged(); }} /> : null}
      {deleteTarget ? (
        <Modal
          title="Record verwijderen"
          onClose={() => setDeleteTarget(null)}
          footer={
            <>
              <button className="secondary-button" type="button" onClick={() => setDeleteTarget(null)}>
                Annuleren
              </button>
              <button className="danger-button" type="button" onClick={handleDelete}>
                Verwijderen
              </button>
            </>
          }
        >
          <p>
            Verwijder <strong>{deleteTarget.label}</strong>?
          </p>
        </Modal>
      ) : null}
    </div>
  );
}

function DecisionModal({ item, onClose, onSaved }: { item: Decision; onClose: () => void; onSaved: () => Promise<void> }) {
  const [draft, setDraft] = useState(item);
  const isNew = !item.id;

  async function handleSave() {
    if (isNew) {
      await createItem<Decision>('decisions', draft);
    } else {
      await updateItem<Decision>('decisions', draft);
    }
    await onSaved();
  }

  return (
    <Modal title={isNew ? 'Nieuw besluit' : 'Besluit wijzigen'} onClose={onClose} footer={<ModalActions onCancel={onClose} onSave={handleSave} />}>
      <div className="form-grid">
        <label>
          Titel
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        </label>
        <label>
          Status
          <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
            <option value="proposed">proposed</option>
            <option value="accepted">accepted</option>
            <option value="rejected">rejected</option>
          </select>
        </label>
        <label>
          Eigenaar
          <input value={draft.ownerRole} onChange={(event) => setDraft({ ...draft, ownerRole: event.target.value })} />
        </label>
        <label>
          Gerelateerde taken
          <input value={draft.relatedWorkPackages.join(', ')} onChange={(event) => setDraft({ ...draft, relatedWorkPackages: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} />
        </label>
        <label className="span-2">
          Context
          <textarea value={draft.context} onChange={(event) => setDraft({ ...draft, context: event.target.value })} />
        </label>
        <label className="span-2">
          Besluit
          <textarea value={draft.decision} onChange={(event) => setDraft({ ...draft, decision: event.target.value })} />
        </label>
        <label className="span-2">
          Gevolgen
          <textarea value={draft.consequences} onChange={(event) => setDraft({ ...draft, consequences: event.target.value })} />
        </label>
      </div>
    </Modal>
  );
}

function RiskModal({ item, onClose, onSaved }: { item: Risk; onClose: () => void; onSaved: () => Promise<void> }) {
  const [draft, setDraft] = useState(item);
  const isNew = !item.id;

  async function handleSave() {
    if (isNew) {
      await createItem<Risk>('risks', draft);
    } else {
      await updateItem<Risk>('risks', draft);
    }
    await onSaved();
  }

  return (
    <Modal title={isNew ? 'Nieuw risico' : 'Risico wijzigen'} onClose={onClose} footer={<ModalActions onCancel={onClose} onSave={handleSave} />}>
      <div className="form-grid">
        <label>
          Titel
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        </label>
        <label>
          Status
          <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
            <option value="open">open</option>
            <option value="mitigated">mitigated</option>
            <option value="closed">closed</option>
          </select>
        </label>
        <label>
          Severity
          <select value={draft.severity} onChange={(event) => setDraft({ ...draft, severity: event.target.value })}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </label>
        <label>
          Kans
          <select value={draft.likelihood} onChange={(event) => setDraft({ ...draft, likelihood: event.target.value })}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </label>
        <label>
          Eigenaar
          <input value={draft.ownerRole} onChange={(event) => setDraft({ ...draft, ownerRole: event.target.value })} />
        </label>
        <label className="span-2">
          Beschrijving
          <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
        </label>
        <label className="span-2">
          Mitigatie
          <textarea value={draft.mitigation} onChange={(event) => setDraft({ ...draft, mitigation: event.target.value })} />
        </label>
      </div>
    </Modal>
  );
}

function ModalActions({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return (
    <>
      <button className="secondary-button" type="button" onClick={onCancel}>
        Annuleren
      </button>
      <button className="primary-button" type="button" onClick={onSave}>
        Opslaan
      </button>
    </>
  );
}

function blankDecision(): Decision {
  return {
    id: '',
    title: '',
    status: 'proposed',
    ownerRole: 'architect',
    context: '',
    decision: '',
    consequences: '',
    relatedWorkPackages: []
  };
}

function blankRisk(): Risk {
  return {
    id: '',
    title: '',
    description: '',
    severity: 'medium',
    likelihood: 'medium',
    ownerRole: 'conductor',
    mitigation: '',
    status: 'open'
  };
}

