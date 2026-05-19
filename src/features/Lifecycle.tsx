import { StatusBadge } from '../components/StatusBadge';
import type { SourceModel } from '../types';

interface LifecycleProps {
  models: SourceModel[];
}

export function Lifecycle({ models }: LifecycleProps) {
  const lifecycle = models.find((model) => model.id === 'lifecycle-model')?.data as LifecycleModel | undefined;

  return (
    <section className="panel wide">
      <div className="panel-header">
        <div>
          <h3>Lifecycle states</h3>
          <p>Entry criteria, exit criteria, eigenaars en transities zijn modeldata.</p>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Eigenaar</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>Volgende statussen</th>
            </tr>
          </thead>
          <tbody>
            {(lifecycle?.states ?? []).map((state) => (
              <tr key={state.id}>
                <td>
                  <strong>{state.name}</strong>
                  <small>{state.id}</small>
                </td>
                <td>
                  <StatusBadge value={state.owner_role} />
                </td>
                <td>{state.entry_criteria.length}</td>
                <td>{state.exit_criteria.length}</td>
                <td>{state.allowed_next.length ? state.allowed_next.join(', ') : 'eindstatus'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

interface LifecycleModel {
  states: Array<{
    id: string;
    name: string;
    owner_role: string;
    entry_criteria: string[];
    exit_criteria: string[];
    allowed_next: string[];
  }>;
}

