import type { FileDiff, DiffStats, DiffStatus } from '@/features/main-diff-viewer/types/diff';

/**
 * Calculate statistics from an array of file diffs
 */
export function calculateDiffStats(diffs: FileDiff[]): DiffStats {
  const stats: DiffStats = {
    totalFiles: diffs.length,
    addedFiles: 0,
    modifiedFiles: 0,
    removedFiles: 0,
    renamedFiles: 0,
    totalLinesAdded: 0,
    totalLinesRemoved: 0,
  };

  for (const diff of diffs) {
    // Count file types
    switch (diff.status) {
      case 'ADDED':
        stats.addedFiles++;
        break;
      case 'MODIFIED':
        stats.modifiedFiles++;
        break;
      case 'REMOVED':
        stats.removedFiles++;
        break;
      case 'RENAMED':
        stats.renamedFiles++;
        break;
      case 'COPIED':
        // Treat copied files as added for statistics
        stats.addedFiles++;
        break;
    }

    // Count lines in hunks
    for (const hunk of diff.hunks) {
      stats.totalLinesAdded += hunk.afterDiff.length;
      stats.totalLinesRemoved += hunk.beforeDiff.length;
    }
  }

  return stats;
}

/**
 * Get file extension from path
 */
export function getFileExtension(path: string): string {
  const parts = path.split('.');
  return parts.length > 1 ? parts[parts.length - 1]!.toLowerCase() : '';
}

/**
 * Check if file extension supports syntax highlighting
 */
export function supportsSyntaxHighlighting(extension: string): boolean {
  const supportedExtensions = [
    'js',
    'jsx',
    'ts',
    'tsx',
    'py',
    'java',
    'cpp',
    'c',
    'cs',
    'php',
    'rb',
    'go',
    'rs',
    'swift',
    'kt',
    'scala',
    'html',
    'css',
    'scss',
    'less',
    'json',
    'xml',
    'yaml',
    'yml',
    'md',
    'sql',
    'sh',
    'bash',
    'dockerfile',
    'docker',
    'gitignore',
    'env',
    'ini',
    'toml',
  ];
  return supportedExtensions.includes(extension);
}

/**
 * Get language identifier for syntax highlighting
 */
export function getLanguageFromExtension(extension: string): string {
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    php: 'php',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    html: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    sql: 'sql',
    sh: 'bash',
    bash: 'bash',
    dockerfile: 'dockerfile',
    docker: 'dockerfile',
    gitignore: 'gitignore',
    env: 'bash',
    ini: 'ini',
    toml: 'toml',
  };
  return languageMap[extension] || 'text';
}

/**
 * Parse file path to extract directory and filename
 */
export function parseFilePath(path: string): {
  directory: string;
  filename: string;
  fullPath: string;
} {
  const parts = path.split('/');
  const filename = parts[parts.length - 1] || '';
  const directory = parts.slice(0, -1).join('/');
  return {
    directory,
    filename,
    fullPath: path,
  };
}

/**
 * Get status color for diff status
 */
export function getStatusColor(status: DiffStatus): string {
  const colorMap: Record<DiffStatus, string> = {
    ADDED: 'text-green-600 bg-green-50 border-green-200',
    MODIFIED: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    REMOVED: 'text-red-600 bg-red-50 border-red-200',
    RENAMED: 'text-blue-600 bg-blue-50 border-blue-200',
    COPIED: 'text-purple-600 bg-purple-50 border-purple-200',
  };
  return colorMap[status] || colorMap.MODIFIED;
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if a search query matches file content
 */
export function matchesSearchQuery(
  query: string,
  text: string,
  caseSensitive: boolean = false
): boolean {
  if (!query.trim()) return true;
  const searchText = caseSensitive ? text : text.toLowerCase();
  const searchQuery = caseSensitive ? query : query.toLowerCase();
  return searchText.includes(searchQuery);
}

/**
 * Debounce function for search
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Create file tree structure from diffs
 */
export function createFileTree(diffs: FileDiff[]): Array<{
  index: number;
  path: string;
  status: DiffStatus;
  expanded: boolean;
  children?: Array<{
    index: number;
    path: string;
    status: DiffStatus;
    expanded: boolean;
    children?: Array<unknown>;
    isDirectory: boolean;
  }>;
  isDirectory: boolean;
}> {
  const tree: Array<{
    index: number;
    path: string;
    status: DiffStatus;
    expanded: boolean;
    children?: Array<{
      index: number;
      path: string;
      status: DiffStatus;
      expanded: boolean;
      children?: Array<unknown>;
      isDirectory: boolean;
    }>;
    isDirectory: boolean;
  }> = [];

  for (let i = 0; i < diffs.length; i++) {
    const diff = diffs[i]!;
    const path = diff.newPath || diff.oldPath || diff.displayPaths[0] || '';

    if (path) {
      tree.push({
        index: i,
        path,
        status: diff.status,
        expanded: false,
        isDirectory: false,
      });
    }
  }

  return tree;
}
