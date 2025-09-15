export type DiffStatus = 'ADDED' | 'MODIFIED' | 'REMOVED' | 'RENAMED' | 'COPIED';

export type LineStatus = 'UNCHANGED' | 'ADDED' | 'REMOVED';

export interface DiffPart {
  content: string;
  status: LineStatus;
}

export interface DiffLine {
  parts: DiffPart[];
  oldN?: number;
  newN?: number;
}

export interface DiffHunk {
  enclosingBlock?: string;
  oldLineCount: number;
  oldLineStart: number;
  newLineCount: number;
  newLineStart: number;
  beforeDiff: DiffLine[];
  afterDiff: DiffLine[];
}

export interface FileDiff {
  status: DiffStatus;
  displayPaths: string[];
  oldPath: string | null;
  newPath: string | null;
  hunks: DiffHunk[];
}

export interface DiffStats {
  totalFiles: number;
  addedFiles: number;
  modifiedFiles: number;
  removedFiles: number;
  renamedFiles: number;
  totalLinesAdded: number;
  totalLinesRemoved: number;
}

export interface DiffViewerState {
  selectedFiles: Set<number>;
  expandedFiles: Set<number>;
  expandedHunks: Map<number, Set<number>>;
}

export interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  highContrast: boolean;
  colorScheme?: 'default' | 'github' | 'gitlab' | 'vscode';
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
}

export interface FileTreeNode {
  index: number;
  path: string;
  status: DiffStatus;
  expanded: boolean;
  children?: FileTreeNode[];
  isDirectory: boolean;
}

export interface DiffViewerProps {
  diffs: FileDiff[];
  theme?: ThemeState;
  onFileSelectionChange?: (selectedFiles: Set<number>) => void;
}

export interface HunkProps {
  hunk: DiffHunk;
  isExpanded: boolean;
  onExpansionChange: (expanded: boolean) => void;
  fileExtension?: string;
}

export interface FileTreeProps {
  diffs: FileDiff[];
  selectedFiles: Set<number>;
  onFileSelectionChange: (selectedFiles: Set<number>) => void;
  visible: boolean;
  width?: number;
}

export interface StatusBadgeProps {
  status: DiffStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}
