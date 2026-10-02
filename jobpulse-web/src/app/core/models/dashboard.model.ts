export interface TechnologyJobCount {
  technologyId: string;
  technologyName: string;
  jobCount: number;
}

export interface CityJobCount {
  locationId: string;
  city: string;
  state?: string | null;
  jobCount: number;
}

export interface DashboardOverviewResponse {
  activeRegisteredJobSeekers: number;
  activeTrackedJobListings: number;
  newListingsLast7Days: number;
  newListingsLast30Days: number;
  topTechnologies: TechnologyJobCount[];
  topLocations: CityJobCount[];
  lastDataUpdate?: string | null;
  dataSource: string;
  dataType: string;
}

export interface DashboardTrendPoint {
  snapshotDate: string; // YYYY-MM-DD
  activeTrackedJobs: number;
  activeRegisteredJobSeekers: number;
  newJobsLast7Days: number;
  newJobsLast30Days: number;
}

export interface DashboardTrendsResponse {
  from: string;
  to: string;
  dataSource: string;
  dataType: string;
  lastUpdated?: string | null;
  data: DashboardTrendPoint[];
}

export interface DashboardTrendsQuery {
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
}

export interface JobMarketPressureSampleSize {
  activeRegisteredJobSeekers: number;
  activeTrackedJobListings: number;
}

export interface JobMarketPressureFilters {
  technologyId?: string | null;
  locationId?: string | null;
  experienceRangeId?: string | null;
}

export interface JobMarketPressureMetadata {
  scope: string;
  source: string;
  methodology: string;
  unavailableReason?: string | null;
  dataSource: string;
  dataType: string;
}

export interface JobMarketPressureRatioResponse {
  ratio: number | null;
  isAvailable: boolean;
  sampleSize: JobMarketPressureSampleSize;
  filters: JobMarketPressureFilters;
  metadata: JobMarketPressureMetadata;
  dataSource: string;
  dataType: string;
}

export interface JobMarketPressureRatioQuery {
  technologyId?: string;
  locationId?: string;
  experienceRangeId?: string;
}
