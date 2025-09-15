import type { ReactNode } from 'react';

export const LoadingWrapper: React.FC<{
  children: ReactNode;
  status: boolean;
}> = ({ children, status }) => {
  return status ? (
    <>{children}</>
  ) : (
    <div className="flex w-full h-full items-center justify-center bg-base">
      <div role="status" aria-label="Loading" className="flex items-center">
        <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
};
