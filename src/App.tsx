import { DebugView } from '@/components/DebugView';
import { SliderButton } from '@/components/SliderButton';
import { StackLayout } from '@/components/StackLayout';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { useStore } from '@/hooks/useStore';
import { CurrentDateProvider } from '@/providers/CurrentDateProvider';
import { StoreProvider } from '@/providers/StoreProvider';

const App = () => (
  <CurrentDateProvider>
    <StoreProvider>
      <AppWithContext />
    </StoreProvider>
  </CurrentDateProvider>
);
export default App;

const AppWithContext = () => {
  const currentDate = useCurrentDate();
  const { isReady, chartData, saveEvent } = useStore();

  const handleOnSwipeComplete = () => {
    saveEvent(new Date(), 'default');
  };

  return (
    <StackLayout>
      <></>
      <DebugView
        currentDate={currentDate}
        isReady={isReady}
        chartData={chartData}
      />
      <SliderButton delay={1500} onSlideComplete={handleOnSwipeComplete} />
    </StackLayout>
  );
};
