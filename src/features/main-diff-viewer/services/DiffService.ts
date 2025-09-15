import type { FileDiff } from '@/features/main-diff-viewer/types/diff';

export class DiffService {
  /**
   * Load diff data from a JSON file
   */
  static async loadFromFile(file: File): Promise<FileDiff[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = event => {
        try {
          const content = event.target?.result as string;
          const data = JSON.parse(content) as FileDiff[];
          resolve(data);
        } catch (error) {
          reject(
            new Error(
              `Failed to parse diff file: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
          );
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Validate diff data structure
   */
  static validateDiffData(data: unknown): data is FileDiff[] {
    if (!Array.isArray(data)) {
      return false;
    }

    return data.every(item => {
      return (
        typeof item === 'object' &&
        item !== null &&
        'status' in item &&
        'displayPaths' in item &&
        'hunks' in item &&
        Array.isArray(item.displayPaths) &&
        Array.isArray(item.hunks)
      );
    });
  }

  /**
   * Normalize diff data to ensure consistent structure
   */
  static normalizeDiffData(data: FileDiff[]): FileDiff[] {
    return data.map(diff => ({
      ...diff,
      oldPath: diff.oldPath || null,
      newPath: diff.newPath || null,
      displayPaths: diff.displayPaths || [],
      hunks: diff.hunks || [],
    }));
  }
}
