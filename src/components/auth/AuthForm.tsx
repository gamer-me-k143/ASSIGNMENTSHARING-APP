import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AuthFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleSignup: (e: React.FormEvent) => Promise<void>;
  handleGuestAccess: () => void;
}

export const AuthForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleSignup,
  handleGuestAccess,
}: AuthFormProps) => {
  const [isSignup, setIsSignup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignup) {
      // Validate password match for signup
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
      await handleSignup(e);
    } else {
      await handleLogin(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4"
    >
      <div className="w-full max-w-md">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="px-8 py-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              TIME PASS PROJECT
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Assignment Share
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0 text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0 text-sm"
                  required
                  minLength={6}
                />
              </div>
              {isSignup && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0 text-sm"
                    required
                    minLength={6}
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 font-semibold rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                {isSignup ? "Create Account" : "Sign In"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="w-full py-3 font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {isSignup ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGuestAccess}
                className="w-full py-3 font-semibold rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                Continue as Guest
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
