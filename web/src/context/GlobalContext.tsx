"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

interface GlobalContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  wallet: string | null;
  setWallet: (wallet: string | null) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<string | null>(null);
  const [wallet, setWalletState] = useState<string | null>(null);

  // Cargar desde localStorage al montar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedWallet = localStorage.getItem('wallet');
    if (storedUser) setUserState(storedUser);
    if (storedWallet) setWalletState(storedWallet);
  }, []);

  // Guardar en localStorage cuando cambian
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', user);
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (wallet) {
      localStorage.setItem('wallet', wallet);
    } else {
      localStorage.removeItem('wallet');
    }
  }, [wallet]);

  const setUser = (u: string | null) => setUserState(u);
  const setWallet = (w: string | null) => setWalletState(w);

  return (
    <GlobalContext.Provider value={{ user, setUser, wallet, setWallet }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
}; 