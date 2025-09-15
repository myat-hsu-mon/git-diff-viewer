import { useState, useEffect, useRef } from 'react';
import { FileCode, FileText, AlertCircle } from 'lucide-react';
//utils
import { getFileExtension } from '@/utils/diff';
//types
import type { DiffHunk, FileDiff } from '@/features/main-diff-viewer/types/diff';
//components
import { StatusBadge } from '../StatusBadge';
import Hunk from './Hunk';
//contexts
import { useDiffViewerContext } from '@/features/main-diff-viewer/contexts/DiffViewerContext';

interface HunkViewerPanelProps {
  diffs: FileDiff[];
}
export default function HunkViewerPanel({ diffs }: HunkViewerPanelProps) {
  const { state } = useDiffViewerContext();
  const [expandedHunks, setExpandedHunks] = useState<Map<number, Set<number>>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when selected file changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [state.selectedFiles]);

  const handleHunkExpansionChange = (fileIndex: number, hunkIndex: number, expanded: boolean) => {
    setExpandedHunks(prev => {
      const newMap = new Map(prev);
      const fileHunks = newMap.get(fileIndex) || new Set();
      const newFileHunks = new Set(fileHunks);

      if (expanded) {
        newFileHunks.add(hunkIndex);
      } else {
        newFileHunks.delete(hunkIndex);
      }

      newMap.set(fileIndex, newFileHunks);
      return newMap;
    });
  };

  const selectedDiff =
    state.selectedFiles.size === 1 ? diffs[Array.from(state.selectedFiles)[0] ?? 0] : null;

  const fileExtension = selectedDiff
    ? getFileExtension(
        selectedDiff.newPath || selectedDiff.oldPath || selectedDiff.displayPaths[0] || ''
      )
    : '';

  if (diffs.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-muted-foreground mb-2'>
            No diff data available
          </h3>
          <p className='text-sm text-muted-foreground'>Load a diff file to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Content */}
      <div className='flex-1 overflow-hidden'>
        {selectedDiff ? (
          <div
            key={`diff-${Array.from(state.selectedFiles)[0] ?? 0}`}
            ref={scrollContainerRef}
            className='h-full overflow-auto'
            style={{ minHeight: 0 }}
          >
            {/* File Header */}
            <div className='mb-4 p-4 bg-[#F7F8FA] dark:bg-[#1E2429]'>
              <div className='flex items-center gap-2 mb-2'>
                {fileExtension ? (
                  <FileCode className='h-5 w-5 text-muted-foreground' />
                ) : (
                  <FileText className='h-5 w-5 text-muted-foreground' />
                )}
                <span className='font-medium'>
                  {selectedDiff.newPath || selectedDiff.oldPath || selectedDiff.displayPaths[0]}
                </span>
                <StatusBadge status={selectedDiff.status} />
              </div>

              {selectedDiff.oldPath &&
                selectedDiff.newPath &&
                selectedDiff.oldPath !== selectedDiff.newPath && (
                  <div className='text-sm text-muted-foreground'>
                    <div>From: {selectedDiff.oldPath}</div>
                    <div>To: {selectedDiff.newPath}</div>
                  </div>
                )}
            </div>

            {/* Hunks */}
            <div className='space-y-4 px-4 pb-4'>
              {selectedDiff.hunks.map((hunk: DiffHunk, hunkIndex: number) => (
                <Hunk
                  key={hunkIndex}
                  hunk={hunk}
                  isExpanded={
                    expandedHunks.get(Array.from(state.selectedFiles)[0] ?? 0)?.has(hunkIndex) ??
                    true
                  }
                  onExpansionChange={(expanded: boolean) =>
                    handleHunkExpansionChange(
                      Array.from(state.selectedFiles)[0] ?? 0,
                      hunkIndex,
                      expanded
                    )
                  }
                  fileExtension={fileExtension}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <FileText className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-muted-foreground mb-2'>
                Select a file to view diff
              </h3>
              <p className='text-sm text-muted-foreground'>
                Choose a file from the file tree to see its changes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
