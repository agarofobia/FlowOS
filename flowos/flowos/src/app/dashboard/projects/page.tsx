"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

const STATUSES = ["todo", "in_progress", "in_review", "done"];
const STATUS_LABELS: Record<string, string> = {
  todo: "Por hacer",
  in_progress: "En progreso",
  in_review: "En revisión",
  done: "Completado",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("todo");
  const [isLoading, setIsLoading] = useState(true);

  // Cargar proyectos
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    if (data.length > 0 && !selectedProject) {
      setSelectedProject(data[0].id);
    }
    setIsLoading(false);
  };

  // Cargar tareas del proyecto seleccionado
  useEffect(() => {
    if (selectedProject) {
      fetchTasks();
    }
  }, [selectedProject]);

  const fetchTasks = async () => {
    const res = await fetch(`/api/tasks?projectId=${selectedProject}`);
    const data = await res.json();
    setTasks(data);
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newProjectName }),
    });
    const proj = await res.json();
    setProjects([...projects, proj]);
    setSelectedProject(proj.id);
    setNewProjectName("");
  };

  const createTask = async () => {
    if (!newTaskTitle.trim() || !selectedProject) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: selectedProject,
        title: newTaskTitle,
        status: newTaskStatus,
      }),
    });
    const task = await res.json();
    setTasks([...tasks, task]);
    setNewTaskTitle("");
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchTasks();
  };

  const deleteTask = async (taskId: string) => {
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    setTasks(tasks.filter((t: any) => t.id !== taskId));
  };

  const getTasksByStatus = (status: string) =>
    tasks.filter((t: any) => t.status === status);

  if (isLoading)
    return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="h-screen flex flex-col bg-[hsl(var(--background))]">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border))] p-8">
        <header className="mb-6">
          <span className="section-num">Proyectos</span>
          <h1 className="mt-3 font-display text-5xl leading-tight">Tasks</h1>
        </header>

        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Proyecto</label>
            <select
              value={selectedProject || ""}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="border border-[hsl(var(--border))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--flow-ochre))]"
            >
              {projects.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Nuevo proyecto..."
              className="border border-[hsl(var(--border))] px-3 py-2 text-sm"
            />
            <button
              onClick={createProject}
              className="bg-[hsl(var(--flow-moss))] text-white px-4 py-2 text-sm hover:opacity-90"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-8">
        <div className="flex gap-6 min-w-max">
          {STATUSES.map((status) => (
            <div
              key={status}
              className="flex-shrink-0 w-80 bg-[hsl(var(--secondary))] rounded-lg border border-[hsl(var(--border))]"
            >
              <div className="p-4 border-b border-[hsl(var(--border))]">
                <h2 className="font-semibold text-sm">
                  {STATUS_LABELS[status]}
                </h2>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  {getTasksByStatus(status).length} tareas
                </p>
              </div>

              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {getTasksByStatus(status).map((task: any) => (
                  <div
                    key={task.id}
                    className="bg-[hsl(var(--background))] p-3 rounded border border-[hsl(var(--border))] cursor-move hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-[hsl(var(--flow-rust))] hover:opacity-70"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex gap-1">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateTaskStatus(task.id, s)}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            s === status
                              ? "bg-[hsl(var(--flow-ochre))] text-white"
                              : "bg-[hsl(var(--border))] hover:bg-[hsl(var(--border)/0.7)]"
                          }`}
                        >
                          {STATUS_LABELS[s].slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {status === "todo" && (
                <div className="p-4 border-t border-[hsl(var(--border))]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTaskStatus === "todo" ? newTaskTitle : ""}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          setNewTaskStatus("todo");
                          createTask();
                        }
                      }}
                      placeholder="Nueva tarea..."
                      className="flex-1 border border-[hsl(var(--border))] px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--flow-ochre))]"
                    />
                    <button
                      onClick={() => {
                        setNewTaskStatus("todo");
                        createTask();
                      }}
                      className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-2 py-1 text-xs hover:opacity-90"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
