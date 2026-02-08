import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Flex } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brújula - Trabajos Web3",
  description: "Organiza tus solicitudes de empleo, encuentra trabajos freelance verificados y recibe pagos seguros con tecnología Web3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoFlex.variable} antialiased`}
      >
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
