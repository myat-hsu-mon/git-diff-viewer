//utils
import { getFileExtension, parseFilePath } from '@/utils/diff';
//utils
import { getFileIcon, getIconColor } from '@/features/main-diff-viewer/utils/getFileIcon';
import { cn } from '@/utils/cn';
import { DiffHunk, FileDiff } from '@/features/main-diff-viewer/types/diff';

interface FileTreeItemProps {
  diff: FileDiff;
  index: number;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpansion: () => void;
  style?: React.CSSProperties;
}
export default function FileTreeItem({
  diff,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpansion,
  style,
}: FileTreeItemProps) {
  const path = diff.newPath || diff.oldPath || diff.displayPaths[0] || '';
  const { filename, directory } = parseFilePath(path);
  const extension = getFileExtension(filename);

  const FileIcon = getFileIcon(extension, diff.status);
  const fileIconColor = getIconColor(diff.status);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpansion();
  };

  return (
    <div
      style={style}
      className={cn(
        'flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent/50 transition-colors',
        isSelected && 'bg-[#EDEEEF] dark:bg-[#1E2429]'
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      role='button'
      tabIndex={0}
      aria-selected={isSelected}
      aria-expanded={isExpanded}
    >
      {/* File Icon */}
      <div className='flex-shrink-0'>
        <FileIcon className={cn('h-5 w-5 text-muted-foreground', fileIconColor)} />
      </div>

      {/* File Info */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='truncate font-medium text-sm'>{filename}</span>
        </div>
        {directory && <div className='text-xs text-muted-foreground truncate'>{directory}</div>}
      </div>

      {/* File Stats */}
      <div className='flex-shrink-0 text-xs text-muted-foreground'>
        <div className='text-right text-green-600'>
          +{diff.hunks.reduce((acc: number, hunk: DiffHunk) => acc + hunk.afterDiff.length, 0)}
        </div>
        <div className='text-right text-red-600'>
          -{diff.hunks.reduce((acc: number, hunk: DiffHunk) => acc + hunk.beforeDiff.length, 0)}
        </div>
      </div>
    </div>
  );
}
