import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//providers
import DiffViewerProvider from '@/features/main-diff-viewer/contexts/DiffViewerContext';
//features
import MainDiffViewerPage from './features/main-diff-viewer/pages/MainDiffViewerPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DiffViewerProvider>
        <MainDiffViewerPage />
      </DiffViewerProvider>
    </QueryClientProvider>
  );
}
