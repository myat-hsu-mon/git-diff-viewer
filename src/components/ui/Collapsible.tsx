import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface CollapsibleProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  trigger?: React.ReactNode;
  showIcon?: boolean;
}

export default function Collapsible({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  className,
  trigger,
  showIcon = true,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<number | undefined>(controlledOpen ? undefined : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleToggle = () => {
    const newOpen = !isOpen;
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className={cn(
        'w-full',
        className,
        !className?.includes('border-0') && 'border-[#EDEEEF] dark:border-[#1E2429]'
      )}
    >
      {trigger && (
        <button
          type='button'
          onClick={handleToggle}
          className='flex w-full items-center gap-2 p-2 text-left hover:bg-accent/50 rounded-md transition-colors'
          aria-expanded={isOpen}
          aria-controls='collapsible-content'
        >
          {showIcon && (
            <div className='flex-shrink-0'>
              {isOpen ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
            </div>
          )}
          <div className='flex-1'>{trigger}</div>
        </button>
      )}
      <div
        id='collapsible-content'
        ref={contentRef}
        className='overflow-hidden transition-all duration-200 ease-in-out'
        style={{ height: height !== undefined ? `${height}px` : undefined }}
      >
        {children}
      </div>
    </div>
  );
}

export interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

export const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({
  children,
  isOpen,
  className,
  ...props
}) => {
  return (
    <button
      type='button'
      className={cn(
        'flex w-full items-center gap-2 p-2 text-left hover:bg-accent/50 rounded-md transition-colors',
        className
      )}
      aria-expanded={isOpen}
      {...props}
    >
      <div className='flex-shrink-0'>
        {isOpen ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
      </div>
      <div className='flex-1'>{children}</div>
    </button>
  );
};

export interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CollapsibleContent: React.FC<CollapsibleContentProps> = ({ children, className }) => {
  return <div className={cn('transition-all duration-200 ease-in-out', className)}>{children}</div>;
};
