import { useState } from 'react';
import styles from '@/components/SliderButton.module.css';

export type SliderButtonProps = {
  onSlideComplete?: () => void;
  delay?: number;
};

export const SliderButton = ({ onSlideComplete, delay }: SliderButtonProps) => {
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
    <input
      type="range"
      min={0}
      max={100}
      step={1}
      value={value}
      onInput={handleInput}
      onPointerUp={handlePointerUp}
      disabled={isResetting}
      className={`${styles.slider} ${completed ? styles.completed : ''}`}
    />
  );
};
