import { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginUser as apiLogin,
  registerUser as apiRegister,
  getCurrentUser
} from '../services/api';
import { getToken, setToken, clearToken } from '../services/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = getToken();
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        clearToken();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (credentials) => {
    setError(null);
    try {
      const { token, user } = await apiLogin(credentials);
      setToken(token);
      setUser(user);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const { token, user } = await apiRegister(userData);
      setToken(token);
      setUser(user);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setError
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