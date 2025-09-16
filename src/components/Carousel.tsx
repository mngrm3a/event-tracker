import { clsx } from 'clsx';
import {
  useState,
  cloneElement,
  type ReactElement,
  type ReactNode,
} from 'react';

interface CarouselSlideProps {
  active?: boolean;
  children?: ReactNode;
}

export const CarouselSlide = ({ active, children }: CarouselSlideProps) => {
  return (
    <div className={clsx('w-full h-full', active ? 'block' : 'hidden')}>
      {children}
    </div>
  );
};

interface CarouselProps {
  children: ReactElement<CarouselSlideProps>[];
}

export const Carousel = ({ children }: CarouselProps) => {
  const [activeSlide, setActiveSlide] = useState(() => {
    const initialIndex = children.findIndex((child) => child.props.active);
    return initialIndex >= 0 ? initialIndex : 0;
  });
  const totalSlides = children.length;

  if (children.length === 0) return null;

  const goPrev = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goNext = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className="relative px-5 flex-shrink-0 h-full">
      <CarouselButton position="left" onClick={goPrev} />
      <CarouselButton position="right" onClick={goNext} />
      <div className="w-full h-full">
        {children.map((child, index) =>
          cloneElement(child, {
            active: index === activeSlide,
            key: child.key ?? index,
          }),
        )}
      </div>
    </div>
  );
};

interface CarouselButtonProps {
  position: 'left' | 'right';
  onClick?: () => void;
}

const CarouselButton = ({ position, onClick }: CarouselButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-secondary-light hover:text-secondary transition-colors duration-500',
        position === 'left' ? '-left-3' : '-right-3',
      )}
    >
      <svg
        width="64"
        height="128"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={position === 'left' ? 'M9 22 L6 12 L9 2' : 'M15 22 L18 12 L15 2'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};
