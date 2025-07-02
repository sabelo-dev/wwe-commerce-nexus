
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, Profile } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isVendor, setIsVendor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

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
      setIsLoading(false);
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
            setIsLoading(false);
          }
        }, 1000);
      } else if (profile) {
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
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      clearAuthState();
      setIsLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    if (session?.user) {
      setIsLoading(true);
      await loadUserProfile(session);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session:', session?.user?.id);
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setIsLoading(false);
          return;
        }

        if (mounted) {
          setSession(session);
          await loadUserProfile(session);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) setIsLoading(false);
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
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Get user profile to determine role for redirect
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        if (profile) {
          // Set loading to false before redirect
          setIsLoading(false);
          
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
          
          // Short delay then redirect
          setTimeout(() => redirectBasedOnRole(profile.role), 500);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: 'consumer' | 'vendor' = 'consumer') => {
    setIsLoading(true);
    
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
        throw error;
      }
      
      // If user is immediately available (email confirmation disabled)
      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account.",
        });
        setIsLoading(false);
      } else if (data.user) {
        toast({
          title: "Registration Successful",
          description: "Welcome to WWE Store!",
        });
        
        // Redirect based on role
        setTimeout(() => redirectBasedOnRole(role), 100);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Registration failed:', error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
      });
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
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isVendor, isAdmin, refreshUserProfile }}>
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
