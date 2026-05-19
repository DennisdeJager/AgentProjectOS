import { RefreshCw } from 'lucide-react';
import { runValidation } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';
import type { ValidationResult } from '../types';

interface ValidationProps {
  validation: ValidationResult;
  onValidated: () => Promise<void>;
}

export function Validation({ validation, onValidated }: ValidationProps) {
  async function handleRun() {
    await runValidation();
    await onValidated();
  }

  return (
    <section className="panel wide">
      <div className="panel-header">
        <div>
          <h3>Validatie</h3>
          <p>Bronmodellen en lokale projectstate worden op blocking regels gecontroleerd.</p>
        </div>
        <button className="primary-button" type="button" onClick={handleRun}>
          <RefreshCw size={16} />
          Run
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

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Severity</th>
              <th>Code</th>
              <th>Onderwerp</th>
              <th>Uitleg</th>
              <th>Advies</th>
            </tr>
          </thead>
          <tbody>
            {validation.findings.length === 0 ? (
              <tr>
                <td colSpan={5}>Geen findings.</td>
              </tr>
            ) : (
              validation.findings.map((finding) => (
                <tr key={finding.id}>
                  <td>
                    <StatusBadge value={finding.severity} tone={finding.severity === 'blocker' ? 'danger' : 'warning'} />
                  </td>
                  <td>{finding.code}</td>
                  <td>{finding.subject}</td>
                  <td>{finding.explanation}</td>
                  <td>{finding.recommendation}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

