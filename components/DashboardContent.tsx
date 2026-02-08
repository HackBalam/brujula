"use client";

import { useWallet } from '@/context/WalletContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardContent() {
  const { address, disconnect, isKitReady } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (isKitReady && !address) {
      router.push('/');
    }
  }, [address, isKitReady, router]);

  const handleDisconnect = async () => {
    await disconnect();
    router.push('/');
  };

  if (!isKitReady || !address) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-white/70 mb-6">
        Wallet conectada: {address.slice(0, 6)}...{address.slice(-6)}
      </p>
      <button
        onClick={handleDisconnect}
        className="px-6 py-3 bg-[#2D6B2D] text-white rounded-full hover:bg-[#245524] transition-colors"
      >
        Desconectar
      </button>
    </div>
  );
}
