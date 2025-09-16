import { themeColors } from '@/themeColors';
import type { HourData } from '@/types';
import { oklchSetAlpha } from '@/utils';
import { type ChartOptions, type ChartData } from 'chart.js';
import { useMemo } from 'react';

import { PolarArea } from 'react-chartjs-2';

export interface TodayChartProps {
  data: HourData;
}

export const TodayChart = ({ data }: TodayChartProps) => {
  const chartData: ChartData<'polarArea'> = useMemo(
    () => ({
      labels: Array.from({ length: 24 }, (_, i) => `${(i + 12) % 24}`),
      datasets: [
        {
          data: [...data.slice(12), ...data.slice(0, 12)],
          backgroundColor: data.map((_: number, i: number) =>
            i % 2 === 0
              ? oklchSetAlpha(themeColors['primary'], 0.6)
              : oklchSetAlpha(themeColors['primary-light'], 0.6),
          ),
          borderWidth: 1,
          borderColor: themeColors['secondary'],
        },
      ],
    }),
    [data],
  );

  const chartOptions: ChartOptions<'polarArea'> = useMemo(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        datalabels: {
          color: themeColors['neutral'],
          anchor: 'end', // pushes label to outer radius
          align: 'end', // aligns with end of segment
          formatter: (value: number) => (value === 0 ? null : value), // hide 0
        },
      },
      scales: {
        r: {
          ticks: { display: false },
          pointLabels: { display: true, color: themeColors['neutral'] },
          grid: {
            color: (ctx) => {
              if (!ctx.tick) return themeColors['secondary-light'];
              return ctx.tick.value === ctx.scale.max
                ? themeColors['secondary']
                : themeColors['secondary-light'];
            },
            lineWidth: (ctx) =>
              ctx.tick && ctx.tick.value === ctx.scale.max ? 2 : 1,
          },
        },
      },
    }),
    [],
  );

  return <PolarArea data={chartData} options={chartOptions} />;
};
