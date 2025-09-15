import { getThemeColors } from '@/features/main-diff-viewer/utils/hunk';
import { cn } from '@/utils/cn';

const LINE_NUMBER_CLASSES = 'flex-shrink-0 w-16 px-2 text-right text-muted-foreground select-none';

interface LineNumberProps {
  lineNumber: number;
  lineType: 'added' | 'removed' | 'context';
  isDark: boolean;
}
export default function LineNumber({ lineNumber, lineType, isDark }: LineNumberProps) {
  const colors = getThemeColors(isDark)[lineType];

  return (
    <div
      className={cn(LINE_NUMBER_CLASSES)}
      style={{
        color: colors.textColor,
        backgroundColor: colors.highlightBackground,
      }}
    >
      {lineNumber}
    </div>
  );
}
