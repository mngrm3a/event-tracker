import type { HourData } from '@/types';
import {
  ArcElement,
  Legend,
  RadialLinearScale,
  Chart as ChartJS,
  type ChartData,
  type ChartOptions,
} from 'chart.js';

import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Legend);

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
  return (
    <PolarArea
      data={createChartData(data, barColor1, barColor2)}
      options={createChartOptions(labelSize, labelColor)}
    />
  );
};

const hourLabels = Array.from({ length: 24 }, (_, i) => `${(i + 12) % 24}`);

function createChartData(
  hourData: HourData,
  barColor1: string,
  barColor2: string,
): ChartData<'polarArea'> {
  return {
    labels: hourLabels,
    datasets: [
      {
        label: 'Hour Data',
        data: [...hourData.slice(12), ...hourData.slice(0, 12)],
        backgroundColor: createAlternatingArray(24, barColor1, barColor2),
        borderWidth: 1,
      },
    ],
  };
}

function createChartOptions(
  scaleLabelSize: number,
  scaleLabelColor: string,
): ChartOptions<'polarArea'> {
  return {
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
            size: scaleLabelSize,
          },
          color: scaleLabelColor,
        },
      },
    },
  };
}

function createAlternatingArray<T>(length: number, value1: T, value2: T): T[] {
  const result: T[] = [];
  for (let i = 0; i < length; i++) {
    result.push(i % 2 === 0 ? value1 : value2);
  }
  return result;
}
