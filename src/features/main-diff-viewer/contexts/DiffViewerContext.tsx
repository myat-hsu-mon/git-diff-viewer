import { createContext, useContext, useEffect, useState } from 'react';
//types
import type { FileDiff, DiffViewerState, ThemeState } from '@/features/main-diff-viewer/types/diff';
//services
import { DiffService } from '@/features/main-diff-viewer/services/DiffService';
import { ThemeService } from '@/services/ThemeService';
//hooks
import { useDiffViewer } from '@/features/main-diff-viewer/hooks/useDiffViewer';

interface DiffViewerContextState {
  // Data
  diffs: FileDiff[];
  loading: boolean;
  error: string | null;

  // UI State
  state: DiffViewerState;
  theme: ThemeState;
}

interface DiffViewerContextActions {
  // Data actions
  loadDiffs: (file: File) => Promise<void>;
  clearDiffs: () => void;

  // State actions
  setSelectedFiles: (files: Set<number>) => void;
  toggleFileSelection: (fileIndex: number) => void;
  selectAllFiles: () => void;
  clearFileSelection: () => void;
  toggleFileExpansion: (fileIndex: number) => void;
  toggleHunkExpansion: (fileIndex: number, hunkIndex: number) => void;

  // Theme actions
  setTheme: (theme: ThemeState) => void;

  // Utility actions
  resetState: () => void;
}

type DiffViewerContextValue = DiffViewerContextState & DiffViewerContextActions;

const DiffViewerContext = createContext<DiffViewerContextValue | null>(null);

interface DiffViewerProviderProps {
  children: React.ReactNode;
  initialDiffs?: FileDiff[];
}

export default function DiffViewerProvider({
  children,
  initialDiffs = [],
}: DiffViewerProviderProps) {
  const [diffs, setDiffs] = useState<FileDiff[]>(initialDiffs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize theme from localStorage
  const [theme, setThemeState] = useState<ThemeState>(() => ThemeService.loadTheme());

  // Apply theme when it changes
  useEffect(() => {
    ThemeService.applyTheme(theme);
    ThemeService.saveTheme(theme);
  }, [theme]);

  // Initialize diff viewer state
  const diffViewer = useDiffViewer(diffs);

  // Load diffs from file
  const loadDiffs = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const data = await DiffService.loadFromFile(file);

      if (!DiffService.validateDiffData(data)) {
        throw new Error('Invalid diff data format');
      }

      const normalizedData = DiffService.normalizeDiffData(data);
      console.log({ normalizedData });
      setDiffs(normalizedData); //initialize diffs value

      // Reset state for new data
      diffViewer.resetState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load diff file');
    } finally {
      setLoading(false);
    }
  };

  // Clear diffs
  const clearDiffs = () => {
    setDiffs([]);
    setError(null);
    diffViewer.resetState();
  };

  // Set theme
  const setTheme = (newTheme: ThemeState) => {
    setThemeState(newTheme);
  };

  const contextValue: DiffViewerContextValue = {
    // State
    diffs,
    loading,
    error,
    state: diffViewer.state,
    theme,

    // Actions
    loadDiffs,
    clearDiffs,
    setSelectedFiles: diffViewer.setSelectedFiles,
    toggleFileSelection: diffViewer.toggleFileSelection,
    selectAllFiles: diffViewer.selectAllFiles,
    clearFileSelection: diffViewer.clearFileSelection,
    toggleFileExpansion: diffViewer.toggleFileExpansion,
    toggleHunkExpansion: diffViewer.toggleHunkExpansion,
    setTheme,
    resetState: diffViewer.resetState,
  };

  return <DiffViewerContext.Provider value={contextValue}>{children}</DiffViewerContext.Provider>;
}

/**
 * Hook to use the DiffViewer context
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useDiffViewerContext(): DiffViewerContextValue {
  const context = useContext(DiffViewerContext);

  if (!context) {
    throw new Error('useDiffViewerContext must be used within a DiffViewerProvider');
  }

  return context;
}
