import { DebugWrapper } from '@/components/DebugWrapper';
import { SliderButton } from '@/components/SliderButton';
import { StackLayout } from '@/components/StackLayout';
import { useToday } from '@/hooks/useToday';
import { useStore } from '@/hooks/useStore';
import { TodayProvider } from '@/providers/TodayProvider';
import { StoreProvider } from '@/providers/StoreProvider';
import { themeColors } from '@/themeColors';
import { TodayView } from '@/components/TodayView';
import { LoadingWrapper } from '@/components/LoadingWrapper';

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
    saveEvent(new Date(), 'default');
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
            delay={500}
          />
        </StackLayout>
      </DebugWrapper>
    </LoadingWrapper>
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
