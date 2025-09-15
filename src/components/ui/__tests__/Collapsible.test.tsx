import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Collapsible, { CollapsibleTrigger, CollapsibleContent } from '../Collapsible';

describe('Collapsible', () => {
  it('renders children when open', () => {
    render(
      <Collapsible open={true}>
        <div data-testid='content'>Collapsible content</div>
      </Collapsible>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders with default open state', () => {
    render(
      <Collapsible defaultOpen={true}>
        <div data-testid='content'>Collapsible content</div>
      </Collapsible>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('shows chevron icon when showIcon is true', () => {
    render(
      <Collapsible trigger={<button>Toggle</button>} showIcon={true}>
        <div data-testid='content'>Content</div>
      </Collapsible>
    );

    // Get the main trigger button by its aria-controls attribute
    const mainButton = document.querySelector(
      '[aria-controls="collapsible-content"]'
    ) as HTMLElement;
    const chevron = mainButton.querySelector('svg');
    expect(chevron).toBeInTheDocument();
  });

  it('hides chevron icon when showIcon is false', () => {
    render(
      <Collapsible trigger={<button>Toggle</button>} showIcon={false}>
        <div data-testid='content'>Content</div>
      </Collapsible>
    );

    // Get the main trigger button by its aria-controls attribute
    const mainButton = document.querySelector(
      '[aria-controls="collapsible-content"]'
    ) as HTMLElement;
    const chevron = mainButton.querySelector('svg');
    expect(chevron).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Collapsible className='custom-class'>
        <div data-testid='content'>Content</div>
      </Collapsible>
    );
    expect(screen.getByTestId('content').parentElement?.parentElement).toHaveClass('custom-class');
  });

  it('has correct ARIA attributes', () => {
    render(
      <Collapsible trigger={<button>Toggle</button>} open={true}>
        <div data-testid='content'>Content</div>
      </Collapsible>
    );

    // Get the main trigger button by its aria-controls attribute
    const trigger = document.querySelector('[aria-controls="collapsible-content"]') as HTMLElement;
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', 'collapsible-content');
  });
});

describe('CollapsibleTrigger', () => {
  it('renders with children', () => {
    render(<CollapsibleTrigger isOpen={false}>Trigger</CollapsibleTrigger>);
    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  it('shows correct chevron based on isOpen state', () => {
    const { rerender } = render(<CollapsibleTrigger isOpen={false}>Trigger</CollapsibleTrigger>);
    let chevron = screen.getByRole('button').querySelector('svg');
    expect(chevron).toBeInTheDocument();

    rerender(<CollapsibleTrigger isOpen={true}>Trigger</CollapsibleTrigger>);
    chevron = screen.getByRole('button').querySelector('svg');
    expect(chevron).toBeInTheDocument();
  });

  it('has correct ARIA attributes', () => {
    render(<CollapsibleTrigger isOpen={true}>Trigger</CollapsibleTrigger>);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies custom className', () => {
    render(
      <CollapsibleTrigger isOpen={false} className='custom-class'>
        Trigger
      </CollapsibleTrigger>
    );
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards additional props', () => {
    const handleClick = vi.fn();
    render(
      <CollapsibleTrigger isOpen={false} onClick={handleClick}>
        Trigger
      </CollapsibleTrigger>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('CollapsibleContent', () => {
  it('renders children', () => {
    render(
      <CollapsibleContent>
        <div data-testid='content'>Content</div>
      </CollapsibleContent>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <CollapsibleContent className='custom-class'>
        <div data-testid='content'>Content</div>
      </CollapsibleContent>
    );
    expect(screen.getByTestId('content').parentElement).toHaveClass('custom-class');
  });
});
