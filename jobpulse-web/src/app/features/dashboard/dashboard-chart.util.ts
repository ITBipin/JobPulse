import { EChartsOption } from 'echarts';
import { DashboardTrendPoint, TechnologyJobCount, CityJobCount } from '../../core/models/dashboard.model';

export function buildTrendsChartOptions(
  data: DashboardTrendPoint[],
  isDark = false
): EChartsOption {
  if (!data || data.length === 0) {
    return {};
  }

  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridLineColor = isDark ? '#1e293b' : '#f1f5f9';
  const dates = data.map(d => d.snapshotDate);
  const trackedJobs = data.map(d => d.activeTrackedJobs);
  const seekers = data.map(d => d.activeRegisteredJobSeekers);
  const newJobs7d = data.map(d => d.newJobsLast7Days);

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      textStyle: { color: textColor },
      axisPointer: { type: 'cross', label: { backgroundColor: '#0284c7' } }
    },
    legend: {
      data: ['Active Tracked Jobs', 'Registered Seekers', 'New Jobs (7 Days)'],
      textStyle: { color: textColor },
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: isDark ? '#475569' : '#cbd5e1' } },
      axisLabel: { color: textColor }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: gridLineColor } },
      axisLabel: { color: textColor }
    },
    series: [
      {
        name: 'Active Tracked Jobs',
        type: 'line',
        smooth: true,
        data: trackedJobs,
        itemStyle: { color: '#0284c7' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(2, 132, 199, 0.25)' },
              { offset: 1, color: 'rgba(2, 132, 199, 0.01)' }
            ]
          }
        }
      },
      {
        name: 'Registered Seekers',
        type: 'line',
        smooth: true,
        data: seekers,
        itemStyle: { color: '#16a34a' }
      },
      {
        name: 'New Jobs (7 Days)',
        type: 'line',
        smooth: true,
        lineStyle: { type: 'dashed' },
        data: newJobs7d,
        itemStyle: { color: '#d97706' }
      }
    ]
  };
}

export function buildTechDistributionOptions(
  data: TechnologyJobCount[],
  isDark = false
): EChartsOption {
  if (!data || data.length === 0) {
    return {};
  }

  const textColor = isDark ? '#cbd5e1' : '#475569';
  const sorted = [...data].slice(0, 8).reverse();
  const names = sorted.map(d => d.technologyName);
  const counts = sorted.map(d => d.jobCount);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      textStyle: { color: textColor }
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: isDark ? '#1e293b' : '#f1f5f9' } },
      axisLabel: { color: textColor }
    },
    yAxis: {
      type: 'category',
      data: names,
      axisLabel: { color: textColor, fontWeight: 500 }
    },
    series: [
      {
        name: 'Openings',
        type: 'bar',
        data: counts,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#0284c7' },
              { offset: 1, color: '#38bdf8' }
            ]
          }
        },
        label: {
          show: true,
          position: 'right',
          color: textColor,
          formatter: '{c}'
        }
      }
    ]
  };
}

export function buildCityDistributionOptions(
  data: CityJobCount[],
  isDark = false
): EChartsOption {
  if (!data || data.length === 0) {
    return {};
  }

  const textColor = isDark ? '#cbd5e1' : '#475569';
  const sorted = [...data].slice(0, 8).reverse();
  const names = sorted.map(d => d.city);
  const counts = sorted.map(d => d.jobCount);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      textStyle: { color: textColor }
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: isDark ? '#1e293b' : '#f1f5f9' } },
      axisLabel: { color: textColor }
    },
    yAxis: {
      type: 'category',
      data: names,
      axisLabel: { color: textColor, fontWeight: 500 }
    },
    series: [
      {
        name: 'Openings',
        type: 'bar',
        data: counts,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#059669' },
              { offset: 1, color: '#34d399' }
            ]
          }
        },
        label: {
          show: true,
          position: 'right',
          color: textColor,
          formatter: '{c}'
        }
      }
    ]
  };
}
