import { type ChartOptions, type ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { useMemo } from 'react';
import { themeColors } from '@/themeColors';
import { oklchSetAlpha } from '@/utils';

export interface BarChartProps {
  data: number[];
  labels: string[];
}

export const BarChart = ({ data, labels }: BarChartProps) => {
  const chartData: ChartData<'bar'> = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data,
          backgroundColor: data.map((_, i) =>
            i % 2 === 0
              ? oklchSetAlpha(themeColors['primary'], 0.6)
              : oklchSetAlpha(themeColors['primary-light'], 0.6),
          ),
          borderRadius: 2,
        },
      ],
    }),
    [data, labels],
  );

  const chartOptions: ChartOptions<'bar'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        datalabels: {
          color: themeColors['neutral'],
          anchor: 'end',
          align: 'end',
          formatter: (value: number) => {
            return value === 0 ? null : value;
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          display: false,
          suggestedMax: Math.max(...data) * 1.15,
        },
      },
    }),
    [data],
  );

  return (
    <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
  );
};
