import { SOURCE_MODEL_FILES } from './sourceStore.mjs';

export function validateProjectOs(models, appData) {
  const findings = [];
  const modelById = new Map(models.map((model) => [model.id, model]));

  for (const fileName of SOURCE_MODEL_FILES) {
    const id = fileName.replace(/\.yaml$/, '');
    if (!modelById.has(id)) {
      findings.push(finding('blocker', 'missing_source_model', id, `Source model ${fileName} ontbreekt.`, 'Maak het ontbrekende source-model aan.'));
    }
  }

  validateRoleModel(modelById.get('role-model')?.data, findings);
  validateGovernanceModel(modelById.get('governance-model')?.data, findings);
  validateLifecycleModel(modelById.get('lifecycle-model')?.data, findings);
  validateWorkPackageModel(modelById.get('work-package-model')?.data, findings);
  validateReportingModel(modelById.get('reporting-model')?.data, findings);
  validateAppWorkPackages(appData?.workPackages ?? [], findings);

  const summary = summarizeFindings(findings);

  return {
    status: summary.blocker > 0 || summary.high > 0 ? 'failed' : 'passed',
    generatedAt: new Date().toISOString(),
    summary,
    findings
  };
}

export function summarizeFindings(findings) {
  return findings.reduce(
    (summary, item) => {
      summary[item.severity] += 1;
      summary.total += 1;
      return summary;
    },
    { blocker: 0, high: 0, medium: 0, low: 0, total: 0 }
  );
}

function validateRoleModel(model, findings) {
  const roles = model?.roles ?? [];

  if (!roles.length) {
    findings.push(finding('blocker', 'roles_missing', 'role-model', 'Er zijn geen rollen gedefinieerd.', 'Voeg minimaal de basisrollen toe.'));
    return;
  }

  for (const role of roles) {
    requireList(role.responsibilities, 'blocker', 'role_missing_responsibilities', role.id, 'Rol mist verantwoordelijkheden.', findings);
    requireList(role.allowed, 'blocker', 'role_missing_authorities', role.id, 'Rol mist bevoegdheden.', findings);
    requireList(role.forbidden, 'blocker', 'role_missing_restrictions', role.id, 'Rol mist verboden acties.', findings);
    requireList(role.required_outputs, 'high', 'role_missing_outputs', role.id, 'Rol mist verplichte output.', findings);

    const allowed = new Set(role.allowed ?? []);
    const conflicts = (role.forbidden ?? []).filter((action) => allowed.has(action));
    if (conflicts.length) {
      findings.push(finding('blocker', 'role_allowed_forbidden_conflict', role.id, `Rol ${role.id} heeft conflicterende acties: ${conflicts.join(', ')}.`, 'Verwijder de actie uit allowed of forbidden.'));
    }
  }
}

function validateGovernanceModel(model, findings) {
  requireList(model?.principles, 'high', 'governance_missing_principles', 'governance-model', 'Governanceprincipes ontbreken.', findings);
  requireList(model?.decision_rules, 'blocker', 'governance_missing_decision_rules', 'governance-model', 'Besluitregels ontbreken.', findings);
  requireList(model?.escalation_triggers, 'blocker', 'governance_missing_escalation', 'governance-model', 'Escalatietriggers ontbreken.', findings);
  requireList(model?.consistency_rules, 'blocker', 'governance_missing_consistency_rules', 'governance-model', 'Consistentieregels ontbreken.', findings);
}

function validateLifecycleModel(model, findings) {
  const states = model?.states ?? [];

  if (!states.length) {
    findings.push(finding('blocker', 'lifecycle_states_missing', 'lifecycle-model', 'Lifecycle-states ontbreken.', 'Definieer de vaste lifecycle-states.'));
    return;
  }

  for (const state of states) {
    if (!state.owner_role) {
      findings.push(finding('blocker', 'lifecycle_state_missing_owner', state.id, `Status ${state.id} mist eigenaar.`, 'Koppel een owner_role aan de status.'));
    }

    if (state.id !== 'done') {
      requireList(state.entry_criteria, 'blocker', 'lifecycle_missing_entry_criteria', state.id, `Status ${state.id} mist entry criteria.`, findings);
      requireList(state.exit_criteria, 'blocker', 'lifecycle_missing_exit_criteria', state.id, `Status ${state.id} mist exit criteria.`, findings);
      requireList(state.allowed_next, 'high', 'lifecycle_missing_allowed_next', state.id, `Status ${state.id} mist toegestane volgende statussen.`, findings);
    }

    requireList(state.allowed_roles, 'medium', 'lifecycle_missing_allowed_roles', state.id, `Status ${state.id} mist toegestane rollen.`, findings);
  }
}

function validateWorkPackageModel(model, findings) {
  requireList(model?.required_fields, 'blocker', 'work_package_required_fields_missing', 'work-package-model', 'Verplichte taakvelden ontbreken.', findings);
  requireList(model?.readiness_checks, 'blocker', 'readiness_checks_missing', 'work-package-model', 'Readiness checks ontbreken.', findings);
  requireList(model?.split_rules, 'high', 'split_rules_missing', 'work-package-model', 'Splitregels ontbreken.', findings);
  requireList(model?.definition_of_ready, 'blocker', 'definition_of_ready_missing', 'work-package-model', 'Definition of Ready ontbreekt.', findings);
  requireList(model?.definition_of_done, 'blocker', 'definition_of_done_missing', 'work-package-model', 'Definition of Done ontbreekt.', findings);
}

function validateReportingModel(model, findings) {
  requireList(model?.report_types, 'blocker', 'report_types_missing', 'reporting-model', 'Rapportagesoorten ontbreken.', findings);
  requireList(model?.release_readiness_inputs, 'high', 'release_inputs_missing', 'reporting-model', 'Release-readiness inputs ontbreken.', findings);
}

function validateAppWorkPackages(workPackages, findings) {
  for (const item of workPackages) {
    requireList(item.acceptanceCriteria, 'blocker', 'task_missing_acceptance_criteria', item.id, `Taak ${item.id} mist acceptatiecriteria.`, findings);
    requireList(item.testCriteria, 'blocker', 'task_missing_test_criteria', item.id, `Taak ${item.id} mist testcriteria.`, findings);

    if (!item.owner) {
      findings.push(finding('blocker', 'task_missing_owner', item.id, `Taak ${item.id} mist eigenaar.`, 'Wijs een eigenaar toe.'));
    }
    if (!item.reviewer) {
      findings.push(finding('blocker', 'task_missing_reviewer', item.id, `Taak ${item.id} mist reviewer.`, 'Wijs een reviewer toe.'));
    }
  }
}

function requireList(value, severity, code, subject, message, findings) {
  if (!Array.isArray(value) || value.length === 0) {
    findings.push(finding(severity, code, subject, message, 'Vul de ontbrekende lijst aan in het source-model.'));
  }
}

function finding(severity, code, subject, explanation, recommendation) {
  return {
    id: `${code}:${subject}`,
    severity,
    code,
    subject,
    explanation,
    recommendation,
    status: 'open'
  };
}

