import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'hidden');
    expect(result).toBe('base conditional');
  });

  it('handles undefined and null values', () => {
    const result = cn('base', undefined, null, 'valid');
    expect(result).toBe('base valid');
  });

  it('handles empty strings', () => {
    const result = cn('base', '', 'valid');
    expect(result).toBe('base valid');
  });

  it('handles arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('handles objects with boolean values', () => {
    const result = cn({
      class1: true,
      class2: false,
      class3: true,
    });
    expect(result).toBe('class1 class3');
  });

  it('handles mixed input types', () => {
    const result = cn(
      'base',
      ['array1', 'array2'],
      { object1: true, object2: false },
      'string',
      true && 'conditional',
      false && 'hidden'
    );
    expect(result).toBe('base array1 array2 object1 string conditional');
  });

  it('handles Tailwind CSS conflicts', () => {
    // This tests that tailwind-merge is working correctly
    const result = cn('p-2 p-4', 'text-sm text-lg');
    expect(result).toBe('p-4 text-lg'); // Should keep the last conflicting class
  });

  it('handles empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('handles single class', () => {
    const result = cn('single');
    expect(result).toBe('single');
  });

  it('handles complex conditional logic', () => {
    const isActive = true;
    const isDisabled = false;
    const size = 'large';

    const result = cn(
      'base',
      {
        active: isActive,
        disabled: isDisabled,
        small: false,
        large: size === 'large',
      },
      isActive && 'enabled',
      isDisabled && 'not-enabled'
    );

    expect(result).toBe('base active large enabled');
  });
});
