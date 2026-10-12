import React from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  {
    id: 'RG-1001',
    pin: '1234',
    name: 'Railway Operator',
    role: 'employee',
  },
  {
    id: 'DRV-1001',
    pin: '1234',
    name: 'Train Driver',
    role: 'driver',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('railguard_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (id, pin) => {
    const found = DEMO_USERS.find(
      (item) => item.id === id.trim() && item.pin === pin
    );

    if (!found) return false;

    const safeUser = {
      id: found.id,
      name: found.name,
      role: found.role,
    };

    setUser(safeUser);
    sessionStorage.setItem('railguard_user', JSON.stringify(safeUser));

    return true;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('railguard_user');
  };

  const value = useMemo(
    () => ({ user, login, logout }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
