import { useState } from 'react';
import type { FileDiff, DiffViewerState, ThemeState } from '@/features/main-diff-viewer/types/diff';
import { calculateDiffStats } from '@/utils/diff';

export interface UseDiffViewerOptions {
  initialTheme?: ThemeState;
}

export interface UseDiffViewerReturn {
  // State
  state: DiffViewerState;
  theme: ThemeState;
  stats: ReturnType<typeof calculateDiffStats>;

  // Actions
  setSelectedFiles: (files: Set<number>) => void;
  toggleFileSelection: (fileIndex: number) => void;
  selectAllFiles: () => void;
  clearFileSelection: () => void;
  toggleFileExpansion: (fileIndex: number) => void;
  toggleHunkExpansion: (fileIndex: number, hunkIndex: number) => void;
  setTheme: (theme: ThemeState) => void;
  resetState: () => void;
}

/**
 * Custom hook for managing diff viewer state
 */
export function useDiffViewer(
  diffs: FileDiff[],
  options: UseDiffViewerOptions = {}
): UseDiffViewerReturn {
  const { initialTheme = { theme: 'system', highContrast: false } } = options;

  const [state, setState] = useState<DiffViewerState>(() => ({
    selectedFiles: new Set([0]),
    expandedFiles: new Set(),
    expandedHunks: new Map(),
  }));

  const [theme, setTheme] = useState<ThemeState>(initialTheme);

  const stats = calculateDiffStats(diffs);

  const setSelectedFiles = (files: Set<number>) => {
    setState(prev => ({ ...prev, selectedFiles: files }));
  };

  const toggleFileSelection = (fileIndex: number) => {
    setState(prev => {
      const newSelectedFiles = new Set(prev.selectedFiles);
      if (newSelectedFiles.has(fileIndex)) {
        newSelectedFiles.delete(fileIndex);
      } else {
        newSelectedFiles.add(fileIndex);
      }
      return { ...prev, selectedFiles: newSelectedFiles };
    });
  };

  const selectAllFiles = () => {
    setState(prev => ({
      ...prev,
      selectedFiles: new Set(diffs.map((_, index) => index)),
    }));
  };

  const clearFileSelection = () => {
    setState(prev => ({ ...prev, selectedFiles: new Set() }));
  };

  const toggleFileExpansion = (fileIndex: number) => {
    setState(prev => {
      const newExpandedFiles = new Set(prev.expandedFiles);
      if (newExpandedFiles.has(fileIndex)) {
        newExpandedFiles.delete(fileIndex);
      } else {
        newExpandedFiles.add(fileIndex);
      }
      return { ...prev, expandedFiles: newExpandedFiles };
    });
  };

  const toggleHunkExpansion = (fileIndex: number, hunkIndex: number) => {
    setState(prev => {
      const newExpandedHunks = new Map(prev.expandedHunks);
      const fileHunks = newExpandedHunks.get(fileIndex) || new Set();
      const newFileHunks = new Set(fileHunks);

      if (newFileHunks.has(hunkIndex)) {
        newFileHunks.delete(hunkIndex);
      } else {
        newFileHunks.add(hunkIndex);
      }

      newExpandedHunks.set(fileIndex, newFileHunks);
      return { ...prev, expandedHunks: newExpandedHunks };
    });
  };

  const resetState = () => {
    setState({
      selectedFiles: new Set([0]),
      expandedFiles: new Set(),
      expandedHunks: new Map(),
    });
  };

  return {
    // State
    state,
    theme,
    stats,

    // Actions
    setSelectedFiles,
    toggleFileSelection,
    selectAllFiles,
    clearFileSelection,
    toggleFileExpansion,
    toggleHunkExpansion,
    setTheme,
    resetState,
  };
}
