//contexts
import { useDiffViewerContext } from '@/features/main-diff-viewer/contexts/DiffViewerContext';
//components
import Header from '@/layout/Header';
import FileUpload from '@/components/ui/FileUpload';
import FileTree from '@/features/main-diff-viewer/components/file-tree/FileTree';
import HunkViewerPanel from '../components/hunk-viewer/HunkViewerPanel';

export default function MainDiffViewerPage() {
  const { diffs, state, setSelectedFiles } = useDiffViewerContext();

  const hasData = diffs.length > 0;

  return (
    <div className=' flex flex-col h-screen bg-background text-foreground'>
      <Header />

      {!hasData ? (
        <main className='flex-1 flex items-center justify-center p-8'>
          <div className='w-full max-w-2xl'>
            <FileUpload />
          </div>
        </main>
      ) : (
        <div className='flex-1 flex overflow-hidden'>
          {/* File Tree */}
          <FileTree
            diffs={diffs}
            selectedFiles={state.selectedFiles}
            onFileSelectionChange={(selectedFiles: Set<number>) => {
              setSelectedFiles(selectedFiles);
            }}
            visible={true}
          />

          {/* Main Content */}
          <div className='flex-1 flex flex-col overflow-hidden'>
            <HunkViewerPanel diffs={diffs} />
          </div>
        </div>
      )}
    </div>
  );
}
