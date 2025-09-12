import { CurrentDateProvider } from '@/providers/CurrentDateProvider';
import { StoreProvider } from '@/providers/StoreProvider';

function App() {
  return (
    <CurrentDateProvider>
      <StoreProvider>
        <></>
      </StoreProvider>
    </CurrentDateProvider>
  );
}

export default App;
