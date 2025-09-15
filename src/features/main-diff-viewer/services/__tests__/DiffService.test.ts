import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DiffService } from '../DiffService';
import type { FileDiff } from '@/features/main-diff-viewer/types/diff';

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
        oldLineCount: 1,
        oldLineStart: 5,
        newLineCount: 1,
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

describe('DiffService', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mocked-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadFromFile', () => {
    it('loads and parses valid JSON file', async () => {
      const mockFile = new File([JSON.stringify(mockDiffs)], 'test.json', {
        type: 'application/json',
      });

      const result = await DiffService.loadFromFile(mockFile);
      expect(result).toEqual(mockDiffs);
    });

    it('rejects with error for invalid JSON', async () => {
      const mockFile = new File(['invalid json'], 'test.json', {
        type: 'application/json',
      });

      await expect(DiffService.loadFromFile(mockFile)).rejects.toThrow('Failed to parse diff file');
    });
  });

  describe('validateDiffData', () => {
    it('validates correct diff data', () => {
      expect(DiffService.validateDiffData(mockDiffs)).toBe(true);
    });

    it('rejects non-array data', () => {
      expect(DiffService.validateDiffData({})).toBe(false);
      expect(DiffService.validateDiffData('string')).toBe(false);
      expect(DiffService.validateDiffData(null)).toBe(false);
    });

    it('rejects invalid diff items', () => {
      const invalidDiffs = [
        { status: 'ADDED' }, // Missing required fields
        { displayPaths: [], hunks: [] }, // Missing status
        { status: 'ADDED', displayPaths: 'not-array', hunks: [] }, // Invalid displayPaths
      ];

      expect(DiffService.validateDiffData(invalidDiffs)).toBe(false);
    });
  });

  describe('normalizeDiffData', () => {
    it('normalizes diff data with missing fields', () => {
      const incompleteDiffs = [
        {
          status: 'ADDED',
          displayPaths: ['src/file.js'],
          hunks: [],
        },
      ];

      const result = DiffService.normalizeDiffData(incompleteDiffs as unknown as FileDiff[]);
      expect(result[0]).toEqual({
        status: 'ADDED',
        displayPaths: ['src/file.js'],
        oldPath: null,
        newPath: null,
        hunks: [],
      });
    });
  });
});
