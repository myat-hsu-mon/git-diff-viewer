import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeService } from '../ThemeService';

describe('ThemeService', () => {
  let mockLocalStorage: { [key: string]: string };
  let mockMatchMedia: vi.Mock;

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: vi.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
    });

    // Mock matchMedia
    mockMatchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      writable: true,
    });

    // Mock document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: {
          remove: vi.fn(),
          add: vi.fn(),
        },
      },
      writable: true,
    });

    // Mock document.querySelector
    vi.spyOn(document, 'querySelector').mockReturnValue({
      setAttribute: vi.fn(),
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadTheme', () => {
    it('loads theme from localStorage', () => {
      mockLocalStorage['git-diff-viewer-theme'] = JSON.stringify({
        theme: 'dark',
        highContrast: true,
      });

      const result = ThemeService.loadTheme();
      expect(result).toEqual({ theme: 'dark', highContrast: true });
    });

    it('returns default theme when localStorage is empty', () => {
      const result = ThemeService.loadTheme();
      expect(result).toEqual({ theme: 'system', highContrast: false });
    });

    it('returns default theme when localStorage has invalid JSON', () => {
      mockLocalStorage['git-diff-viewer-theme'] = 'invalid json';

      const result = ThemeService.loadTheme();
      expect(result).toEqual({ theme: 'system', highContrast: false });
    });

    it('handles missing properties in stored theme', () => {
      mockLocalStorage['git-diff-viewer-theme'] = JSON.stringify({
        theme: 'light',
      });

      const result = ThemeService.loadTheme();
      expect(result).toEqual({ theme: 'light', highContrast: false });
    });
  });

  describe('saveTheme', () => {
    it('saves theme to localStorage', () => {
      const theme = { theme: 'dark' as const, highContrast: true };
      ThemeService.saveTheme(theme);

      expect(mockLocalStorage['git-diff-viewer-theme']).toBe(JSON.stringify(theme));
    });
  });

  describe('getEffectiveTheme', () => {
    it('returns light theme when system theme is light', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: false, // light theme
        media: query,
      }));

      const result = ThemeService.getEffectiveTheme('system');
      expect(result).toBe('light');
    });

    it('returns dark theme when system theme is dark', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: true, // dark theme
        media: query,
      }));

      const result = ThemeService.getEffectiveTheme('system');
      expect(result).toBe('dark');
    });

    it('returns the theme when not system', () => {
      expect(ThemeService.getEffectiveTheme('light')).toBe('light');
      expect(ThemeService.getEffectiveTheme('dark')).toBe('dark');
    });
  });

  describe('applyTheme', () => {
    it('applies light theme', () => {
      const theme = { theme: 'light' as const, highContrast: false };
      ThemeService.applyTheme(theme);

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
        'light',
        'dark',
        'high-contrast'
      );
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('light');
    });

    it('applies dark theme', () => {
      const theme = { theme: 'dark' as const, highContrast: false };
      ThemeService.applyTheme(theme);

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
        'light',
        'dark',
        'high-contrast'
      );
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
    });

    it('updates meta theme-color', () => {
      const theme = { theme: 'dark' as const, highContrast: false };
      ThemeService.applyTheme(theme);

      expect(document.querySelector).toHaveBeenCalledWith('meta[name="theme-color"]');
    });
  });
});
