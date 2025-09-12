import type { ChartData } from '@/types';

export interface DebugViewProps {
  currentDate: Date;
  isReady: boolean;
  chartData: ChartData;
}
export const DebugView = ({
  currentDate,
  isReady,
  chartData,
}: DebugViewProps) => {
  return (
    <div className="block">
      <div className="grid grid-cols-3 gap-4">
        <DisplayText
          label="Date"
          data={currentDate.toLocaleDateString()}
        ></DisplayText>
        <DisplayText label="Ready" data={isReady}></DisplayText>
        <DisplayText label="Today" data={chartData.todayData}></DisplayText>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <DisplayList label="Hour" data={chartData.hourData} />
        <DisplayList label="Week" data={chartData.weekData} />
        <DisplayList label="Month" data={chartData.monthData} />
        <DisplayList label="Year" data={chartData.yearData} />
      </div>
    </div>
  );
};

type DisplayProps<T> = {
  label: string;
  data: T;
};

function DisplayText<T>({ label, data: value }: DisplayProps<T>) {
  return (
    <span>
      <span className="font-semibold">{label}</span>
      <span>: {String(value)}</span>
    </span>
  );
}

function DisplayList<T>({ label, data: value }: DisplayProps<T[]>) {
  return (
    <span>
      <p className="font-semibold">{label}</p>
      <ul className="list-decimal marker:italic">
        {value.map((value, index) => {
          return (
            <li key={index} className="font-mono ml-12">
              {String(value)}
            </li>
          );
        })}
      </ul>
    </span>
  );
}
