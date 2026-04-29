import type { Metadata } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlowOS — el sistema operativo de tu empresa",
  description:
    "Org chart, proyectos, wiki y CRM. Una sola herramienta. Una sola fuente de verdad.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://flowos.vercel.app",
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#1A1814",
          colorBackground: "#FAF8F3",
          colorText: "#1A1814",
          colorInputBackground: "#FAF8F3",
          fontFamily: "var(--font-inter-tight), system-ui, sans-serif",
          borderRadius: "0.5rem",
        },
        elements: {
          card: "shadow-none border border-[hsl(var(--border))]",
          formButtonPrimary:
            "bg-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground)/0.9)] text-[hsl(var(--background))]",
        },
      }}
    >
      <html
        lang="es"
        className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrains.variable}`}
      >
        <body className="font-sans antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
