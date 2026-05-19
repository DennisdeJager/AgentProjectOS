import { FileCode2 } from 'lucide-react';
import type { SourceModel } from '../types';

interface SourceModelsProps {
  models: SourceModel[];
}

export function SourceModels({ models }: SourceModelsProps) {
  return (
    <section className="panel wide">
      <div className="panel-header">
        <div>
          <h3>Source-modellen</h3>
          <p>.project-os/source is leidend voor generatie, validatie en toekomstige MCP-tools.</p>
        </div>
      </div>
      <div className="model-grid">
        {models.map((model) => (
          <article key={model.id} className="model-card">
            <div className="model-card-header">
              <FileCode2 size={18} />
              <div>
                <h4>{model.fileName}</h4>
                <span>{model.kind}</span>
              </div>
            </div>
            <dl className="inline-meta">
              <div>
                <dt>Secties</dt>
                <dd>{model.stats.sections}</dd>
              </div>
              <div>
                <dt>Items</dt>
                <dd>{model.stats.items}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{model.sourceStatus}</dd>
              </div>
            </dl>
            <details>
              <summary>Modeldata</summary>
              <pre>{JSON.stringify(model.data, null, 2)}</pre>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}

