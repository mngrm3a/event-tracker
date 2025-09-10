import SliderButton from './ components/SliderButton';
import { TodayChart, type TodayData } from './ components/TodayChart';

function App() {
  return (
    <>
      <section className="flex-grow bg-white p-4 overflow-hidden">
        <TodayChart data={Array(24).fill(7) as TodayData} />
      </section>
      <section className="bg-white rounded-b-lg shadow-lg p-4 flex-shrink-0">
        <SliderButton />
      </section>
    </>
  );
}

export default App;

function handleClick() {
  console.log('Clicked!');
}
