import { DiffLine } from '@/features/main-diff-viewer/types/diff';
import LineSegment from './LineSegment';

const CONTENT_CLASSES = 'flex items-center gap-2 px-2 overflow-x-auto';

interface LineContentProps {
  parts: DiffLine['parts'];
  language: string;
  isMultipleParts: boolean;
  isDark: boolean;
}
export default function LineContent({
  parts,
  language,
  isMultipleParts,
  isDark,
}: LineContentProps) {
  return (
    <div className={CONTENT_CLASSES}>
      {parts.map((part, partIndex) => (
        <LineSegment
          key={`${partIndex}-${part.content}`}
          part={part}
          language={language}
          isMultipleParts={isMultipleParts}
          isDark={isDark}
        />
      ))}
    </div>
  );
}
