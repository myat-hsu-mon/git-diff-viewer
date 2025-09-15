import { useCallback } from 'react';
import { Button } from './Button';
import { Moon, Sun } from 'lucide-react';
import { useDiffViewerContext } from '@/features/main-diff-viewer/contexts/DiffViewerContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useDiffViewerContext();

  const handleThemeChange = useCallback(
    (newTheme: 'light' | 'dark') => {
      setTheme({ ...theme, theme: newTheme });
    },
    [theme, setTheme]
  );

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => handleThemeChange(theme.theme === 'light' ? 'dark' : 'light')}
        className='p-2'
      >
        {theme.theme === 'light' ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4' />}
      </Button>
    </div>
  );
}
