"use client";

import LiquidEther from "@/components/ui/LiquidEther";
import CardNav from "@/components/ui/CardNav";
import ShinyText from "@/components/ui/ShinyText";
import { useWallet } from "@/context/WalletContext";

const navItems = [
  {
    label: "Products",
    bgColor: "#2D6B2D",
    textColor: "#fff",
    links: [
      { label: "Features", href: "#features", ariaLabel: "View features" },
      { label: "Pricing", href: "#pricing", ariaLabel: "View pricing" },
    ],
  },
  {
    label: "Resources",
    bgColor: "#E8FFB0",
    textColor: "#000",
    links: [
      { label: "Documentation", href: "#docs", ariaLabel: "View documentation" },
      { label: "Tutorials", href: "#tutorials", ariaLabel: "View tutorials" },
    ],
  },
  {
    label: "Company",
    bgColor: "#B8E816",
    textColor: "#000",
    links: [
      { label: "About", href: "#about", ariaLabel: "About us" },
      { label: "Contact", href: "#contact", ariaLabel: "Contact us" },
    ],
  },
];

export default function Home() {
  const { connect, isConnecting } = useWallet();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Liquid Ether Background */}
      <div className="absolute inset-0 pointer-events-auto">
        <LiquidEther
          colors={["#B8E816", "#E8FFB0", "#2D6B2D"]}
          mouseForce={20}
          cursorSize={100}
          resolution={0.5}
          autoDemo={true}
          autoSpeed={0.5}
          className="!pointer-events-auto"
        />
      </div>

      {/* Card Navigation */}
      <CardNav
        logo="/brujula.png"
        logoAlt="Brujula Logo"
        items={navItems}
        baseColor="rgba(255, 255, 255, 0.95)"
        menuColor="#000"
        buttonBgColor="#2D6B2D"
        buttonTextColor="#fff"
      />

      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <ShinyText
              text="Brújula"
              speed={3}
              color="#ffffff"
              shineColor="#2D6B2D"
              spread={120}
            />
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-xl">
            Organiza tus solicitudes de empleo, encuentra trabajos freelance verificados y recibe pagos seguros con tecnología Web3. Sin intermediarios que retrasen tu dinero
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={connect}
              disabled={isConnecting}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-[#2D6B2D] rounded-full hover:bg-[#245524] transition-colors disabled:opacity-50"
            >
              {isConnecting ? 'Conectando...' : 'Comenzar Gratis'}
            </button>
            <a
              href="#learn-more"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border border-white/30 rounded-full hover:bg-white/10 transition-colors"
            >
              Ver como funciona
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
