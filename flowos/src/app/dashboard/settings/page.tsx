"use client";

import { useEffect, useState } from "react";
import { auth } from "@clerk/nextjs/server";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <header className="mb-10">
        <span className="section-num">Config</span>
        <h1 className="mt-3 font-display text-5xl leading-tight">Ajustes</h1>
      </header>

      <div className="rule mb-10" />

      <div className="space-y-12">
        {/* Sección: Preferencias */}
        <section>
          <h2 className="font-display text-2xl mb-6">Preferencias</h2>
          <div className="space-y-4">
            <div className="border border-[hsl(var(--border))] p-6 rounded-lg">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm">
                  Recibir notificaciones por email
                </span>
              </label>
            </div>
            <div className="border border-[hsl(var(--border))] p-6 rounded-lg">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">
                  Notificaciones de cambios en org chart
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Sección: Zona de peligro */}
        <section className="border-t border-[hsl(var(--border))] pt-12">
          <h2 className="font-display text-2xl mb-6 text-[hsl(var(--flow-rust))]">
            Zona de peligro
          </h2>
          <div className="border border-[hsl(var(--flow-rust))] p-6 rounded-lg bg-[hsl(var(--flow-rust)/0.05)]">
            <h3 className="font-semibold mb-2">Eliminar organización</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
              Esta acción es irreversible. Se eliminarán todos los datos de la
              organización.
            </p>
            <button className="bg-[hsl(var(--flow-rust))] text-white px-4 py-2 text-sm hover:opacity-90">
              Eliminar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
