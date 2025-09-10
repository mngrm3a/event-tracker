import { useState } from 'react';

export default function SecureSlider() {
  const [value, setValue] = useState(0);
  const [status, setStatus] = useState('Slide to confirm');
  const [completed, setCompleted] = useState(false);

  const sliderBg = {
    background: `linear-gradient(to right,
      #60a5fa ${value}%,
      #60a5fa ${value}%,
      #d1d5db ${value}%,
      #d1d5db 100%)`,
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setValue(val);
  };

  const handleRelease = () => {
    if (value >= 99) {
      // Use 99 to account for potential float precision or slider jitter
      setCompleted(true);
      setStatus('Confirmed!');

      setTimeout(() => {
        setValue(0);
        setCompleted(false);
        setStatus('Slide to confirm');
      }, 1000);
    } else {
      setValue(0);
      setStatus('Slide to confirm');
    }
  };

  const handlePointerLeave = () => {
    // Trigger the same logic as release when pointer leaves the slider
    handleRelease();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onInput={handleInput}
        onPointerUp={handleRelease}
        onPointerLeave={handlePointerLeave}
        style={sliderBg}
        className={`slider-container w-full h-[36px] rounded-full appearance-none outline-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-12 [&::-webkit-slider-thumb]:h-12 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
          [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-12 [&::-moz-range-thumb]:h-12 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md
          ${
            completed
              ? '[&::-webkit-slider-thumb]:bg-green-400 [&::-webkit-slider-thumb]:border-green-400 [&::-moz-range-thumb]:bg-green-400 [&::-moz-range-thumb]:border-green-400'
              : '[&::-webkit-slider-thumb]:border-blue-400 [&::-moz-range-thumb]:border-blue-400'
          }`}
      />
      <p
        className={`text-center font-medium ${
          completed ? 'text-green-500' : 'text-gray-500'
        }`}
      >
        {status}
      </p>
    </div>
  );
}
