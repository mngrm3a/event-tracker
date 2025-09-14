import { DebugView } from '@/components/DebugView';
import { SliderButton } from '@/components/SliderButton';
import { StackLayout } from '@/components/StackLayout';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { useStore } from '@/hooks/useStore';
import { CurrentDateProvider } from '@/providers/CurrentDateProvider';
import { StoreProvider } from '@/providers/StoreProvider';
import { themeColors } from '@/themeColors';
import { TodayView } from '@/components/TodayView';

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
  const { isReady, countsByPeriod, saveEvent } = useStore();

  const handleOnSwipeComplete = () => {
    saveEvent(new Date(), 'default');
  };

  return (
    <StackLayout>
      <DebugView
        currentDate={currentDate}
        isReady={isReady}
        countsByPeriod={countsByPeriod}
      />
      <TodayView
        data={countsByPeriod.hourData}
        barColor1={oklchSetAlpha(themeColors['primary'], 0.6)}
        barColor2={oklchSetAlpha(themeColors['primary-light'], 0.6)}
        labelColor={themeColors['neutral']}
        labelSize={12}
      />
      <SliderButton
        counter={countsByPeriod.todayData}
        onSlideComplete={handleOnSwipeComplete}
        delay={1000}
      />
    </StackLayout>
  );
};

function oklchSetAlpha(color: string, alpha: number): string {
  // Remove trailing spaces just in case
  color = color.trim();

  // If color already has a slash, replace alpha
  if (color.includes('/')) {
    return color.replace(/\/\s*[\d.]+/, `/ ${alpha}`);
  }

  // Insert alpha using the modern / <alpha> syntax
  // e.g., "oklch(70.7% 0.165 254.624)" → "oklch(70.7% 0.165 254.624 / 0.5)"
  return color.replace(/\)$/, ` / ${alpha})`);
}
