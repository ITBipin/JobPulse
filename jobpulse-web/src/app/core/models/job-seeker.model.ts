export type JobSearchStatus = 'OpenToWork' | 'NotLooking' | 'Hired' | string;

export interface ExperienceTier {
  id: string;
  label: string;
}

export const DEFAULT_EXPERIENCE_TIERS: ExperienceTier[] = [
  { id: '11111111-1111-1111-1111-111111111111', label: '0-2 years (Entry Level)' },
  { id: '22222222-2222-2222-2222-222222222222', label: '2-5 years (Mid Level)' },
  { id: '33333333-3333-3333-3333-333333333333', label: '5-8 years (Senior)' },
  { id: '44444444-4444-4444-4444-444444444444', label: '8+ years (Lead / Principal)' }
];

export interface RegisterJobSeekerRequest {
  experienceRangeId: string;
  locationId: string;
  technologyIds: string[];
  jobSearchStatus: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  jobSearchStartDate?: string | null; // YYYY-MM-DD
  consent: boolean;
}

export interface JobSeekerRegistrationResponse {
  status: string;
  registeredAtUtc: string;
}

export interface UpdateJobSeekerStatusRequest {
  jobSeekerId: string;
  status: string;
}

export interface JobSeekerStatusUpdateResponse {
  status: string;
  lastConfirmedAt: string;
}

export interface ActiveJobSeekerCountResponse {
  count: number;
  lastUpdated: string;
  dataType: string;
  source: string;
  methodology: string;
  dataSource: string;
}
