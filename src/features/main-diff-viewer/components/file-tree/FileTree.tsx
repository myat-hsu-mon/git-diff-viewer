import { useRef } from 'react';
//components
import type { FileTreeProps } from '@/features/main-diff-viewer/types/diff';
import FileTreeItem from './FileTreeItem';
//hooks
import { useVirtualizer } from '@tanstack/react-virtual';
import { useDiffViewer } from '../../hooks/useDiffViewer';

export default function FileTree({
  diffs,
  selectedFiles,
  onFileSelectionChange,
  visible,
  width = 300,
}: FileTreeProps) {
  const { stats } = useDiffViewer(diffs);
  const parentRef = useRef<HTMLDivElement>(null);

  // Create virtual list for performance with large file lists
  const virtualizer = useVirtualizer({
    count: diffs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Estimated height per item
    overscan: 5,
  });

  const handleFileSelect = (fileIndex: number) => {
    onFileSelectionChange(new Set([fileIndex]));
  };

  const handleFileToggleExpansion = (fileIndex: number) => {
    handleFileSelect(fileIndex);
  };

  if (!visible) return null;

  return (
    <div className='border-r bg-background flex flex-col' style={{ width }}>
      <div className='border-b px-4 py-4.5 flex items-center gap-6 text-sm text-muted-foreground bg-[#F7F8FA] dark:bg-[#1E2429]'>
        <span className='font-bold text-base'>
          {stats.totalFiles} file{stats.totalFiles > 1 ? 's' : ''} changed
        </span>
      </div>

      {/* File List */}
      <div className='flex-1 overflow-hidden'>
        <div
          ref={parentRef}
          className='h-full overflow-auto'
          style={{
            height: '100%',
          }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map(virtualItem => {
              const diff = diffs[virtualItem.index];
              if (!diff) return null;

              return (
                <FileTreeItem
                  key={virtualItem.index}
                  diff={diff}
                  index={virtualItem.index}
                  isSelected={selectedFiles.has(virtualItem.index)}
                  isExpanded={false}
                  onSelect={() => handleFileSelect(virtualItem.index)}
                  onToggleExpansion={() => handleFileToggleExpansion(virtualItem.index)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
      {/* Footer Stats */}
      <div className='border-t p-3 bg-muted/30'>
        <div className='text-xs text-muted-foreground space-y-1'>
          <div className='flex justify-between'>
            <span>Total additions:</span>
            <span className='font-medium text-green-600'>+{stats.totalLinesAdded}</span>
          </div>
          <div className='flex justify-between'>
            <span>Total deletions:</span>
            <span className='font-medium text-red-600'>-{stats.totalLinesRemoved}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
