import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Providers } from "../providers";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <Header />
      {children}
      <Footer />
    </Providers>
  );
}
