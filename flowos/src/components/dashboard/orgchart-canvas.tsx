"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
  ReactFlowProvider,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus, UserPlus, Sparkles } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { Employee } from "@/db/schema";

// ─── Tipos ─────────────────────────────────────────────────────────────

type EmployeeNodeData = {
  fullName: string;
  jobTitle: string;
  color: string;
};

type EmployeeNode = Node<EmployeeNodeData, "employee">;

// ─── Colores ─────────────────────────────────────────────────────────

const COLORS = ["#1A1814", "#C8902C", "#A6442B", "#5C6B41"];

// ─── Custom node ───────────────────────────────────────────────────────

function EmployeeNodeView({ data }: { data: EmployeeNodeData }) {
  const initials = data.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="group flex w-[200px] items-center gap-3 border bg-white p-3 transition-shadow hover:shadow-lg"
      style={{ borderColor: data.color }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: data.color, width: 8, height: 8 }}
      />
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center font-display text-sm text-white"
        style={{ background: data.color }}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-[#1A1814]">
          {data.fullName}
        </div>
        <div className="truncate text-xs text-[#1A1814]/60">{data.jobTitle}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: data.color, width: 8, height: 8 }}
      />
    </div>
  );
}

const nodeTypes = { employee: EmployeeNodeView };

// ─── Canvas ────────────────────────────────────────────────────────────

function OrgChartFlow() {
  const { employees, addEmployee, updateEmployee } = useEmployees();
  const [nodes, setNodes] = useState<EmployeeNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Convertir empleados a nodos
  useEffect(() => {
    const newNodes: EmployeeNode[] = (employees || []).map((emp: Employee) => ({
      id: emp.id,
      type: "employee",
      position: { x: emp.positionX || 0, y: emp.positionY || 0 },
      data: {
        fullName: emp.fullName,
        jobTitle: emp.jobTitle || "Sin asignar",
        color: emp.color || "#1A1814",
      },
    }));
    setNodes(newNodes);
  }, [employees]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updated = applyNodeChanges(changes, nodes) as EmployeeNode[];
      setNodes(updated);

      // Guardar posiciones en DB
      updated.forEach((node) => {
        const emp = employees?.find((e: Employee) => e.id === node.id);
        if (emp && (emp.positionX !== node.position.x || emp.positionY !== node.position.y)) {
          updateEmployee(node.id, {
            positionX: node.position.x,
            positionY: node.position.y,
          }).catch(console.error);
        }
      });
    },
    [nodes, employees, updateEmployee]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, type: "smoothstep" }, eds)),
    []
  );

  const handleAddEmployee = async () => {
    const fullName = prompt("Nombre del empleado");
    if (!fullName) return;
    const jobTitle = prompt("Puesto") || "Sin asignar";
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    await addEmployee({ fullName, jobTitle, color });
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={{
        type: "smoothstep",
        style: { stroke: "#1A1814", strokeWidth: 1.5 },
      }}
    >
      <Background color="#1A181420" gap={32} size={1} />
      <Controls className="!shadow-none !border !border-[hsl(var(--border))]" />
      <MiniMap
        nodeColor={(n) => (n.data as EmployeeNodeData)?.color || "#1A1814"}
        maskColor="rgba(250, 248, 243, 0.7)"
        className="!bg-[hsl(var(--background))] !border-[hsl(var(--border))]"
      />
      <Panel position="top-right" className="m-4">
        <button
          onClick={handleAddEmployee}
          className="flex items-center gap-2 bg-[hsl(var(--foreground))] px-4 py-2 text-sm text-[hsl(var(--background))] transition-transform hover:translate-y-[-1px]"
        >
          <UserPlus className="h-4 w-4" strokeWidth={2} />
          Sumar empleado
        </button>
      </Panel>
      <Panel position="top-left" className="m-4">
        <div className="flex items-center gap-2 border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-xs text-[hsl(var(--muted-foreground))]">
          <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--flow-ochre))]" />
          Arrastrá para mover. Conectá tirando de los handles.
        </div>
      </Panel>
    </ReactFlow>
  );
}

export function OrgChartCanvas() {
  return (
    <ReactFlowProvider>
      <OrgChartFlow />
    </ReactFlowProvider>
  );
}
