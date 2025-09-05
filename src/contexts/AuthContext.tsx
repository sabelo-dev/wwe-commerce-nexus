
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, Profile } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useLoadingManager } from "@/hooks/useLoadingManager";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ redirectPath?: string }>;
  register: (email: string, password: string, name: string, role?: 'consumer' | 'vendor') => Promise<{ redirectPath?: string }>;
  logout: () => Promise<void>;
  isVendor: boolean;
  isAdmin: boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isVendor, setIsVendor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const loadingManager = useLoadingManager();

  const getRedirectPathForRole = (userRole: string, isVendorApproved: boolean, isRegistration: boolean = false): string => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'vendor') {
      // For vendor registration, always redirect to onboarding
      // For vendor login, redirect to dashboard
      return isRegistration ? '/vendor/onboarding' : '/vendor/dashboard';
    }
    return '/';
  };

  const clearAuthState = () => {
    setUser(null);
    setSession(null);
    setIsVendor(false);
    setIsAdmin(false);
  };

  const checkVendorStatus = async (userId: string): Promise<boolean> => {
    try {
      const { data: vendor } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      return !!vendor && vendor.status === 'approved';
    } catch (error) {
      console.error('Error checking vendor status:', error);
      return false;
    }
  };

  const loadUserProfile = async (session: Session | null) => {
    if (!session?.user) {
      clearAuthState();
      loadingManager.stopLoading('auth');
      return;
    }

    try {
      // Fetch user profile from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        clearAuthState();
        loadingManager.stopLoading('auth');
        return;
      }
      
      if (profile) {
        const userData: User = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          avatar_url: profile.avatar_url,
          role: profile.role
        };
        setUser(userData);
        setIsAdmin(profile.role === 'admin');
        
        // Check vendor status
        const vendorStatus = await checkVendorStatus(profile.id);
        setIsVendor(vendorStatus);
      } else {
        // Create basic user data from session if no profile exists
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          avatar_url: session.user.user_metadata?.avatar_url || null,
          role: 'consumer'
        };
        setUser(userData);
        setIsAdmin(false);
        setIsVendor(false);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      clearAuthState();
    } finally {
      loadingManager.stopLoading('auth');
    }
  };

  const refreshUserProfile = async () => {
    if (session?.user) {
      loadingManager.startLoading('refresh');
      await loadUserProfile(session);
    }
  };

  useEffect(() => {
    let mounted = true;
    loadingManager.startLoading('auth');

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session:', session?.user?.id);
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) loadingManager.stopLoading('auth');
          return;
        }

        if (mounted) {
          setSession(session);
          await loadUserProfile(session);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) loadingManager.stopLoading('auth');
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (mounted) {
          setSession(session);
          
          // Handle auth events properly
          if (event === 'SIGNED_OUT') {
            clearAuthState();
            loadingManager.stopLoading('auth');
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            // Use setTimeout to prevent deadlock and allow proper state updates
            setTimeout(() => {
              if (mounted) {
                loadUserProfile(session);
              }
            }, 0);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ redirectPath?: string }> => {
    loadingManager.startLoading('login');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        loadingManager.stopLoading('login');
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message,
        });
        throw error;
      }
      
      if (data.user) {
        // Get user profile and vendor status for redirect
        const [profileResult, vendorResult] = await Promise.all([
          supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle(),
          checkVendorStatus(data.user.id)
        ]);
        
        const userRole = profileResult.data?.role || 'consumer';
        const redirectPath = getRedirectPathForRole(userRole, vendorResult, false);
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        
        loadingManager.stopLoading('login');
        return { redirectPath };
      }
      
      loadingManager.stopLoading('login');
      return {};
    } catch (error) {
      loadingManager.stopLoading('login');
      if (error instanceof Error && !error.message.includes("Login Failed")) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message,
        });
      }
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: 'consumer' | 'vendor' = 'consumer'): Promise<{ redirectPath?: string }> => {
    loadingManager.startLoading('register');
    
    try {
      console.log('Starting registration process...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: role
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      console.log('Registration response:', { data, error });
      
      if (error) {
        console.error('Registration error:', error);
        loadingManager.stopLoading('register');
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.message,
        });
        throw error;
      }
      
      // If user is immediately available (email confirmation disabled)
      if (data.user && !data.user.email_confirmed_at) {
        loadingManager.stopLoading('register');
        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account.",
        });
        return {};
      } else if (data.user) {
        const redirectPath = getRedirectPathForRole(role, false, true);
        
        toast({
          title: "Registration Successful",
          description: "Welcome to WWE Store!",
        });
        
        loadingManager.stopLoading('register');
        return { redirectPath };
      } else {
        loadingManager.stopLoading('register');
        return {};
      }
    } catch (error) {
      loadingManager.stopLoading('register');
      console.error('Registration failed:', error);
      if (error instanceof Error && !error.message.includes("Registration Failed")) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.message,
        });
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      loadingManager.startLoading('logout');
      
      // Clear state first to prevent any pending requests
      clearAuthState();
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          variant: "destructive",
          title: "Logout Failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out.",
      });
    } finally {
      loadingManager.stopLoading('logout');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading: loadingManager.isLoading, login, register, logout, isVendor, isAdmin, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthConsumer = AuthContext.Consumer;
