import { DebugWrapper } from '@/components/DebugWrapper';
import { SliderButton } from '@/components/SliderButton';
import { StackLayout } from '@/components/StackLayout';
import { useToday } from '@/hooks/useToday';
import { useStore } from '@/hooks/useStore';
import { TodayProvider } from '@/providers/TodayProvider';
import { StoreProvider } from '@/providers/StoreProvider';
import { TodayChart } from '@/components/TodayChart';
import { LoadingWrapper } from '@/components/LoadingWrapper';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  RadialLinearScale,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Carousel, CarouselSlide } from '@/components/Carousel';
import { BarChart } from '@/components/BarChart';

Chart.register(
  RadialLinearScale,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels,
);
const App = () => (
  <TodayProvider resolution={60000}>
    <StoreProvider>
      <AppWithContext />
    </StoreProvider>
  </TodayProvider>
);
export default App;

const AppWithContext = () => {
  const today = useToday();
  const { isReady, countsByPeriod, saveEvent } = useStore();

  const handleOnSwipeComplete = () => {
    saveEvent(new Date());
  };

  return (
    <LoadingWrapper status={isReady}>
      <DebugWrapper
        today={today}
        isReady={isReady}
        countsByPeriod={countsByPeriod}
      >
        <StackLayout>
          <Carousel>
            <CarouselSlide>
              <BarChart
                data={countsByPeriod.weekData}
                labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
              />
            </CarouselSlide>
            <CarouselSlide>
              <BarChart
                data={countsByPeriod.monthData}
                labels={Array(31)
                  .fill(0)
                  .map((_, i) => String(i + 1))}
              />
            </CarouselSlide>
            <CarouselSlide>
              <BarChart
                data={countsByPeriod.yearData}
                labels={[
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ]}
              />
            </CarouselSlide>
          </Carousel>
          <TodayChart data={countsByPeriod.hourData} />
          <SliderButton
            counter={countsByPeriod.todayData}
            onSlideComplete={handleOnSwipeComplete}
            delay={500}
          />
        </StackLayout>
      </DebugWrapper>
    </LoadingWrapper>
  );
};
