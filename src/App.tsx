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
          <></>
        </StackLayout>
      </StoreProvider>
    </CurrentDateProvider>
  );
}

export default App;
