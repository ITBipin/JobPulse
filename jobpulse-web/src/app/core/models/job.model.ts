export type JobFreshnessStatus = 'Fresh' | 'Stale' | 'Expired';

export interface JobFreshnessDto {
  jobId: string;
  lastSeenAt: string;
  status: JobFreshnessStatus;
}

export interface JobListItemDto {
  id: string;
  title: string;
  companyName: string;
  technology: string;
  location: string;
  experienceRange: string;
  source: string;
  collectedAtUtc: string;
  originalPostedDateUtc?: string | null;
  employmentType?: string | null;
  workMode?: string | null;
  jobUrl?: string | null;
  dataQualityStatus: string;
}

export interface JobListResponse {
  items: JobListItemDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface JobListQuery {
  search?: string;
  technology?: string;
  location?: string;
  experience?: string;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface JobTechnologyDto {
  id: string;
  name: string;
}

export interface JobLocationDto {
  id: string;
  city: string;
  state?: string | null;
  country: string;
  region?: string | null;
}

export interface JobSourceDto {
  id: string;
  name: string;
  websiteUrl?: string | null;
}

export interface JobListingDto {
  id: string;
  title: string;
  companyName: string;
  jobUrl?: string | null;
  sourceIdentifier?: string | null;
  collectedAtUtc: string;
  originalPostedDateUtc?: string | null;
  dataQualityStatus: string;
  workMode?: string | null;
  employmentType?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  description?: string | null;
  technology: JobTechnologyDto;
  location: JobLocationDto;
  experienceRange: string;
  source: JobSourceDto;
}

export interface JobListingImportError {
  rowNumber: number;
  reason: string;
}

export interface JobListingImportSummary {
  totalRows: number;
  importedRows: number;
  skippedRows: number;
  duplicateRows: number;
  invalidRows: number;
  errors: JobListingImportError[];
  importBatchId?: string | null;
}
