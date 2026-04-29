"use client";

import { useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, isLoading } =
    useEmployees();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", jobTitle: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) return;

    if (editingId) {
      await updateEmployee(editingId, form);
      setEditingId(null);
    } else {
      await addEmployee({
        fullName: form.fullName,
        jobTitle: form.jobTitle,
        color: "#C8902C",
      });
    }

    setForm({ fullName: "", jobTitle: "" });
    setIsOpen(false);
  };

  const handleEdit = (id: string, data: any) => {
    setEditingId(id);
    setForm({ fullName: data.fullName, jobTitle: data.jobTitle || "" });
    setIsOpen(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <header className="mb-10">
        <span className="section-num">Equipo</span>
        <h1 className="mt-3 font-display text-5xl leading-tight">Empleados</h1>
      </header>

      <div className="rule mb-10" />

      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {employees?.length || 0} empleados
        </p>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({ fullName: "", jobTitle: "" });
            setIsOpen(true);
          }}
          className="flex items-center gap-2 bg-[hsl(var(--foreground))] px-4 py-2 text-sm text-[hsl(var(--background))] transition-transform hover:translate-y-[-1px]"
        >
          <Plus className="h-4 w-4" />
          Nuevo
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-[hsl(var(--muted-foreground))]">
          Cargando...
        </div>
      ) : employees && employees.length > 0 ? (
        <div className="border border-[hsl(var(--border))] overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[hsl(var(--border))] bg-[hsl(var(--secondary))]">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Nombre</th>
                <th className="px-6 py-3 text-left font-medium">Puesto</th>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp: any) => (
                <tr
                  key={emp.id}
                  className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary)/0.3)]"
                >
                  <td className="px-6 py-4">{emp.fullName}</td>
                  <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">
                    {emp.jobTitle || "-"}
                  </td>
                  <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">
                    {emp.email || "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(emp.id, emp)}
                      className="mr-3 text-[hsl(var(--flow-ochre))] hover:opacity-70"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteEmployee(emp.id)}
                      className="text-[hsl(var(--flow-rust))] hover:opacity-70"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
          <p>Sin empleados aún.</p>
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-[hsl(var(--background))] p-8 border border-[hsl(var(--border))]">
            <h2 className="font-display text-2xl mb-6">
              {editingId ? "Editar" : "Nuevo"} empleado
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="w-full border border-[hsl(var(--border))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--flow-ochre))]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Puesto</label>
                <input
                  type="text"
                  value={form.jobTitle}
                  onChange={(e) =>
                    setForm({ ...form, jobTitle: e.target.value })
                  }
                  className="w-full border border-[hsl(var(--border))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--flow-ochre))]"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] py-2 text-sm font-medium hover:opacity-90"
                >
                  {editingId ? "Guardar" : "Crear"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 border border-[hsl(var(--border))] py-2 text-sm hover:bg-[hsl(var(--secondary)/0.5)]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
