import { Github, X } from 'lucide-react';
//context
import { useDiffViewerContext } from '@/features/main-diff-viewer/contexts/DiffViewerContext';
//components
import { Button } from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Header() {
  const { diffs, clearDiffs } = useDiffViewerContext();

  const hasData = diffs.length > 0;

  return (
    <header className='border-b border-border bg-background px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Github className='h-6 w-6' />
            <h1 className='text-xl font-bold'>Git Diff Viewer</h1>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          {hasData && (
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' onClick={clearDiffs}>
                <X className='h-4 w-4 mr-2' />
                Clear
              </Button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
