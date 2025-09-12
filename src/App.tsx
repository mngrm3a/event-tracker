import { SliderButton } from '@/components/SliderButton';
import { StackLayout } from '@/components/StackLayout';
import { CurrentDateProvider } from '@/providers/CurrentDateProvider';
import { StoreProvider } from '@/providers/StoreProvider';

function App() {
  return (
    <CurrentDateProvider>
      <StoreProvider>
        <StackLayout>
          <></>
          <></>
          <SliderButton delay={1500} />
        </StackLayout>
      </StoreProvider>
    </CurrentDateProvider>
  );
}

export default App;
