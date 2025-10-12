'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';

function LayoutContent({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Pages that don't need authentication or sidebar
  const publicPages = ['/login', '/register', '/auth/callback'];
  const isPublicPage = publicPages.includes(pathname);

  // Redirect unauthenticated users to login page (but not from register page)
  useEffect(() => {
    if (!loading && !isAuthenticated && !isPublicPage) {
      // If user is on root path, redirect to register instead of login
      if (pathname === '/') {
        router.push('/register');
      } else {
        router.push('/login');
      }
    }
  }, [loading, isAuthenticated, isPublicPage, router, pathname]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // For public pages (login, register, auth callback), render without sidebar
  if (isPublicPage) {
    return children;
  }

  // For authenticated pages, render with sidebar and main content
  if (isAuthenticated) {
    return (
      <SidebarProvider>
        <DataProvider>
          <Sidebar />
          <MainContent>
            {children}
          </MainContent>
        </DataProvider>
      </SidebarProvider>
    );
  }

  // This should not be reached due to the useEffect redirect, but just in case
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600 font-medium">Redirecting...</p>
      </div>
    </div>
  );
}

export default function ConditionalLayout({ children }) {
  return (
    <AuthProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </AuthProvider>
  );
}
