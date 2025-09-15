import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, StatusBadge } from '../Badge';

describe('Badge', () => {
  it('renders with children', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Badge variant='default'>Primary</Badge>);
    expect(screen.getByText('Primary')).toHaveClass('bg-primary');

    rerender(<Badge variant='secondary'>Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');

    rerender(<Badge variant='destructive'>Destructive</Badge>);
    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive');

    rerender(<Badge variant='outline'>Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveClass('text-foreground');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Badge size='sm'>Small</Badge>);
    expect(screen.getByText('Small')).toHaveClass('px-2 py-0.5 text-xs');

    rerender(<Badge size='md'>Medium</Badge>);
    expect(screen.getByText('Medium')).toHaveClass('px-2.5 py-0.5 text-xs');

    rerender(<Badge size='lg'>Large</Badge>);
    expect(screen.getByText('Large')).toHaveClass('px-3 py-1 text-sm');
  });

  it('applies custom className', () => {
    render(<Badge className='custom-class'>Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Badge ref={ref}>Ref test</Badge>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it('has correct default props', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('border-transparent bg-primary'); // default variant
    expect(badge).toHaveClass('px-2.5 py-0.5 text-xs'); // default size
  });
});

describe('StatusBadge', () => {
  it('renders with status text', () => {
    render(<StatusBadge status='ADDED' />);
    expect(screen.getByText('added')).toBeInTheDocument();
  });

  it('applies correct status colors', () => {
    const { rerender } = render(<StatusBadge status='ADDED' />);
    expect(screen.getByText('added')).toHaveClass('text-green-600');

    rerender(<StatusBadge status='MODIFIED' />);
    expect(screen.getByText('modified')).toHaveClass('text-yellow-600');

    rerender(<StatusBadge status='REMOVED' />);
    expect(screen.getByText('removed')).toHaveClass('text-red-600');

    rerender(<StatusBadge status='RENAMED' />);
    expect(screen.getByText('renamed')).toHaveClass('text-blue-600');

    rerender(<StatusBadge status='COPIED' />);
    expect(screen.getByText('copied')).toHaveClass('text-purple-600');
  });

  it('shows icon when showIcon is true', () => {
    render(<StatusBadge status='ADDED' showIcon={true} />);
    const icon = screen.getByText('added').querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('hides icon when showIcon is false', () => {
    render(<StatusBadge status='ADDED' showIcon={false} />);
    const icon = screen.getByText('added').querySelector('svg');
    expect(icon).not.toBeInTheDocument();
  });

  it('applies size correctly', () => {
    const { rerender } = render(<StatusBadge status='ADDED' size='sm' />);
    expect(screen.getByText('added')).toHaveClass('px-2 py-0.5 text-xs');

    rerender(<StatusBadge status='ADDED' size='lg' />);
    expect(screen.getByText('added')).toHaveClass('px-3 py-1 text-sm');
  });

  it('applies custom className', () => {
    render(<StatusBadge status='ADDED' className='custom-class' />);
    expect(screen.getByText('added')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<StatusBadge status='ADDED' ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});
