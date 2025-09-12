export type ChartData = {
  todayData: number;
  hourData: HourData;
  weekData: WeekData;
  monthData: MonthData;
  yearData: YearData;
};

export type HourData = FixedLengthArray<number, 24>;
export type WeekData = FixedLengthArray<number, 7>;
export type MonthData = FixedLengthArray<number, 31>;
export type YearData = FixedLengthArray<number, 12>;
