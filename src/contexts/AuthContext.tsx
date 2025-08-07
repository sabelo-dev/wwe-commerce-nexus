
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, Profile } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useLoadingManager } from "@/hooks/useLoadingManager";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: 'consumer' | 'vendor') => Promise<void>;
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

  const redirectBasedOnRole = (userRole: string) => {
    console.log('Redirecting based on role:', userRole);
    const targetPath = userRole === 'admin' ? '/admin/dashboard' 
                     : userRole === 'vendor' ? '/vendor/dashboard' 
                     : '/';
    
    console.log('Target path:', targetPath);
    // Use a short delay to ensure state is properly set before redirect
    setTimeout(() => {
      window.location.href = targetPath;
    }, 100);
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
        
        // Check vendor status for any user (not just those with vendor role)
        const vendorStatus = await checkVendorStatus(profile.id);
        setIsVendor(vendorStatus);
      } else {
        // Profile doesn't exist yet, create basic user data from session
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

  const login = async (email: string, password: string) => {
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
      
      // Get user profile to determine role for redirect
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();
        
        console.log('Profile data after login:', profile, 'Error:', profileError);
        
        loadingManager.stopLoading('login');
        
        if (profile && profile.role) {
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
          
          console.log('Redirecting user with role:', profile.role);
          redirectBasedOnRole(profile.role);
        } else {
          // Profile will be created by trigger, default to consumer
          toast({
            title: "Login Successful", 
            description: "Welcome back!",
          });
          console.log('No profile found, redirecting as consumer');
          redirectBasedOnRole('consumer');
        }
      } else {
        loadingManager.stopLoading('login');
      }
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

  const register = async (email: string, password: string, name: string, role: 'consumer' | 'vendor' = 'consumer') => {
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
      } else if (data.user) {
        loadingManager.stopLoading('register');
        toast({
          title: "Registration Successful",
          description: "Welcome to WWE Store!",
        });
        
        // Let auth state change handle routing
        redirectBasedOnRole(role);
      } else {
        loadingManager.stopLoading('register');
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
