import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
//contexts
import { useDiffViewerContext } from '@/features/main-diff-viewer/contexts/DiffViewerContext';
//utils
import { cn } from '@/utils/cn';
import { getLanguageFromExtension } from '@/utils/diff';
//types
import type { DiffLine } from '@/features/main-diff-viewer/types/diff';

interface DiffLineItemProps {
  line: DiffLine;
  fileExtension: string;
  lineType: 'added' | 'removed' | 'context';
}
export default function DiffLineItem({ line, fileExtension, lineType }: DiffLineItemProps) {
  const language = getLanguageFromExtension(fileExtension);

  const { theme } = useDiffViewerContext();

  const lineNumber = lineType === 'added' ? line.newN : line.oldN;
  const linePrefix = lineType === 'added' ? '+' : lineType === 'removed' ? '-' : ' ';
  const isMultipleParts = line.parts.length > 1;

  return (
    <div
      className={cn(
        'flex min-h-[1.5rem] font-mono text-sm leading-6',
        lineType === 'added' && 'bg-[#DBFBE1] dark:bg-[#12261F]',
        lineType === 'removed' && 'bg-[#FFEBE9] dark:bg-[#25191C]',
        lineType === 'context' && 'bg-background'
      )}
    >
      <div
        className='flex-shrink-0 w-16 px-2 text-right text-muted-foreground select-none'
        style={{
          color: theme.theme === 'dark' ? 'white' : 'black',
          backgroundColor:
            theme.theme === 'dark'
              ? lineType === 'added'
                ? '#1D4428'
                : '#542527'
              : lineType === 'added'
                ? '#ACEEBB'
                : '#FECECB',
        }}
      >
        {lineNumber}
      </div>

      {/* Line Prefix (+/-) */}
      <div
        className={cn(
          'flex-shrink-0 w-6 text-center font-bold select-none',
          lineType === 'added' && 'bg-[#DBFBE1] dark:bg-[#12261F]',
          lineType === 'removed' && 'bg-[#FFEBE9] dark:bg-[#25191C]',
          lineType === 'context' && 'text-muted-foreground'
        )}
      >
        {linePrefix}
      </div>

      {/* Line Content */}
      <div className='flex items-center gap-2 px-2 overflow-x-auto'>
        {line.parts.map((part, partIndex) => {
          // Split content into leading spaces and actual content
          const leadingSpacesMatch = part.content.match(/^(\s*)/);
          const leadingSpaces = leadingSpacesMatch?.[1] || '';
          const actualContent = part.content.slice(leadingSpaces.length);

          const greenHighlightStyle = {
            background: theme.theme === 'dark' ? '#1D4428' : '#ACEEBB',
            color: theme.theme === 'dark' ? 'white' : 'black',
          };
          const redHighlightStyle = {
            background: theme.theme === 'dark' ? '#542527' : '#FECECB',
            color: theme.theme === 'dark' ? 'white' : 'black',
          };

          return (
            <span key={`${partIndex}-${part.content}`} className='flex'>
              {/* Leading spaces without background */}
              {leadingSpaces && <span className='whitespace-pre'>{leadingSpaces}</span>}
              {/* Actual content with green background */}
              {actualContent && (
                <SyntaxHighlighter
                  language={language}
                  style={{}}
                  customStyle={{
                    ...(isMultipleParts && part.status === 'ADDED'
                      ? greenHighlightStyle
                      : isMultipleParts && part.status === 'REMOVED'
                        ? redHighlightStyle
                        : { background: 'transparent' }),
                    padding: 0,
                    margin: 0,
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                  }}
                  lineNumberStyle={{}}
                  showLineNumbers={false}
                  wrapLines={true}
                  wrapLongLines={true}
                >
                  {actualContent}
                </SyntaxHighlighter>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
