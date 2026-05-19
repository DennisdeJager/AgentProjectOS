import { loadAppData } from '../server/lib/appDataStore.mjs';
import { loadSourceModels } from '../server/lib/sourceStore.mjs';
import { validateProjectOs } from '../server/lib/validation.mjs';

const rootDir = process.cwd();
const models = await loadSourceModels(rootDir);
const appData = await loadAppData(rootDir);
const validation = validateProjectOs(models, appData);

console.log(`Source models parsed: ${models.length}`);
console.log(`Validation status: ${validation.status}`);
console.log(
  `Findings: ${validation.summary.total} total, ${validation.summary.blocker} blocker, ${validation.summary.high} high, ${validation.summary.medium} medium, ${validation.summary.low} low`
);

for (const item of validation.findings) {
  console.log(`[${item.severity}] ${item.code} (${item.subject}) - ${item.explanation}`);
}

if (validation.summary.blocker > 0) {
  process.exit(1);
}

