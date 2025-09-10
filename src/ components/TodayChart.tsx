import { PolarArea } from 'react-chartjs-2';
import {
  ArcElement,
  Chart as ChartJS,
  RadialLinearScale,
  type ChartData,
} from 'chart.js';
import type { BuildTuple } from '../utils';

ChartJS.register(RadialLinearScale, ArcElement);

export type TodayData = BuildTuple<24, number>;

type TodayChartProps = {
  data: TodayData;
};

export function TodayChart(props: TodayChartProps) {
  return <PolarArea data={makeData(props.data)}></PolarArea>;
}

function makeData(
  dataSet: TodayData,
): ChartData<'polarArea', number[], string> {
  return {
    // Shift labels to start at 12
    labels: Array.from({ length: 24 }, (_, i) => `${(i + 12) % 24}`),
    datasets: [
      {
        label: 'Hourly Data',
        data: dataSet,
        backgroundColor: Array(24).fill('rgba(96, 165, 250, 0.25)'),
        // backgroundColor: Array(24).fill('#60a5fa'),
      },
    ],
  };
}
