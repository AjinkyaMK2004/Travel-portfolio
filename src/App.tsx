import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Skeleton } from './components/common/Skeleton';

// Lazy load pages for chunk splitting and load speed optimizations
const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Journey = React.lazy(() => import('./pages/Journey').then(m => ({ default: m.Journey })));
const Explore = React.lazy(() => import('./pages/Explore').then(m => ({ default: m.Explore })));
const Gallery = React.lazy(() => import('./pages/Gallery').then(m => ({ default: m.Gallery })));
const Analytics = React.lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const Admin = React.lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));

// Generic page loading placeholder
const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] max-w-container-max mx-auto px-margin-desktop pt-32 space-y-6">
    <Skeleton className="h-12 w-48" />
    <Skeleton className="h-6 w-96" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  </div>
);


// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-background dark:bg-background text-on-background transition-colors duration-300 font-body-md">
              {/* Common Navigation Bar */}
              <Navbar />

              {/* Page Content */}
              <div className="flex-grow">
                <React.Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/journey" element={<Journey />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/admin" element={<Admin />} />
                    
                    {/* Redirect unmatched URLs back to Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </React.Suspense>
              </div>
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
