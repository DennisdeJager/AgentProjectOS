export type Severity = 'blocker' | 'high' | 'medium' | 'low';

export interface VersionInfo {
  appId: string;
  name: string;
  version: string;
  versionedAt: string;
}

export interface SourceModel {
  id: string;
  fileName: string;
  path: string;
  kind: string;
  schemaVersion: string;
  sourceStatus: string;
  versionedAt: string;
  stats: {
    sections: number;
    items: number;
  };
  data: Record<string, unknown>;
}

export interface ValidationFinding {
  id: string;
  severity: Severity;
  code: string;
  subject: string;
  explanation: string;
  recommendation: string;
  status: string;
}

export interface ValidationResult {
  status: 'passed' | 'failed';
  generatedAt: string;
  summary: Record<Severity | 'total', number>;
  findings: ValidationFinding[];
}

export interface WorkPackage {
  id: string;
  title: string;
  goal: string;
  context: string;
  nonGoals: string[];
  filesInScope: string[];
  filesOutOfScope: string[];
  dependencies: string[];
  acceptanceCriteria: string[];
  testCriteria: string[];
  allowedRole: string;
  reviewerRole: string;
  risks: string[];
  expectedOutput: string;
  reportingFormat: string;
  lifecycleState: string;
  status: string;
  owner: string;
  reviewer: string;
  confidence: 'low' | 'medium' | 'high';
  blockers: string[];
}

export interface Decision {
  id: string;
  title: string;
  status: string;
  ownerRole: string;
  context: string;
  decision: string;
  consequences: string;
  relatedWorkPackages: string[];
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: string;
  likelihood: string;
  ownerRole: string;
  mitigation: string;
  status: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface DomainRole {
  id: string;
  domain: string;
  defaultRole: string;
  status: string;
}

export interface AppSettings {
  auth: {
    provider: string;
    clientIdConfigured: boolean;
    clientSecretConfigured: boolean;
    bootstrapFirstAdmin: boolean;
  };
  llm: {
    selectedProvider: string;
    selectedModel: string;
    fallbackModel: string;
    temperature: number;
    recommendation: string;
  };
  ui: {
    theme: 'light' | 'dark' | 'system';
  };
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  subject: string;
  details: Record<string, unknown>;
}

export interface AppDataState {
  version: string;
  createdAt: string;
  updatedAt: string;
  workPackages: WorkPackage[];
  decisions: Decision[];
  risks: Risk[];
  users: UserAccount[];
  domainRoles: DomainRole[];
  settings: AppSettings;
  audit: AuditEntry[];
}

export interface ProjectPayload {
  version: VersionInfo;
  models: SourceModel[];
  appData: AppDataState;
  validation: ValidationResult;
}

export type CollectionName = 'work-packages' | 'decisions' | 'risks' | 'users' | 'domain-roles';

