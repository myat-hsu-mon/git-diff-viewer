import { describe, it, expect } from 'vitest';
import { getThemeColors } from '../getThemeColors';

describe('getThemeColors', () => {
  describe('light theme (isDark: false)', () => {
    it('should return correct colors for added lines', () => {
      const colors = getThemeColors(false);

      expect(colors.added).toEqual({
        background: 'bg-[#DBFBE1]',
        highlightBackground: '#ACEEBB',
        textColor: 'black',
      });
    });

    it('should return correct colors for removed lines', () => {
      const colors = getThemeColors(false);

      expect(colors.removed).toEqual({
        background: 'bg-[#FFEBE9]',
        highlightBackground: '#FECECB',
        textColor: 'black',
      });
    });

    it('should return correct colors for context lines', () => {
      const colors = getThemeColors(false);

      expect(colors.context).toEqual({
        background: 'bg-background',
        highlightBackground: 'transparent',
        textColor: 'inherit',
      });
    });

    it('should return all color variants for light theme', () => {
      const colors = getThemeColors(false);

      expect(colors).toHaveProperty('added');
      expect(colors).toHaveProperty('removed');
      expect(colors).toHaveProperty('context');

      expect(colors.added).toHaveProperty('background');
      expect(colors.added).toHaveProperty('highlightBackground');
      expect(colors.added).toHaveProperty('textColor');

      expect(colors.removed).toHaveProperty('background');
      expect(colors.removed).toHaveProperty('highlightBackground');
      expect(colors.removed).toHaveProperty('textColor');

      expect(colors.context).toHaveProperty('background');
      expect(colors.context).toHaveProperty('highlightBackground');
      expect(colors.context).toHaveProperty('textColor');
    });
  });

  describe('dark theme (isDark: true)', () => {
    it('should return correct colors for added lines', () => {
      const colors = getThemeColors(true);

      expect(colors.added).toEqual({
        background: 'bg-[#12261F]',
        highlightBackground: '#1D4428',
        textColor: 'white',
      });
    });

    it('should return correct colors for removed lines', () => {
      const colors = getThemeColors(true);

      expect(colors.removed).toEqual({
        background: 'bg-[#25191C]',
        highlightBackground: '#542527',
        textColor: 'white',
      });
    });

    it('should return correct colors for context lines', () => {
      const colors = getThemeColors(true);

      expect(colors.context).toEqual({
        background: 'bg-background',
        highlightBackground: 'transparent',
        textColor: 'inherit',
      });
    });

    it('should return all color variants for dark theme', () => {
      const colors = getThemeColors(true);

      expect(colors).toHaveProperty('added');
      expect(colors).toHaveProperty('removed');
      expect(colors).toHaveProperty('context');

      // Verify structure
      expect(colors.added).toHaveProperty('background');
      expect(colors.added).toHaveProperty('highlightBackground');
      expect(colors.added).toHaveProperty('textColor');

      expect(colors.removed).toHaveProperty('background');
      expect(colors.removed).toHaveProperty('highlightBackground');
      expect(colors.removed).toHaveProperty('textColor');

      expect(colors.context).toHaveProperty('background');
      expect(colors.context).toHaveProperty('highlightBackground');
      expect(colors.context).toHaveProperty('textColor');
    });
  });

  describe('theme consistency', () => {
    it('should have consistent structure between light and dark themes', () => {
      const lightColors = getThemeColors(false);
      const darkColors = getThemeColors(true);

      // Both themes should have the same keys
      expect(Object.keys(lightColors)).toEqual(Object.keys(darkColors));

      // Each line type should have the same properties
      Object.keys(lightColors).forEach(lineType => {
        const lightLineType = lightColors[lineType as keyof typeof lightColors];
        const darkLineType = darkColors[lineType as keyof typeof darkColors];

        expect(Object.keys(lightLineType)).toEqual(Object.keys(darkLineType));
      });
    });

    it('should have context colors that are theme-independent', () => {
      const lightColors = getThemeColors(false);
      const darkColors = getThemeColors(true);

      expect(lightColors.context).toEqual(darkColors.context);
    });
  });
});
