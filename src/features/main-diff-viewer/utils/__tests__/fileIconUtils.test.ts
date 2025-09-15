import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileDiff, FileText, FileImage, FilePlus, FileMinus } from 'lucide-react';
import { getIconColor, getFileIcon } from '../fileIconUtils';
import { DiffStatus } from '../../types/diff';

// Mock the supportsSyntaxHighlighting function
vi.mock('@/utils/diff', () => ({
  supportsSyntaxHighlighting: vi.fn(),
}));

import { supportsSyntaxHighlighting } from '@/utils/diff';

const mockSupportsSyntaxHighlighting = vi.mocked(supportsSyntaxHighlighting);

describe('fileIconUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getIconColor', () => {
    it('should return correct color for ADDED status', () => {
      const result = getIconColor('ADDED');
      expect(result).toBe('text-green-600 dark:text-white');
    });

    it('should return correct color for REMOVED status', () => {
      const result = getIconColor('REMOVED');
      expect(result).toBe('text-red-600 dark:text-white');
    });

    it('should return correct color for MODIFIED status', () => {
      const result = getIconColor('MODIFIED');
      expect(result).toBe('text-gray-600 dark:text-white');
    });

    it('should return correct color for RENAMED status', () => {
      const result = getIconColor('RENAMED');
      expect(result).toBe('text-gray-600 dark:text-white');
    });

    it('should return correct color for COPIED status', () => {
      const result = getIconColor('COPIED');
      expect(result).toBe('text-gray-600 dark:text-white');
    });

    it('should return default color for unknown status', () => {
      const result = getIconColor('UNKNOWN' as unknown as DiffStatus);
      expect(result).toBe('text-gray-600 dark:text-white');
    });

    it('should handle all valid DiffStatus values', () => {
      const validStatuses: DiffStatus[] = ['ADDED', 'REMOVED', 'MODIFIED', 'RENAMED', 'COPIED'];

      validStatuses.forEach(status => {
        const result = getIconColor(status);
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        expect(result).toContain('text-');
      });
    });
  });

  describe('getFileIcon', () => {
    describe('when file supports syntax highlighting', () => {
      beforeEach(() => {
        mockSupportsSyntaxHighlighting.mockReturnValue(true);
      });

      it('should return FilePlus for ADDED status', () => {
        const result = getFileIcon('js', 'ADDED');
        expect(result).toBe(FilePlus);
      });

      it('should return FileMinus for REMOVED status', () => {
        const result = getFileIcon('ts', 'REMOVED');
        expect(result).toBe(FileMinus);
      });

      it('should return FileDiff for MODIFIED status', () => {
        const result = getFileIcon('py', 'MODIFIED');
        expect(result).toBe(FileDiff);
      });

      it('should return FileDiff for RENAMED status', () => {
        const result = getFileIcon('jsx', 'RENAMED');
        expect(result).toBe(FileDiff);
      });

      it('should return FileDiff for COPIED status', () => {
        const result = getFileIcon('tsx', 'COPIED');
        expect(result).toBe(FileDiff);
      });

      it('should call supportsSyntaxHighlighting with correct extension', () => {
        getFileIcon('js', 'ADDED');
        expect(mockSupportsSyntaxHighlighting).toHaveBeenCalledWith('js');
      });
    });

    describe('when file does not support syntax highlighting', () => {
      beforeEach(() => {
        mockSupportsSyntaxHighlighting.mockReturnValue(false);
      });

      describe('image file extensions', () => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];

        imageExtensions.forEach(ext => {
          it(`should return FileImage for .${ext} extension`, () => {
            const result = getFileIcon(ext, 'MODIFIED');
            expect(result).toBe(FileImage);
          });
        });
      });

      it('should return FileText for unknown extension', () => {
        const result = getFileIcon('unknown', 'MODIFIED');
        expect(result).toBe(FileText);
      });

      it('should return FileText for empty extension', () => {
        const result = getFileIcon('', 'MODIFIED');
        expect(result).toBe(FileText);
      });

      it('should return FileText for undefined extension', () => {
        const result = getFileIcon(undefined as unknown as string, 'MODIFIED');
        expect(result).toBe(FileText);
      });
    });

    describe('edge cases', () => {
      beforeEach(() => {
        mockSupportsSyntaxHighlighting.mockReturnValue(false);
      });

      it('should handle case-insensitive extensions', () => {
        const result1 = getFileIcon('JPG', 'MODIFIED');
        const result2 = getFileIcon('jpg', 'MODIFIED');
        expect(result1).toBe(FileText); // Case sensitive, so returns default
        expect(result2).toBe(FileImage);
      });

      it('should handle extensions with dots', () => {
        const result = getFileIcon('.jpg', 'MODIFIED');
        expect(result).toBe(FileText); // Extension should not include dot
      });

      it('should handle multiple dots in extension', () => {
        const result = getFileIcon('file.jpg.bak', 'MODIFIED');
        expect(result).toBe(FileText); // Only single extension supported
      });

      it('should handle special characters in extension', () => {
        const result = getFileIcon('file-name_123', 'MODIFIED');
        expect(result).toBe(FileText);
      });
    });

    describe('return type validation', () => {
      beforeEach(() => {
        mockSupportsSyntaxHighlighting.mockReturnValue(false);
      });

      it('should return a valid React component', () => {
        const result = getFileIcon('js', 'MODIFIED');
        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
      });

      it('should return components that can be rendered', () => {
        const iconComponents = [
          getFileIcon('js', 'ADDED'),
          getFileIcon('jpg', 'MODIFIED'),
          getFileIcon('unknown', 'COPIED'),
        ];

        iconComponents.forEach(component => {
          expect(component).toBeDefined();
          expect(typeof component).toBe('object');
        });
      });
    });
  });
});
