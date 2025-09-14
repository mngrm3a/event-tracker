import { useState } from 'react';
import styles from './SliderButton.module.css';
import { clsx } from 'clsx';

export type SliderButtonProps = {
  counter: number;
  onSlideComplete?: () => void;
  delay?: number;
};

export const SliderButton = ({
  counter,
  onSlideComplete,
  delay,
}: SliderButtonProps) => {
  const [value, setValue] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isResetting) return;
    const val = Number(e.target.value);
    setCompleted(val > 99);
    setValue(val);
  };

  const handlePointerUp = () => {
    if (isResetting) return;
    if (value >= 99) {
      setIsResetting(true);
      onSlideComplete?.();
      setTimeout(
        () => {
          setValue(0);
          setCompleted(false);
          setIsResetting(false);
        },
        !delay || delay < 0 ? 0 : delay,
      );
    } else {
      setValue(0);
    }
  };

  return (
    <div className="relative flex flex-1 w-full h-full">
      <span
        className={clsx(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-[4rem] text-shadow-lg transition-colors duration-1000',
          completed ? 'text-success' : 'text-primary',
        )}
      >
        {counter}
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onInput={handleInput}
        onPointerUp={handlePointerUp}
        disabled={isResetting}
        className={clsx(
          styles['slider-track'],
          styles['slider-thumb'],
          completed && styles['slider-thumb-complete'],
        )}
      />
    </div>
  );
};
