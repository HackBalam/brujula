"use client";

import { Gem, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PremiumBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl p-4 sm:p-8 gradient-gold">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 shimmer pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/10 backdrop-blur-sm shrink-0">
            <Gem className="w-5 h-5 sm:w-7 sm:h-7 text-black" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-2xl font-bold text-black mb-0.5 sm:mb-1">
              ¿Listo para destacar?
            </h3>
            <p className="text-sm sm:text-base text-black">
              Optimiza tu CV con IA, simula entrevistas y más
            </p>
          </div>
        </div>

        <Button
          className="w-full sm:w-auto bg-white text-black hover:bg-white/90 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 font-semibold px-4 sm:px-6 text-sm sm:text-base"
        >
          Probar Premium 7 días gratis
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </section>
  );
}
