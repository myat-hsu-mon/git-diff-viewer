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
}
