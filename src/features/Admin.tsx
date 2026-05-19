import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { createItem, deleteItem, updateItem, updateSettings } from '../api/client';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import type { AppSettings, DomainRole, UserAccount } from '../types';

interface AdminProps {
  settings: AppSettings;
  users: UserAccount[];
  domainRoles: DomainRole[];
  onChanged: () => Promise<void>;
}

type AdminTab = 'users' | 'domains' | 'auth' | 'llm' | 'audit';

export function Admin({ settings, users, domainRoles, onChanged }: AdminProps) {
  const [tab, setTab] = useState<AdminTab>('users');
  const [user, setUser] = useState<UserAccount | null>(null);
  const [domainRole, setDomainRole] = useState<DomainRole | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ collection: 'users' | 'domain-roles'; id: string; label: string } | null>(null);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteItem(deleteTarget.collection, deleteTarget.id);
    setDeleteTarget(null);
    await onChanged();
  }

  return (
    <section className="panel wide">
      <div className="panel-header">
        <div>
          <h3>Beheer</h3>
          <p>Gebruikers, domeinrollen, Google-authenticatie, LLM-selectie en auditstatus.</p>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {[
          ['users', 'Gebruikers'],
          ['domains', 'Domeinen'],
          ['auth', 'Authenticatie'],
          ['llm', 'LLM keuze'],
          ['audit', 'Logging']
        ].map(([id, label]) => (
          <button key={id} className={tab === id ? 'active' : ''} type="button" onClick={() => setTab(id as AdminTab)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'users' ? (
        <AdminTable
          title="Gebruikers"
          onNew={() => setUser(blankUser())}
          rows={users.map((item) => ({
            id: item.id,
            cells: [item.name, item.email, item.role, item.status],
            onEdit: () => setUser(item),
            onDelete: () => setDeleteTarget({ collection: 'users', id: item.id, label: item.name })
          }))}
          headers={['Naam', 'E-mail', 'Rol', 'Status']}
        />
      ) : null}

      {tab === 'domains' ? (
        <AdminTable
          title="Domeinrollen"
          onNew={() => setDomainRole(blankDomainRole())}
          rows={domainRoles.map((item) => ({
            id: item.id,
            cells: [item.domain, item.defaultRole, item.status],
            onEdit: () => setDomainRole(item),
            onDelete: () => setDeleteTarget({ collection: 'domain-roles', id: item.id, label: item.domain })
          }))}
          headers={['Domein', 'Standaardrol', 'Status']}
        />
      ) : null}

      {tab === 'auth' ? <AuthSettings settings={settings} onSaved={onChanged} /> : null}
      {tab === 'llm' ? <LlmSettings settings={settings} onSaved={onChanged} /> : null}
      {tab === 'audit' ? <AuditSettings settings={settings} /> : null}

      {user ? <UserModal item={user} onClose={() => setUser(null)} onSaved={async () => { setUser(null); await onChanged(); }} /> : null}
      {domainRole ? <DomainRoleModal item={domainRole} onClose={() => setDomainRole(null)} onSaved={async () => { setDomainRole(null); await onChanged(); }} /> : null}
      {deleteTarget ? (
        <Modal
          title="Beheerrecord verwijderen"
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
    </section>
  );
}

function AdminTable({ title, headers, rows, onNew }: { title: string; headers: string[]; rows: Array<{ id: string; cells: string[]; onEdit: () => void; onDelete: () => void }>; onNew: () => void }) {
  return (
    <div className="tab-panel">
      <div className="panel-header inner">
        <h4>{title}</h4>
        <button className="primary-button" type="button" onClick={onNew}>
          <Plus size={16} />
          Nieuw
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {row.cells.map((cell, index) => (
                  <td key={`${row.id}-${index}`}>{index === row.cells.length - 1 ? <StatusBadge value={cell} /> : cell}</td>
                ))}
                <td>
                  <div className="row-actions">
                    <button className="icon-button" type="button" onClick={row.onEdit} title="Wijzigen">
                      <Edit3 size={16} />
                    </button>
                    <button className="icon-button danger" type="button" onClick={row.onDelete} title="Verwijderen">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuthSettings({ settings, onSaved }: { settings: AppSettings; onSaved: () => Promise<void> }) {
  const [auth, setAuth] = useState(settings.auth);

  async function save() {
    await updateSettings({ auth });
    await onSaved();
  }

  return (
    <div className="settings-grid">
      <label>
        Provider
        <input value={auth.provider} onChange={(event) => setAuth({ ...auth, provider: event.target.value })} />
      </label>
      <label className="check-row">
        <input type="checkbox" checked={auth.clientIdConfigured} onChange={(event) => setAuth({ ...auth, clientIdConfigured: event.target.checked })} />
        Client ID geconfigureerd
      </label>
      <label className="check-row">
        <input type="checkbox" checked={auth.clientSecretConfigured} onChange={(event) => setAuth({ ...auth, clientSecretConfigured: event.target.checked })} />
        Client secret geconfigureerd
      </label>
      <label className="check-row">
        <input type="checkbox" checked={auth.bootstrapFirstAdmin} onChange={(event) => setAuth({ ...auth, bootstrapFirstAdmin: event.target.checked })} />
        Eerste login wordt beheerder
      </label>
      <button className="primary-button align-start" type="button" onClick={save}>
        Opslaan
      </button>
    </div>
  );
}

function LlmSettings({ settings, onSaved }: { settings: AppSettings; onSaved: () => Promise<void> }) {
  const [llm, setLlm] = useState(settings.llm);

  async function save() {
    await updateSettings({ llm });
    await onSaved();
  }

  return (
    <div className="settings-grid">
      <label>
        Provider
        <select value={llm.selectedProvider} onChange={(event) => setLlm({ ...llm, selectedProvider: event.target.value })}>
          <option value="openai">OpenAI</option>
          <option value="openrouter">OpenRouter</option>
        </select>
      </label>
      <label>
        Standaardmodel
        <input value={llm.selectedModel} onChange={(event) => setLlm({ ...llm, selectedModel: event.target.value })} />
      </label>
      <label>
        Fallbackmodel
        <input value={llm.fallbackModel} onChange={(event) => setLlm({ ...llm, fallbackModel: event.target.value })} />
      </label>
      <label>
        Temperatuur
        <input type="number" min="0" max="1" step="0.1" value={llm.temperature} onChange={(event) => setLlm({ ...llm, temperature: Number(event.target.value) })} />
      </label>
      <label className="span-2">
        Aanbeveling
        <textarea value={llm.recommendation} onChange={(event) => setLlm({ ...llm, recommendation: event.target.value })} />
      </label>
      <button className="primary-button align-start" type="button" onClick={save}>
        Opslaan
      </button>
    </div>
  );
}

function AuditSettings({ settings }: { settings: AppSettings }) {
  return (
    <div className="settings-grid">
      <div className="setting-card">
        <span>Auth provider</span>
        <strong>{settings.auth.provider}</strong>
      </div>
      <div className="setting-card">
        <span>LLM provider</span>
        <strong>{settings.llm.selectedProvider}</strong>
      </div>
      <div className="setting-card">
        <span>Model</span>
        <strong>{settings.llm.selectedModel}</strong>
      </div>
    </div>
  );
}

function UserModal({ item, onClose, onSaved }: { item: UserAccount; onClose: () => void; onSaved: () => Promise<void> }) {
  const [draft, setDraft] = useState(item);
  const isNew = !item.id;

  async function save() {
    if (isNew) await createItem<UserAccount>('users', draft);
    else await updateItem<UserAccount>('users', draft);
    await onSaved();
  }

  return (
    <Modal title={isNew ? 'Nieuwe gebruiker' : 'Gebruiker wijzigen'} onClose={onClose} footer={<ModalActions onCancel={onClose} onSave={save} />}>
      <div className="form-grid">
        <label>
          Naam
          <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        </label>
        <label>
          E-mail
          <input value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
        </label>
        <label>
          Rol
          <input value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })} />
        </label>
        <label>
          Status
          <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
            <option value="invited">invited</option>
            <option value="active">active</option>
            <option value="disabled">disabled</option>
          </select>
        </label>
      </div>
    </Modal>
  );
}

function DomainRoleModal({ item, onClose, onSaved }: { item: DomainRole; onClose: () => void; onSaved: () => Promise<void> }) {
  const [draft, setDraft] = useState(item);
  const isNew = !item.id;

  async function save() {
    if (isNew) await createItem<DomainRole>('domain-roles', draft);
    else await updateItem<DomainRole>('domain-roles', draft);
    await onSaved();
  }

  return (
    <Modal title={isNew ? 'Nieuwe domeinrol' : 'Domeinrol wijzigen'} onClose={onClose} footer={<ModalActions onCancel={onClose} onSave={save} />}>
      <div className="form-grid">
        <label>
          Domein
          <input value={draft.domain} onChange={(event) => setDraft({ ...draft, domain: event.target.value })} />
        </label>
        <label>
          Standaardrol
          <input value={draft.defaultRole} onChange={(event) => setDraft({ ...draft, defaultRole: event.target.value })} />
        </label>
        <label>
          Status
          <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
            <option value="active">active</option>
            <option value="disabled">disabled</option>
          </select>
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

function blankUser(): UserAccount {
  return { id: '', name: '', email: '', role: 'project_member', status: 'invited' };
}

function blankDomainRole(): DomainRole {
  return { id: '', domain: '', defaultRole: 'project_member', status: 'active' };
}

