import type { CountsByPeriod } from '@/types';

export interface DebugViewProps {
  currentDate: Date;
  isReady: boolean;
  countsByPeriod: CountsByPeriod;
}
export const DebugView = ({
  currentDate,
  isReady,
  countsByPeriod,
}: DebugViewProps) => {
  return (
    <div className="block">
      <div className="grid grid-cols-3 gap-4">
        <DisplayText
          label="Date"
          data={currentDate.toLocaleDateString()}
        ></DisplayText>
        <DisplayText label="Ready" data={isReady}></DisplayText>
        <DisplayText
          label="Today"
          data={countsByPeriod.todayData}
        ></DisplayText>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <DisplayList label="Hour" data={countsByPeriod.hourData} />
        <DisplayList label="Week" data={countsByPeriod.weekData} />
        <DisplayList label="Month" data={countsByPeriod.monthData} />
        <DisplayList label="Year" data={countsByPeriod.yearData} />
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
