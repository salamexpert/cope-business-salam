import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  }, []);

  const setUserFromProfile = useCallback((profile) => {
    if (!profile) return;
    setUser({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      company: profile.company,
      phone: profile.phone,
      avatar_url: profile.avatar_url,
      wallet_balance: profile.wallet_balance,
      created_at: profile.created_at
    });
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).then(profile => {
          if (profile) setUserFromProfile(profile);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // IMPORTANT: Do NOT make this callback async - it causes a deadlock
    // with Supabase's internal auth lock mechanism
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          fetchProfile(session.user.id).then(profile => {
            if (profile) setUserFromProfile(profile);
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile, setUserFromProfile]);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const profile = await fetchProfile(data.user.id);
      if (!profile) {
        await supabase.auth.signOut();
        return { success: false, error: 'User profile not found' };
      }

      setUserFromProfile(profile);
      return { success: true, role: profile.role };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const signup = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: 'client' }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const needsConfirmation = data.user && !data.session;

    if (needsConfirmation) {
      return { success: true, needsConfirmation: true };
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name,
        email,
        role: 'client'
      });

    if (profileError) {
      console.error('Profile insert error:', profileError);
    }

    const profile = await fetchProfile(data.user.id);
    if (profile) {
      setUserFromProfile(profile);
    }

    return { success: true, needsConfirmation: false };
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'Not logged in' };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    setUser(prev => ({ ...prev, ...updates }));
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
