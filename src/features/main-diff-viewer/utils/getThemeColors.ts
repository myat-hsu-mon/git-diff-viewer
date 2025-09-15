export const getThemeColors = (isDark: boolean) => ({
  added: {
    background: isDark ? 'bg-[#12261F]' : 'bg-[#DBFBE1]',
    highlightBackground: isDark ? '#1D4428' : '#ACEEBB',
    textColor: isDark ? 'white' : 'black',
  },
  removed: {
    background: isDark ? 'bg-[#25191C]' : 'bg-[#FFEBE9]',
    highlightBackground: isDark ? '#542527' : '#FECECB',
    textColor: isDark ? 'white' : 'black',
  },
  context: {
    background: 'bg-background',
    highlightBackground: 'transparent',
    textColor: 'inherit',
  },
});
