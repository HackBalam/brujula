"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface WalletContextType {
  address: string | null;
  isConnecting: boolean;
  isKitReady: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isKitReady, setIsKitReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initKit = async () => {
      if (typeof window === 'undefined') return;

      try {
        const { StellarWalletsKit } = await import('@creit-tech/stellar-wallets-kit/sdk');
        const { defaultModules } = await import('@creit-tech/stellar-wallets-kit/modules/utils');

        StellarWalletsKit.init({
          modules: defaultModules(),
        });

        setIsKitReady(true);
      } catch (error) {
        console.error('Error initializing Stellar Wallets Kit:', error);
      }
    };

    initKit();
  }, []);

  const connect = useCallback(async () => {
    if (!isKitReady) {
      console.error('Wallet Kit not initialized yet');
      return;
    }

    setIsConnecting(true);
    try {
      const { StellarWalletsKit } = await import('@creit-tech/stellar-wallets-kit/sdk');

      const { address: walletAddress } = await StellarWalletsKit.authModal();
      setAddress(walletAddress);
      setIsConnecting(false);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setIsConnecting(false);
    }
  }, [isKitReady, router]);

  const disconnect = useCallback(async () => {
    try {
      const { StellarWalletsKit } = await import('@creit-tech/stellar-wallets-kit/sdk');
      await StellarWalletsKit.disconnect();
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider value={{ address, isConnecting, isKitReady, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
