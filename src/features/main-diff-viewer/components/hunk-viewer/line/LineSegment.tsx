import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
//types
import type { DiffLine } from '@/features/main-diff-viewer/types/diff';
//utils
import { getThemeColors } from '@/features/main-diff-viewer/utils/getThemeColors';

interface LineSegmentProps {
  part: DiffLine['parts'][0];
  language: string;
  isMultipleParts: boolean;
  isDark: boolean;
}
export default function LineSegment({ part, language, isMultipleParts, isDark }: LineSegmentProps) {
  const leadingSpacesMatch = part.content.match(/^(\s*)/);
  const leadingSpaces = leadingSpacesMatch?.[1] || '';
  const actualContent = part.content.slice(leadingSpacesMatch?.[1]?.length || 0);

  const colors = getThemeColors(isDark);
  const colorMap = {
    ADDED: colors.added,
    REMOVED: colors.removed,
  };

  const highlightColors = colorMap[part.status as keyof typeof colorMap];
  const highlightStyle = !isMultipleParts
    ? { background: 'transparent' }
    : highlightColors
      ? {
          background: highlightColors.highlightBackground,
          color: highlightColors.textColor,
        }
      : { background: 'transparent' };

  return (
    <span className='flex'>
      {leadingSpaces && <span className='whitespace-pre'>{leadingSpaces}</span>}
      {actualContent && (
        <SyntaxHighlighter
          language={language}
          style={{}}
          customStyle={{
            ...highlightStyle,
            padding: 0,
            margin: 0,
            fontSize: 'inherit',
            fontFamily: 'inherit',
          }}
          lineNumberStyle={{}}
          showLineNumbers={false}
          wrapLines
          wrapLongLines
        >
          {actualContent}
        </SyntaxHighlighter>
      )}
    </span>
  );
}
