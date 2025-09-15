import { FileArchive, FileDiff, FileText, FileImage, LucideProps } from 'lucide-react';

import { supportsSyntaxHighlighting } from '@/utils/diff';

/**
 * Get file icon based on extension
 */
export const getFileIcon = (
  extension: string,
  status: string
): React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'>> => {
  console.log({ extension, status });
  if (supportsSyntaxHighlighting(extension)) {
    return FileDiff;
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
