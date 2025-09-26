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

  const getRedirectPathForRole = (userRole: string, isVendorApproved: boolean, isLogin: boolean = true): string => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'vendor') {
      // For login: always go to dashboard if vendor exists, onboarding will redirect if needed
      // For register: go to onboarding for new vendor setup
      return isLogin ? '/vendor/dashboard' : '/vendor/onboarding';
    }
    return '/'; // Consumer goes to home page
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
        console.log('Initial session check:', session ? 'Session found' : 'No session');
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) loadingManager.stopLoading('auth');
          return;
        }

        if (mounted) {
          setSession(session);
          if (session) {
            await loadUserProfile(session);
          } else {
            loadingManager.stopLoading('auth');
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) loadingManager.stopLoading('auth');
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
        
        if (mounted) {
          setSession(session);
          
          // Handle auth events properly
          if (event === 'SIGNED_OUT') {
            clearAuthState();
            loadingManager.stopLoading('auth');
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            // Use setTimeout to prevent deadlock and allow proper state updates
            setTimeout(async () => {
              if (mounted && session) {
                await loadUserProfile(session);
              }
            }, 0);
          } else if (event === 'INITIAL_SESSION') {
            if (session) {
              setTimeout(async () => {
                if (mounted) {
                  await loadUserProfile(session);
                }
              }, 0);
            } else {
              loadingManager.stopLoading('auth');
            }
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
        const redirectPath = getRedirectPathForRole(userRole, vendorResult, true);
        
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
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: name,
            role: role
          }
        }
      });
      
      console.log('Registration response:', { data, error });
      
      if (error) {
        console.error('Registration error:', error);
        loadingManager.stopLoading('register');
        
        // Handle specific error cases
        let errorMessage = error.message;
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          errorMessage = "This email is already registered. Please try logging in instead.";
        } else if (error.message.includes('User already registered')) {
          errorMessage = "An account with this email already exists. Please sign in instead.";
        }
        
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: errorMessage,
        });
        throw error;
      }
      
      // Handle registration success
      if (data.user) {
        // Check if email confirmation is required
        if (!data.user.email_confirmed_at && data.session === null) {
          loadingManager.stopLoading('register');
          toast({
            title: "Registration Successful",
            description: "Please check your email to verify your account.",
          });
          return {};
        } else {
          // User is signed in immediately
          const redirectPath = getRedirectPathForRole(role, false, false);
          
          toast({
            title: "Registration Successful",
            description: "Welcome to LSI Platform!",
          });
          
          loadingManager.stopLoading('register');
          return { redirectPath };
        }
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