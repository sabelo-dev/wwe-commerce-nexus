import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireVendor?: boolean;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false,
  requireAdmin = false,
  requireVendor = false,
  fallbackPath = '/'
}) => {
  const { user, isLoading, isAdmin, isVendor } = useAuth();

  // Show loading while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users if auth is required
  if (requireAuth && !user) {
    const loginPath = requireAdmin ? '/admin/login' : requireVendor ? '/vendor/login' : '/login';
    return <Navigate to={loginPath} replace />;
  }

  // Redirect authenticated users away from auth pages
  if (!requireAuth && user) {
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
    if (isVendor) return <Navigate to="/vendor/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // Check admin access
  if (requireAdmin && (!user || !isAdmin)) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check vendor access - allow vendors with any status to access dashboard
  if (requireVendor && (!user || user.role !== 'vendor')) {
    return <Navigate to="/vendor/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;