import { useMemo } from 'react';
//types
import type { DiffLine, DiffHunk } from '@/features/main-diff-viewer/types/diff';
//components
import Collapsible from '@/components/ui/Collapsible';
import DiffLineItem from './line/DiffLineItem';

interface HunkProps {
  hunk: DiffHunk;
  isExpanded: boolean;
  onExpansionChange: (expanded: boolean) => void;
  fileExtension?: string;
}
export default function Hunk({ hunk, isExpanded, onExpansionChange, fileExtension }: HunkProps) {
  const hasChanges = hunk.beforeDiff.length > 0 || hunk.afterDiff.length > 0;

  // Create unified diff view
  const unifiedLines = useMemo(() => {
    const lines: Array<{
      type: 'added' | 'removed' | 'context';
      line: DiffLine;
      index: number;
    }> = [];

    // Add removed lines
    hunk.beforeDiff.forEach((line, index) => {
      lines.push({
        type: 'removed',
        line,
        index,
      });
    });

    // Add added lines
    hunk.afterDiff.forEach((line, index) => {
      lines.push({
        type: 'added',
        line,
        index,
      });
    });

    return lines;
  }, [hunk.beforeDiff, hunk.afterDiff]);

  const hunkHeader = `@@ -${hunk.oldLineStart},${hunk.oldLineCount} +${hunk.newLineStart},${hunk.newLineCount} @@`;
  const headerContent = hunk.enclosingBlock ? `${hunkHeader} ${hunk.enclosingBlock}` : hunkHeader;

  if (!hasChanges) return null;

  return (
    <div className='border rounded-lg overflow-hidden'>
      {/* Hunk Header */}
      <Collapsible
        className='border-0'
        open={isExpanded}
        onOpenChange={onExpansionChange}
        trigger={
          <div className='flex items-center justify-between p-3 bg-muted/50 rounded-t-lg'>
            <div className='flex items-center gap-3'>
              <code className='text-sm font-mono text-muted-foreground'>{headerContent}</code>
              <span className='text-xs text-muted-foreground'>
                {hunk.oldLineCount} removed, {hunk.newLineCount} added
              </span>
            </div>
          </div>
        }
        showIcon={true}
      >
        {/* Hunk Content */}
        <div className='bg-background rounded-b-lg'>
          {unifiedLines.map((lineData, index) => (
            <DiffLineItem
              key={`${lineData.type}-${index}`}
              line={lineData.line}
              fileExtension={fileExtension || ''}
              lineType={lineData.type}
            />
          ))}
        </div>
      </Collapsible>
    </div>
  );
}
