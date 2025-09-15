import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';
import { ButtonProps } from '../Button';

// Mock the DiffViewerContext
const mockSetTheme = vi.fn();
const mockTheme = { theme: 'light' };

vi.mock('@/features/main-diff-viewer/contexts/DiffViewerContext', () => ({
  useDiffViewerContext: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

vi.mock('../Button', () => ({
  Button: ({ children, onClick, className, variant, size, ...props }: ButtonProps) => (
    <button
      onClick={onClick}
      className={className}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme.theme = 'light';
  });

  describe('rendering', () => {
    it('should render the toggle button', () => {
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should render with correct structure', () => {
      render(<ThemeToggle />);

      const container = screen.getByRole('button').parentElement;
      expect(container).toHaveClass('flex', 'items-center', 'gap-2');
    });
  });

  describe('button properties', () => {
    it('should pass correct props to Button component', () => {
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'ghost');
      expect(button).toHaveAttribute('data-size', 'sm');
      expect(button).toHaveClass('p-2');
    });

    it('should be clickable', () => {
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });
});
