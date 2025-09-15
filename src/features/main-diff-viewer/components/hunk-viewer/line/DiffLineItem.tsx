//contexts
import { useDiffViewerContext } from '@/features/main-diff-viewer/contexts/DiffViewerContext';
//utils
import { cn } from '@/utils/cn';
import { getLanguageFromExtension } from '@/utils/diff';
//types
import type { DiffLine } from '@/features/main-diff-viewer/types/diff';
//components
import LineNumber from './LineNumber';
import LinePrefix from './LinePrefix';
import LineContent from './LineContent';
//types
import { LINE_TYPES } from '@/features/main-diff-viewer/types/hunk';
//utils
import { getThemeColors } from '@/features/main-diff-viewer/utils/getThemeColors';

// CSS Classes
const LINE_BASE_CLASSES = 'flex min-h-[1.5rem] font-mono text-sm leading-6';

// Theme-based color mappings

interface DiffLineItemProps {
  line: DiffLine;
  fileExtension: string;
  lineType: 'added' | 'removed' | 'context';
}

export default function DiffLineItem({ line, fileExtension, lineType }: DiffLineItemProps) {
  const { theme } = useDiffViewerContext();

  const isDark = theme.theme === 'dark';

  const language = getLanguageFromExtension(fileExtension);
  const colors = getThemeColors(isDark)[lineType];

  const isMultipleParts = line.parts.length > 1;
  const lineNumber = lineType === LINE_TYPES.ADDED ? (line.newN ?? 0) : (line.oldN ?? 0);

  return (
    <div className={cn(LINE_BASE_CLASSES, colors.background)}>
      <LineNumber lineNumber={lineNumber} lineType={lineType} isDark={isDark} />

      <LinePrefix lineType={lineType} isDark={isDark} />

      <LineContent
        parts={line.parts}
        language={language}
        isMultipleParts={isMultipleParts}
        isDark={isDark}
      />
    </div>
  );
}
