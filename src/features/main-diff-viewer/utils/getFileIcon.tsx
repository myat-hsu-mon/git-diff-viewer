import {
  FileArchive,
  FileDiff,
  FileText,
  FileImage,
  LucideProps,
  FilePlus,
  FileMinus,
} from 'lucide-react';

import { supportsSyntaxHighlighting } from '@/utils/diff';
import { DiffStatus } from '../types/diff';

/**
 * Get icon color based on status
 */
export function getIconColor(status: DiffStatus): string {
  const colorMap: Record<DiffStatus, string> = {
    ADDED: 'text-green-600 dark:text-white',
    REMOVED: 'text-red-600 dark:text-white',
    MODIFIED: 'text-gray-600 dark:text-white',
    RENAMED: 'text-gray-600 dark:text-white',
    COPIED: 'text-gray-600 dark:text-white',
  };
  return colorMap[status] || colorMap.MODIFIED;
}

/**
 * Get file icon based on extension
 */
export const getFileIcon = (
  extension: string,
  status: DiffStatus
): React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'>> => {
  console.log({ extension, status });
  if (supportsSyntaxHighlighting(extension)) {
    switch (status) {
      case 'ADDED':
        return FilePlus;
      case 'REMOVED':
        return FileMinus;
      default:
        return FileDiff;
    }
  }

  const iconMap: Record<
    string,
    React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'>> | undefined
  > = {
    // Images
    jpg: FileImage,
    jpeg: FileImage,
    png: FileImage,
    gif: FileImage,
    svg: FileImage,
    webp: FileImage,
    // Archives
    zip: FileArchive,
    rar: FileArchive,
    '7z': FileArchive,
    tar: FileArchive,
    gz: FileArchive,
    // Default
    default: FileText,
  };

  return iconMap[extension] || iconMap.default || FileText;
};
