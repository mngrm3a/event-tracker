import type { HourData } from '@/types';
import { createAlternatingArray } from '@/utils';
import {
  ArcElement,
  RadialLinearScale,
  Chart,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import { useMemo } from 'react';

import { PolarArea } from 'react-chartjs-2';

Chart.register(RadialLinearScale, ArcElement);

export interface TodayViewProps {
  data: HourData;
  barColor1: string;
  barColor2: string;
  labelSize: number;
  labelColor: string;
}

export const TodayView = ({
  data,
  barColor1,
  barColor2,
  labelSize,
  labelColor,
}: TodayViewProps) => {
  const chartData: ChartData<'polarArea'> = useMemo(
    () => ({
      labels: Array.from({ length: 24 }, (_, i) => `${(i + 12) % 24}`),
      datasets: [
        {
          label: 'Hour Data',
          data: [...data.slice(12), ...data.slice(0, 12)],
          backgroundColor: createAlternatingArray(24, barColor1, barColor2),
          borderWidth: 1,
        },
      ],
    }),
    [data, barColor1, barColor2],
  );
  const chartOptions: ChartOptions<'polarArea'> = useMemo(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {
        r: {
          ticks: {
            display: true,
          },
          pointLabels: {
            display: true,
            font: {
              size: labelSize,
            },
            color: labelColor,
          },
        },
      },
    }),
    [labelSize, labelColor],
  );

  return <PolarArea data={chartData} options={chartOptions} />;
};
