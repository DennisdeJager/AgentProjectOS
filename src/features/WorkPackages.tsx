import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createItem, deleteItem, updateItem } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import type { WorkPackage } from '../types';

interface WorkPackagesProps {
  items: WorkPackage[];
  onChanged: () => Promise<void>;
}

const roles = ['conductor', 'scrum_master', 'architect', 'engineer', 'tester', 'reviewer', 'deployment_manager'];
const lifecycleStates = [
  'idea',
  'intake',
  'refinement',
  'architecture_review',
  'ready_for_build',
  'implementation',
  'developer_validation',
  'test_review',
  'code_review',
  'release_review',
  'done',
  'blocked'
];

export function WorkPackages({ items, onChanged }: WorkPackagesProps) {
  const [editing, setEditing] = useState<WorkPackage | null>(null);
  const [deleting, setDeleting] = useState<WorkPackage | null>(null);
  const grouped = useMemo(() => groupByStatus(items), [items]);

  async function handleDelete() {
    if (!deleting) return;
    await deleteItem('work-packages', deleting.id);
    setDeleting(null);
    await onChanged();
  }

  return (
    <div className="stack">
      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Werkpakketten</h3>
            <p>Taken zijn klein, geisoleerd, controleerbaar en gekoppeld aan lifecycle en rollen.</p>
          </div>
          <button className="primary-button" type="button" onClick={() => setEditing(createBlankWorkPackage())}>
            <Plus size={16} />
            Nieuw
          </button>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="Er zijn nog geen werkpakketten."
            action={
              <button className="primary-button" type="button" onClick={() => setEditing(createBlankWorkPackage())}>
                <Plus size={16} />
                Nieuw
              </button>
            }
          />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titel</th>
                  <th>Status</th>
                  <th>Eigenaar</th>
                  <th>Reviewer</th>
                  <th>Criteria</th>
                  <th>Acties</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <strong>{item.title}</strong>
                      <small>{item.goal}</small>
                    </td>
                    <td>
                      <StatusBadge value={item.status} tone={item.blockers.length ? 'warning' : 'neutral'} />
                    </td>
                    <td>{item.owner}</td>
                    <td>{item.reviewer}</td>
                    <td>
                      {item.acceptanceCriteria.length}/{item.testCriteria.length}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-button" type="button" onClick={() => setEditing(item)} title="Wijzigen">
                          <Edit3 size={16} />
                        </button>
                        <button className="icon-button danger" type="button" onClick={() => setDeleting(item)} title="Verwijderen">
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
            <h3>Statusverdeling</h3>
            <p>Actief werk per lifecycle-status.</p>
          </div>
        </div>
        <div className="status-lanes">
          {Object.entries(grouped).map(([status, statusItems]) => (
            <div key={status} className="status-lane">
              <strong>{status.replaceAll('_', ' ')}</strong>
              <span>{statusItems.length}</span>
            </div>
          ))}
        </div>
      </section>

      {editing ? (
        <WorkPackageModal
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await onChanged();
          }}
        />
      ) : null}

      {deleting ? (
        <Modal
          title="Werkpakket verwijderen"
          onClose={() => setDeleting(null)}
          footer={
            <>
              <button className="secondary-button" type="button" onClick={() => setDeleting(null)}>
                Annuleren
              </button>
              <button className="danger-button" type="button" onClick={handleDelete}>
                Verwijderen
              </button>
            </>
          }
        >
          <p>
            Verwijder <strong>{deleting.title}</strong>?
          </p>
        </Modal>
      ) : null}
    </div>
  );
}

function WorkPackageModal({ item, onClose, onSaved }: { item: WorkPackage; onClose: () => void; onSaved: () => Promise<void> }) {
  const [draft, setDraft] = useState(item);
  const isNew = !item.id;

  async function handleSubmit() {
    const normalized = normalizeWorkPackage(draft);
    if (isNew) {
      await createItem<WorkPackage>('work-packages', normalized);
    } else {
      await updateItem<WorkPackage>('work-packages', normalized);
    }
    await onSaved();
  }

  return (
    <Modal
      title={isNew ? 'Nieuw werkpakket' : 'Werkpakket wijzigen'}
      onClose={onClose}
      footer={
        <>
          <button className="secondary-button" type="button" onClick={onClose}>
            Annuleren
          </button>
          <button className="primary-button" type="button" onClick={handleSubmit}>
            Opslaan
          </button>
        </>
      }
    >
      <div className="form-grid">
        <label>
          Titel
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        </label>
        <label>
          Status
          <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value, lifecycleState: event.target.value })}>
            {lifecycleStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
        <label>
          Eigenaar
          <select value={draft.owner} onChange={(event) => setDraft({ ...draft, owner: event.target.value, allowedRole: event.target.value })}>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <label>
          Reviewer
          <select value={draft.reviewer} onChange={(event) => setDraft({ ...draft, reviewer: event.target.value, reviewerRole: event.target.value })}>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <label className="span-2">
          Doel
          <textarea value={draft.goal} onChange={(event) => setDraft({ ...draft, goal: event.target.value })} />
        </label>
        <label className="span-2">
          Context
          <textarea value={draft.context} onChange={(event) => setDraft({ ...draft, context: event.target.value })} />
        </label>
        <label>
          Acceptatiecriteria
          <textarea value={draft.acceptanceCriteria.join('\n')} onChange={(event) => setDraft({ ...draft, acceptanceCriteria: lines(event.target.value) })} />
        </label>
        <label>
          Testcriteria
          <textarea value={draft.testCriteria.join('\n')} onChange={(event) => setDraft({ ...draft, testCriteria: lines(event.target.value) })} />
        </label>
        <label>
          Files in scope
          <textarea value={draft.filesInScope.join('\n')} onChange={(event) => setDraft({ ...draft, filesInScope: lines(event.target.value) })} />
        </label>
        <label>
          Files out of scope
          <textarea value={draft.filesOutOfScope.join('\n')} onChange={(event) => setDraft({ ...draft, filesOutOfScope: lines(event.target.value) })} />
        </label>
        <label className="span-2">
          Verwachte output
          <input value={draft.expectedOutput} onChange={(event) => setDraft({ ...draft, expectedOutput: event.target.value })} />
        </label>
      </div>
    </Modal>
  );
}

function createBlankWorkPackage(): WorkPackage {
  return {
    id: '',
    title: '',
    goal: '',
    context: '',
    nonGoals: [],
    filesInScope: [],
    filesOutOfScope: [],
    dependencies: [],
    acceptanceCriteria: [],
    testCriteria: [],
    allowedRole: 'engineer',
    reviewerRole: 'reviewer',
    risks: [],
    expectedOutput: '',
    reportingFormat: 'work_package_status',
    lifecycleState: 'intake',
    status: 'intake',
    owner: 'engineer',
    reviewer: 'reviewer',
    confidence: 'medium',
    blockers: []
  };
}

function normalizeWorkPackage(item: WorkPackage): WorkPackage {
  return {
    ...item,
    allowedRole: item.owner,
    reviewerRole: item.reviewer,
    lifecycleState: item.status,
    nonGoals: item.nonGoals ?? [],
    filesInScope: item.filesInScope ?? [],
    filesOutOfScope: item.filesOutOfScope ?? [],
    dependencies: item.dependencies ?? [],
    risks: item.risks ?? [],
    blockers: item.blockers ?? []
  };
}

function lines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function groupByStatus(items: WorkPackage[]) {
  return items.reduce<Record<string, WorkPackage[]>>((groups, item) => {
    groups[item.status] ??= [];
    groups[item.status].push(item);
    return groups;
  }, {});
}

