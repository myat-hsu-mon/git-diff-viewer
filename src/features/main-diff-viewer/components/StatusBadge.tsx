import React from 'react';
//components
import { StatusBadge as UIStatusBadge } from '@/components/ui/Badge';
//types
import type { DiffStatus } from '@/features/main-diff-viewer/types/diff';

interface StatusBadgeProps {
  status: DiffStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, size = 'sm', showIcon = true, className }, ref) => {
    return (
      <UIStatusBadge
        ref={ref}
        status={status}
        size={size}
        showIcon={showIcon}
        className={className}
      />
    );
  }
);
