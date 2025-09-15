import React, { useCallback } from 'react';
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
  const parentRef = React.useRef<HTMLDivElement>(null);

  // Create virtual list for performance with large file lists
  const virtualizer = useVirtualizer({
    count: diffs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Estimated height per item
    overscan: 5,
  });

  const handleFileSelect = useCallback(
    (fileIndex: number) => {
      console.log('fileIndex', fileIndex);
      onFileSelectionChange(new Set([fileIndex]));
    },
    [selectedFiles, onFileSelectionChange]
  );

  const handleFileToggleExpansion = useCallback(
    (fileIndex: number) => {
      handleFileSelect(fileIndex);
    },
    [handleFileSelect]
  );

  if (!visible) return null;

  return (
    <div className='border-r bg-background flex flex-col' style={{ width }}>
      <div className='border-b p-4 flex items-center gap-6 text-sm text-muted-foreground'>
        <span className='font-bold text-lg'>{stats.totalFiles} files changed</span>
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
