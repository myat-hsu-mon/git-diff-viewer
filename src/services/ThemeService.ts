export class ThemeService {
  private static readonly STORAGE_KEY = 'git-diff-viewer-theme';
  private static readonly DEFAULT_THEME = {
    theme: 'system' as const,
    highContrast: false,
  };

  /**
   * Load theme from localStorage
   */
  static loadTheme(): { theme: 'light' | 'dark' | 'system'; highContrast: boolean } {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          theme: parsed.theme || this.DEFAULT_THEME.theme,
          highContrast: Boolean(parsed.highContrast),
        };
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }

    return this.DEFAULT_THEME;
  }

  /**
   * Save theme to localStorage
   */
  static saveTheme(theme: { theme: 'light' | 'dark' | 'system'; highContrast: boolean }): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(theme));
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Get the effective theme (resolves 'system' to actual theme)
   */
  static getEffectiveTheme(theme: 'light' | 'dark' | 'system'): 'light' | 'dark' {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }

  /**
   * Apply theme to document
   */
  static applyTheme(theme: { theme: 'light' | 'dark' | 'system'; highContrast: boolean }): void {
    const effectiveTheme = this.getEffectiveTheme(theme.theme);
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'high-contrast');

    // Apply new theme classes
    root.classList.add(effectiveTheme);
    if (theme.highContrast) {
      root.classList.add('high-contrast');
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#0f172a' : '#ffffff');
    }
  }
}
