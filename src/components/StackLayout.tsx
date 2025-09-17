import type { FixedLengthArray } from '@/types/FixedLengthArray';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import React from 'react';

interface StackLayoutProps {
  children: FixedLengthArray<ReactNode, 3>;
  debug?: boolean;
}

export const StackLayout = ({ children }: StackLayoutProps) => {
  if (React.Children.count(children) !== 3) {
    throw new Error('StackLayout must have exactly 3 children');
  }

  const [topChild, midChild, bottomChild] = React.Children.toArray(children);

  return (
    <main className="flex flex-col justify-between w-full px-1 pb-6 pt-2">
      <section className={clsx('h-1/4 overflow-hidden')}>{topChild}</section>
      <section className={clsx('flex-1 overflow-y-auto')}>{midChild}</section>
      <section className={clsx()}>{bottomChild}</section>
    </main>
  );
};
