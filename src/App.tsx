import { DebugWrapper } from '@/components/DebugWrapper';
import { SliderButton } from '@/components/SliderButton';
import { StackLayout } from '@/components/StackLayout';
import { useToday } from '@/hooks/useToday';
import { useStore } from '@/hooks/useStore';
import { TodayProvider } from '@/providers/TodayProvider';
import { StoreProvider } from '@/providers/StoreProvider';
import { TodayChart } from '@/components/TodayChart';
import { LoadingWrapper } from '@/components/LoadingWrapper';
import { ArcElement, Chart, RadialLinearScale } from 'chart.js';

Chart.register(RadialLinearScale, ArcElement);

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
          <></>
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
