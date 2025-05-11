
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/types";
import { mockUsers } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Add the admin user to the mockUsers array if not already present
const adminUser: User = {
  id: "admin1",
  email: "lsigroupapi@gmail.com",
  name: "Sabelo Mkhatshwa",
  role: "admin",
};

// Check if the admin user already exists, if not add it
if (!mockUsers.some(user => user.email === adminUser.email)) {
  mockUsers.push(adminUser);
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isVendor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVendor, setIsVendor] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("wweUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Check if the user is a vendor in Supabase
    const checkVendorStatus = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('vendors')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          setIsVendor(!!data && data.status === 'approved');
        } catch (error) {
          console.error("Error checking vendor status:", error);
        }
      } else {
        setIsVendor(false);
      }
    };
    
    checkVendorStatus();
    setIsLoading(false);
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check for our hardcoded admin user first for Sabelo
      if (email === "lsigroupapi@gmail.com" && password === "Hermes@143") {
        setUser(adminUser);
        localStorage.setItem("wweUser", JSON.stringify(adminUser));
        toast({
          title: "Admin Login Successful",
          description: `Welcome back, ${adminUser.name || adminUser.email}!`,
        });
        return;
      }
      
      // For other users, find by email
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        // In a real app, we would verify password hash here
        setUser(foundUser);
        localStorage.setItem("wweUser", JSON.stringify(foundUser));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${foundUser.name || foundUser.email}!`,
        });
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email already exists
      const userExists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (userExists) {
        throw new Error("Email already in use");
      }
      
      // Create new user
      const newUser: User = {
        id: `u${Date.now()}`,
        email,
        name,
        role: "customer",
      };
      
      // In a real app, we would store this in a database
      setUser(newUser);
      localStorage.setItem("wweUser", JSON.stringify(newUser));
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsVendor(false);
    localStorage.removeItem("wweUser");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isVendor }}>
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
