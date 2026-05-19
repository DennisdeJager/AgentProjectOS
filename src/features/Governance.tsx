import { StatusBadge } from '../components/StatusBadge';
import type { SourceModel } from '../types';

interface GovernanceProps {
  models: SourceModel[];
}

export function Governance({ models }: GovernanceProps) {
  const roleModel = models.find((model) => model.id === 'role-model')?.data as RoleModel | undefined;
  const governance = models.find((model) => model.id === 'governance-model')?.data as GovernanceModel | undefined;

  return (
    <div className="stack">
      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Rollen en bevoegdheden</h3>
            <p>Elke rol heeft expliciete verantwoordelijkheden, bevoegdheden, restricties en output.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rol</th>
                <th>Doel</th>
                <th>Mag</th>
                <th>Mag niet</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              {(roleModel?.roles ?? []).map((role) => (
                <tr key={role.id}>
                  <td>
                    <strong>{role.name}</strong>
                    <small>{role.id}</small>
                  </td>
                  <td>{role.purpose}</td>
                  <td>{role.allowed.length}</td>
                  <td>{role.forbidden.length}</td>
                  <td>{role.required_outputs.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Besluitregels</h3>
            <p>Accountability blijft bij een expliciete rol.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Besluit</th>
                <th>Eindverantwoordelijk</th>
                <th>Input</th>
                <th>Restrictie</th>
              </tr>
            </thead>
            <tbody>
              {(governance?.decision_rules ?? []).map((rule) => (
                <tr key={rule.id}>
                  <td>{rule.decision}</td>
                  <td>
                    <StatusBadge value={rule.accountable_role} />
                  </td>
                  <td>{rule.required_input_roles.join(', ')}</td>
                  <td>{rule.restriction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

interface RoleModel {
  roles: Array<{
    id: string;
    name: string;
    purpose: string;
    allowed: string[];
    forbidden: string[];
    required_outputs: string[];
  }>;
}

interface GovernanceModel {
  decision_rules: Array<{
    id: string;
    decision: string;
    accountable_role: string;
    required_input_roles: string[];
    restriction: string;
  }>;
}

