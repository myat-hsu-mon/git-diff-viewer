import { DiffLine } from '@/features/main-diff-viewer/types/diff';
import { getThemeColors } from '@/features/main-diff-viewer/utils/hunk';
import { useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

interface LineSegmentProps {
  part: DiffLine['parts'][0];
  language: string;
  isMultipleParts: boolean;
  isDark: boolean;
}
export default function LineSegment({ part, language, isMultipleParts, isDark }: LineSegmentProps) {
  const { leadingSpaces, actualContent } = useMemo(() => {
    const leadingSpacesMatch = part.content.match(/^(\s*)/);
    return {
      leadingSpaces: leadingSpacesMatch?.[1] || '',
      actualContent: part.content.slice(leadingSpacesMatch?.[1]?.length || 0),
    };
  }, [part.content]);

  const highlightStyle = useMemo(() => {
    if (!isMultipleParts) return { background: 'transparent' };

    const colors = getThemeColors(isDark);
    const colorMap = {
      ADDED: colors.added,
      REMOVED: colors.removed,
    };

    const selectedColors = colorMap[part.status as keyof typeof colorMap];
    return selectedColors
      ? {
          background: selectedColors.highlightBackground,
          color: selectedColors.textColor,
        }
      : { background: 'transparent' };
  }, [isMultipleParts, part.status, isDark]);

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
