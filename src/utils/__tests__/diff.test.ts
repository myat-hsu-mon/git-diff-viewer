import { describe, it, expect } from 'vitest';
import {
  calculateDiffStats,
  getFileExtension,
  supportsSyntaxHighlighting,
  getLanguageFromExtension,
  parseFilePath,
  getStatusColor,
  formatFileSize,
  matchesSearchQuery,
  createFileTree,
} from '../diff';
import type { FileDiff } from '@/features/main-diff-viewer/types/diff';

describe('diff utilities', () => {
  const mockDiffs: FileDiff[] = [
    {
      status: 'ADDED',
      displayPaths: ['src/new-file.js'],
      oldPath: null,
      newPath: 'src/new-file.js',
      hunks: [
        {
          enclosingBlock: 'function test()',
          oldLineCount: 0,
          oldLineStart: 0,
          newLineCount: 3,
          newLineStart: 1,
          beforeDiff: [],
          afterDiff: [
            {
              parts: [{ content: 'function test() {', status: 'ADDED' }],
              newN: 1,
            },
            {
              parts: [{ content: '  return true;', status: 'ADDED' }],
              newN: 2,
            },
            {
              parts: [{ content: '}', status: 'ADDED' }],
              newN: 3,
            },
          ],
        },
      ],
    },
    {
      status: 'MODIFIED',
      displayPaths: ['src/existing-file.ts'],
      oldPath: 'src/existing-file.ts',
      newPath: 'src/existing-file.ts',
      hunks: [
        {
          enclosingBlock: 'export class Test',
          oldLineCount: 2,
          oldLineStart: 5,
          newLineCount: 2,
          newLineStart: 5,
          beforeDiff: [
            {
              parts: [{ content: 'export class Test {', status: 'REMOVED' }],
              oldN: 5,
            },
          ],
          afterDiff: [
            {
              parts: [{ content: 'export class Test {', status: 'ADDED' }],
              newN: 5,
            },
          ],
        },
      ],
    },
  ];

  describe('calculateDiffStats', () => {
    it('should calculate correct statistics', () => {
      const stats = calculateDiffStats(mockDiffs);

      expect(stats.totalFiles).toBe(2);
      expect(stats.addedFiles).toBe(1);
      expect(stats.modifiedFiles).toBe(1);
      expect(stats.removedFiles).toBe(0);
      expect(stats.totalLinesAdded).toBe(4); // 3 + 1
      expect(stats.totalLinesRemoved).toBe(1);
    });

    it('should handle empty array', () => {
      const stats = calculateDiffStats([]);

      expect(stats.totalFiles).toBe(0);
      expect(stats.addedFiles).toBe(0);
      expect(stats.modifiedFiles).toBe(0);
      expect(stats.removedFiles).toBe(0);
      expect(stats.totalLinesAdded).toBe(0);
      expect(stats.totalLinesRemoved).toBe(0);
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extension correctly', () => {
      expect(getFileExtension('file.js')).toBe('js');
      expect(getFileExtension('file.tsx')).toBe('tsx');
      expect(getFileExtension('file.test.js')).toBe('js');
      expect(getFileExtension('file')).toBe('');
      expect(getFileExtension('file.')).toBe('');
    });
  });

  describe('supportsSyntaxHighlighting', () => {
    it('should identify supported extensions', () => {
      expect(supportsSyntaxHighlighting('js')).toBe(true);
      expect(supportsSyntaxHighlighting('tsx')).toBe(true);
      expect(supportsSyntaxHighlighting('py')).toBe(true);
      expect(supportsSyntaxHighlighting('html')).toBe(true);
      expect(supportsSyntaxHighlighting('css')).toBe(true);
    });

    it('should identify unsupported extensions', () => {
      expect(supportsSyntaxHighlighting('txt')).toBe(false);
      expect(supportsSyntaxHighlighting('unknown')).toBe(false);
      expect(supportsSyntaxHighlighting('')).toBe(false);
    });
  });

  describe('getLanguageFromExtension', () => {
    it('should map extensions to languages correctly', () => {
      expect(getLanguageFromExtension('js')).toBe('javascript');
      expect(getLanguageFromExtension('tsx')).toBe('tsx');
      expect(getLanguageFromExtension('py')).toBe('python');
      expect(getLanguageFromExtension('html')).toBe('html');
      expect(getLanguageFromExtension('css')).toBe('css');
    });

    it('should return text for unknown extensions', () => {
      expect(getLanguageFromExtension('unknown')).toBe('text');
      expect(getLanguageFromExtension('')).toBe('text');
    });
  });

  describe('parseFilePath', () => {
    it('should parse file paths correctly', () => {
      const result = parseFilePath('src/components/Button.tsx');
      expect(result.directory).toBe('src/components');
      expect(result.filename).toBe('Button.tsx');
      expect(result.fullPath).toBe('src/components/Button.tsx');
    });

    it('should handle files without directory', () => {
      const result = parseFilePath('README.md');
      expect(result.directory).toBe('');
      expect(result.filename).toBe('README.md');
      expect(result.fullPath).toBe('README.md');
    });
  });

  describe('getStatusColor', () => {
    it('should return correct colors for each status', () => {
      expect(getStatusColor('ADDED')).toContain('green');
      expect(getStatusColor('MODIFIED')).toContain('yellow');
      expect(getStatusColor('REMOVED')).toContain('red');
      expect(getStatusColor('RENAMED')).toContain('blue');
      expect(getStatusColor('COPIED')).toContain('purple');
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
  });

  describe('matchesSearchQuery', () => {
    it('should match search queries correctly', () => {
      expect(matchesSearchQuery('test', 'This is a test', false)).toBe(true);
      expect(matchesSearchQuery('TEST', 'This is a test', false)).toBe(true);
      expect(matchesSearchQuery('TEST', 'This is a test', true)).toBe(false);
      expect(matchesSearchQuery('', 'This is a test', false)).toBe(true);
    });
  });

  describe('createFileTree', () => {
    it('should create file tree structure', () => {
      const tree = createFileTree(mockDiffs);

      expect(tree).toHaveLength(2);
      expect(tree[0]?.index).toBe(0);
      expect(tree[0]?.path).toBe('src/new-file.js');
      expect(tree[0]?.status).toBe('ADDED');
      expect(tree[0]?.isDirectory).toBe(false);
    });
  });
});
