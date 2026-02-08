"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useWallet } from "@/context/WalletContext";
import { ApplicationsProvider } from "@/context/ApplicationsContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { address, isKitReady } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (isKitReady && !address) {
      router.push("/");
    }
  }, [address, isKitReady, router]);

  if (!isKitReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#A4D900] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#A3A3A3]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!address) {
    return null;
  }

  return (
    <ApplicationsProvider walletAddress={address}>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Sidebar />
        <main className="pl-0 md:pl-[260px] pt-16">
          <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ApplicationsProvider>
  );
}
