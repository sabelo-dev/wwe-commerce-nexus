
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
  logout: () => void;
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
    if (userRole === 'admin') {
      window.location.href = '/admin/dashboard';
    } else if (userRole === 'vendor') {
      window.location.href = '/vendor/dashboard';
    } else {
      window.location.href = '/';
    }
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
        .single();
      
      return !!vendor && vendor.status === 'approved';
    } catch (error) {
      console.error('Error checking vendor status:', error);
      return false;
    }
  };

  const loadUserProfile = async (session: Session | null) => {
    if (!session?.user) {
      clearAuthState();
      loadingManager.stopLoading();
      return;
    }

    try {
      // Fetch user profile from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, wait and try again (it should be created by trigger)
        setTimeout(async () => {
          try {
            const { data: retryProfile, error: retryError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (retryProfile && !retryError) {
              const userData: User = {
                id: retryProfile.id,
                email: retryProfile.email,
                name: retryProfile.name,
                avatar_url: retryProfile.avatar_url,
                role: retryProfile.role
              };
              setUser(userData);
              setIsAdmin(retryProfile.role === 'admin');
              
              // Check vendor status for any user (not just those with vendor role)
              const vendorStatus = await checkVendorStatus(retryProfile.id);
              setIsVendor(vendorStatus);
            }
          } catch (retryError) {
            console.error('Error on retry:', retryError);
          } finally {
            loadingManager.stopLoading();
          }
        }, 1000);
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
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      clearAuthState();
    } finally {
      loadingManager.stopLoading();
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
          if (mounted) loadingManager.stopLoading();
          return;
        }

        if (mounted) {
          setSession(session);
          await loadUserProfile(session);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) loadingManager.stopLoading();
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (mounted) {
          setSession(session);
          await loadUserProfile(session);
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
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        if (profile) {
          loadingManager.stopLoading('login');
          
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
          
          // Immediate redirect
          redirectBasedOnRole(profile.role);
        } else {
          loadingManager.stopLoading('login');
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "User profile not found",
          });
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
        
        // Immediate redirect
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
      await supabase.auth.signOut();
      clearAuthState();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out.",
      });
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
