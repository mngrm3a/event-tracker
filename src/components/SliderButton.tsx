import { useEffect, useRef, useState } from 'react';
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
  const [isComplete, setIsComplete] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const isResettingRef = useRef(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sliderRef.current) sliderRef.current.value = '0';
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isResettingRef.current) return;
    setIsComplete(Number(e.target.value) > 99);
  };

  const animateReset = (onComplete: () => void, duration: number) => {
    if (!sliderRef.current) return;

    const start = sliderRef.current.valueAsNumber;
    const startTime = performance.now();

    const step = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const nextVal = Math.round(start * (1 - progress));

      sliderRef.current!.value = String(nextVal);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        onComplete?.();
      }
    };

    requestAnimationFrame(step);
  };

  const handlePointerUp = () => {
    if (isResettingRef.current) return;

    isResettingRef.current = true;
    setIsResetting(true);
    setIsComplete(false);
    if (isComplete) onSlideComplete?.();

    animateReset(
      () => {
        if (sliderRef.current) sliderRef.current.value = '0';
        isResettingRef.current = false;
        setIsResetting(false);
      },
      delay !== undefined && delay > -1 ? delay : 0,
    );
  };

  return (
    <div className="relative flex flex-1">
      <span
        className={clsx(
          'absolute pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-[4rem] text-shadow-lg transition-colors duration-1000',
          isComplete ? 'text-success' : 'text-primary',
        )}
      >
        {counter}
      </span>
      <input
        ref={sliderRef}
        type="range"
        min={0}
        max={100}
        step={1}
        onInput={handleInput}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={clsx(
          styles['slider-track'],
          styles['slider-thumb'],
          isComplete && styles['slider-thumb-complete'],
          isResetting && styles['slider-thumb-resetting'],
        )}
      />
    </div>
  );
};
