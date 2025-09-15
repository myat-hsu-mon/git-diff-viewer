import { LINE_TYPES, PREFIX_SYMBOLS } from '@/features/main-diff-viewer/types/hunk';
import { getThemeColors } from '@/features/main-diff-viewer/utils/hunk';
import { cn } from '@/utils/cn';

const PREFIX_CLASSES = 'flex-shrink-0 w-6 text-center font-bold select-none';

interface LinePrefixProps {
  lineType: 'added' | 'removed' | 'context';
  isDark: boolean;
}
export default function LinePrefix({ lineType, isDark }: LinePrefixProps) {
  const colors = getThemeColors(isDark)[lineType];

  return (
    <div
      className={cn(
        PREFIX_CLASSES,
        colors.background,
        lineType === LINE_TYPES.CONTEXT && 'text-muted-foreground'
      )}
    >
      {PREFIX_SYMBOLS[lineType]}
    </div>
  );
}
