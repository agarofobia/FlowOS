"use client";

import { OrganizationProfile } from "@clerk/nextjs";

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <header className="mb-10">
        <span className="section-num">Personas</span>
        <h1 className="mt-3 font-display text-5xl leading-tight tracking-tight">
          Equipo
        </h1>
        <p className="mt-3 max-w-xl text-base text-[hsl(var(--muted-foreground))]">
          Invitá miembros, asigná roles y gestioná las membresías de tu organización.
        </p>
      </header>
      <div className="rule mb-10" />
      <OrganizationProfile
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border-none bg-transparent",
            navbar: "hidden",
            scrollBox: "bg-transparent",
          },
        }}
      />
    </div>
  );
}
