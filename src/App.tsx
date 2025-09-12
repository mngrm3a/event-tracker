import { SliderButton } from '@/components/SliderButton';
import { StackLayout } from '@/components/StackLayout';
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
  return (
    <StackLayout>
      <></>
      <></>
      <SliderButton delay={1500} />
    </StackLayout>
  );
};
