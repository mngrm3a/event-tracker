import type { FixedLengthArray } from '@/types/FixedLengthArray';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import React from 'react';

interface StackLayoutProps {
  children: FixedLengthArray<ReactNode, 3>;
  debug?: boolean;
}

export const StackLayout: React.FC<StackLayoutProps> = ({
  children,
  debug,
}) => {
  if (React.Children.count(children) !== 3) {
    throw new Error('StackLayout must have exactly 3 children');
  }

  const [topChild, midChild, bottomChild] = React.Children.toArray(children);

  return (
    <main className="flex flex-col justify-between w-full p-1">
      <section
        className={clsx(
          'max-h-1/4 overflow-hidden',
          debug && 'border border-red-500 border-dotted',
        )}
      >
        {topChild}
      </section>
      <section
        className={clsx(
          'flex-1 overflow-y-auto',
          debug && 'border border-red-500 border-dotted',
        )}
      >
        {midChild}
      </section>
      <section className={clsx(debug && 'border border-red-500 border-dotted')}>
        {bottomChild}
      </section>
    </main>
  );
};
