import { ExperienceRangeOption } from './experience-range.model';

export type JobSearchStatus = 'OpenToWork' | 'NotLooking' | 'Hired' | string;

export type ExperienceTier = ExperienceRangeOption;
export type { ExperienceRangeOption };

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
