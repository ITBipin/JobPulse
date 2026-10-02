import {
  buildTrendsChartOptions,
  buildTechDistributionOptions,
  buildCityDistributionOptions
} from './dashboard-chart.util';
import { DashboardTrendPoint, TechnologyJobCount, CityJobCount } from '../../core/models/dashboard.model';

describe('dashboard-chart.util', () => {
  it('should return empty object when trends data is empty', () => {
    const opts = buildTrendsChartOptions([]);
    expect(opts).toEqual({});
  });

  it('should build valid ECharts options for trends points', () => {
    const points: DashboardTrendPoint[] = [
      {
        snapshotDate: '2026-09-01',
        activeTrackedJobs: 100,
        activeRegisteredJobSeekers: 25,
        newJobsLast7Days: 10,
        newJobsLast30Days: 40
      },
      {
        snapshotDate: '2026-09-02',
        activeTrackedJobs: 110,
        activeRegisteredJobSeekers: 28,
        newJobsLast7Days: 12,
        newJobsLast30Days: 45
      }
    ];

    const opts = buildTrendsChartOptions(points, false);
    expect(opts.xAxis).toBeDefined();
    expect((opts.xAxis as any).data).toEqual(['2026-09-01', '2026-09-02']);
    expect(opts.series).toBeDefined();
    expect((opts.series as any[]).length).toBe(3);
  });

  it('should build valid ECharts options for technology distribution', () => {
    const techs: TechnologyJobCount[] = [
      { technologyId: '1', technologyName: '.NET Core', jobCount: 50 },
      { technologyId: '2', technologyName: 'Angular', jobCount: 40 }
    ];

    const opts = buildTechDistributionOptions(techs, true);
    expect(opts.series).toBeDefined();
    expect((opts.series as any[])[0].data).toEqual([40, 50]);
    expect((opts.yAxis as any).data).toEqual(['Angular', '.NET Core']);
  });

  it('should build valid ECharts options for city distribution', () => {
    const cities: CityJobCount[] = [
      { locationId: '1', city: 'Bengaluru', state: 'Karnataka', jobCount: 80 },
      { locationId: '2', city: 'Hyderabad', state: 'Telangana', jobCount: 60 }
    ];

    const opts = buildCityDistributionOptions(cities, false);
    expect(opts.series).toBeDefined();
    expect((opts.series as any[])[0].data).toEqual([60, 80]);
    expect((opts.yAxis as any).data).toEqual(['Hyderabad', 'Bengaluru']);
  });
});
