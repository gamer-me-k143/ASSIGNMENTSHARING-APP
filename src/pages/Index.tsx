"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { Sidebar } from "@/components/navigation/Sidebar";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { UploadForm } from "@/components/assignments/UploadForm";
import { AssignmentList } from "@/components/assignments/AssignmentList";
import { ProfileView } from "@/components/profile/ProfileView";
import { UploadAnimation } from "@/components/common/UploadAnimation";

// Basic email validation function
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignupPage, setIsSignupPage] = useState(false); // Track if on signup page
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uploadedAssignments, setUploadedAssignments] = useState(0);
  const [uploadedAnswers, setUploadedAnswers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadAnimation, setShowUploadAnimation] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
      return;
    }

    setIsAuthenticated(false);
    setCurrentPage("dashboard");
    toast({
      title: "Success",
      description: "Successfully logged out",
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast({
            title: "Error",
            description: "Invalid email or password. Please check your login details or sign up.",
            variant: "destructive",
          });
          setIsAuthenticated(false); // Explicitly set isAuthenticated to false on login failure
        } else if (error.message.toLowerCase().includes('email not valid')) {
          toast({
            title: "Error",
            description: "The email address is not valid.",
            variant: "destructive",
          });
        }
         else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not valid')) {
          toast({
            title: "Error",
            description: "The email address is not valid.",
            variant: "destructive",
          });
        } else if (error.message === "Invalid login credentials") {
          toast({
            title: "Error",
            description: "Failed to create account. Please check your credentials and try again or signup.", // More generic error for signup fail
            variant: "destructive",
          });
        }
         else {
          console.error('Signup error:', error);
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        if (data.user.identities?.length === 0) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in.",
            variant: "destructive",
          });
          return;
        }

        // Set username in profiles table
        const username = email.split('@')[0];
        await supabase
          .from('profiles')
          .update({ username })
          .eq('id', data.user.id);

        toast({
          title: "Success",
          description: "Account created! Please check your email for verification.",
        });

        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      console.error('Catch error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGuestAccess = async () => {
    // Fake guest access by signing in with the provided guest credentials
    const { error } = await supabase.auth.signInWithPassword({
      email: "guest@gmail.com",
      password: "guest",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign in as guest.",
        variant: "destructive",
      });
    } else {
      setIsAuthenticated(true);
      toast({
        title: "Welcome!",
        description: "You are now browsing as a guest.",
      });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadedAssignments((prev) => prev + 1);
    setShowUploadAnimation(true);
    toast({
      title: "Success!",
      description: "Your assignment has been uploaded.",
    });

    setTimeout(() => {
      setShowUploadAnimation(false);
    }, 2000);
  };

  if (!isAuthenticated) {
    return (
      <AuthForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isSignupPage={isSignupPage} // Pass isSignupPage prop
        setIsSignupPage={setIsSignupPage} // Pass setIsSignupPage prop
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        handleGuestAccess={handleGuestAccess}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        handleLogout={handleLogout}
      />

      <main className="flex-1 overflow-auto relative">
        <UploadAnimation show={showUploadAnimation} />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentPage === "dashboard" && (
                <DashboardView
                  uploadedAssignments={uploadedAssignments}
                  uploadedAnswers={uploadedAnswers}
                />
              )}

              {currentPage === "upload-assignments" && (
                <UploadForm handleUpload={handleUpload} />
              )}

              {currentPage === "home-assignments" && (
                <AssignmentList
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              )}

              {currentPage === "my-profile" && <ProfileView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Index;
