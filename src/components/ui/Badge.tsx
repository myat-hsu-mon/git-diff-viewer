import React from 'react';
import { cn } from '@/utils/cn';
import type { DiffStatus } from '@/types/diff';
import { getStatusColor } from '@/utils/diff';
import { FilePlus, FileMinus, FileEdit, FileCheck, Copy } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

    const variants = {
      default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive:
        'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      outline: 'text-foreground',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export interface StatusBadgeProps extends Omit<BadgeProps, 'children'> {
  status: DiffStatus;
  showIcon?: boolean;
}

const statusIcons = {
  ADDED: FilePlus,
  MODIFIED: FileEdit,
  REMOVED: FileMinus,
  RENAMED: FileCheck,
  COPIED: Copy,
};

export const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, showIcon = true, size = 'sm', className, ...props }, ref) => {
    const Icon = statusIcons[status];
    const statusColors = getStatusColor(status);

    return (
      <Badge ref={ref} className={cn(statusColors, className)} size={size} {...props}>
        {showIcon && Icon && <Icon className='mr-1 h-3 w-3' />}
        {status.toLowerCase()}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

export { Badge };
