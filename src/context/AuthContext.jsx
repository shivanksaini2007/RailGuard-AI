import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const USER_KEY = 'railguard_user';

function readUser() {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [authLoading] = useState(false);

  // Frontend-only demo login. This is for a college prototype, not production security.
  const login = async (id, password) => {
    if (!String(password || '').trim()) {
      throw new Error('Please enter a password to continue.');
    }

    const cleanId = String(id || '').trim().toUpperCase();
    let nextUser;
    if (cleanId === 'DRV-1001') {
      nextUser = { id: 'DRV-1001', name: 'Train Driver', role: 'driver' };
    } else if (cleanId === 'RG-1001') {
      nextUser = { id: 'RG-1001', name: 'Railway Employee', role: 'employee' };
    } else {
      throw new Error('Use demo ID RG-1001 for Employee or DRV-1001 for Driver.');
    }

    sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const logout = async () => {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem('railguard_token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout, authLoading }), [user, authLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
