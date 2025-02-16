import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  username: string;
  id: string;
}

export const ProfileView = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">My Profile</h2>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">My Profile</h2>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {profile?.username || 'User'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {profile?.id ? 'Member' : 'Guest User'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</h3>
            <p className="text-lg text-gray-900 dark:text-white">{profile?.username || 'Not set'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</h3>
            <p className="text-lg text-gray-900 dark:text-white">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
