"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Block {
  id: string;
  type: "heading" | "text" | "list";
  content: string;
}

export default function DocsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [title, setTitle] = useState("");
  const [newDocTitle, setNewDocTitle] = useState("");

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    // Simulado: en producción iría a la API
    const stored = localStorage.getItem("flowos-docs");
    if (stored) {
      setDocs(JSON.parse(stored));
    }
  };

  const createDoc = async () => {
    if (!newDocTitle.trim()) return;
    const newDoc = {
      id: Date.now().toString(),
      title: newDocTitle,
      content: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...docs, newDoc];
    setDocs(updated);
    localStorage.setItem("flowos-docs", JSON.stringify(updated));
    setSelectedDocId(newDoc.id);
    setTitle(newDoc.title);
    setBlocks([]);
    setNewDocTitle("");
  };

  const loadDoc = (docId: string) => {
    const doc = docs.find((d) => d.id === docId);
    if (doc) {
      setSelectedDocId(docId);
      setTitle(doc.title);
      setBlocks(doc.content || []);
    }
  };

  const addBlock = (type: "heading" | "text" | "list") => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: "",
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const saveDoc = () => {
    if (!selectedDocId) return;
    const updated = docs.map((d) =>
      d.id === selectedDocId ? { ...d, title, content: blocks } : d
    );
    setDocs(updated);
    localStorage.setItem("flowos-docs", JSON.stringify(updated));
    alert("Guardado!");
  };

  return (
    <div className="flex h-screen bg-[hsl(var(--background))]">
      {/* Sidebar de docs */}
      <aside className="w-64 border-r border-[hsl(var(--border))] overflow-y-auto">
        <div className="p-4 border-b border-[hsl(var(--border))]">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              placeholder="Nuevo documento..."
              className="flex-1 border border-[hsl(var(--border))] px-3 py-2 text-sm"
            />
            <button
              onClick={createDoc}
              className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-3 py-2"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="label text-[10px]">
            {docs.length} documentos
          </span>
        </div>
        <nav className="p-3 space-y-1">
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => loadDoc(doc.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                selectedDocId === doc.id
                  ? "bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]"
                  : "hover:bg-[hsl(var(--secondary)/0.5)]"
              }`}
            >
              {doc.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selectedDocId ? (
          <>
            <div className="border-b border-[hsl(var(--border))] p-8">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-display text-5xl w-full focus:outline-none bg-transparent"
              />
              <div className="mt-6 flex gap-2">
                <button
                  onClick={saveDoc}
                  className="bg-[hsl(var(--flow-ochre))] text-white px-4 py-2 text-sm hover:opacity-90"
                >
                  Guardar
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-8 py-12">
                {blocks.length === 0 ? (
                  <div className="text-center text-[hsl(var(--muted-foreground))]">
                    <p>Sin contenido aún. Agrega bloques abajo.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blocks.map((block) => (
                      <div key={block.id} className="group relative">
                        {block.type === "heading" && (
                          <textarea
                            value={block.content}
                            onChange={(e) =>
                              updateBlock(block.id, e.target.value)
                            }
                            placeholder="Encabezado..."
                            className="w-full font-display text-3xl focus:outline-none resize-none bg-transparent"
                            rows={1}
                          />
                        )}
                        {block.type === "text" && (
                          <textarea
                            value={block.content}
                            onChange={(e) =>
                              updateBlock(block.id, e.target.value)
                            }
                            placeholder="Párrafo..."
                            className="w-full text-base focus:outline-none resize-none bg-transparent"
                            rows={3}
                          />
                        )}
                        {block.type === "list" && (
                          <textarea
                            value={block.content}
                            onChange={(e) =>
                              updateBlock(block.id, e.target.value)
                            }
                            placeholder="Items (uno por línea)..."
                            className="w-full text-sm focus:outline-none resize-none bg-transparent"
                            rows={3}
                          />
                        )}
                        <button
                          onClick={() => deleteBlock(block.id)}
                          className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-[hsl(var(--flow-rust))] hover:opacity-70"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add block buttons */}
                <div className="mt-12 flex gap-2 justify-center">
                  <button
                    onClick={() => addBlock("heading")}
                    className="border border-[hsl(var(--border))] px-4 py-2 text-sm hover:bg-[hsl(var(--secondary)/0.5)]"
                  >
                    + Encabezado
                  </button>
                  <button
                    onClick={() => addBlock("text")}
                    className="border border-[hsl(var(--border))] px-4 py-2 text-sm hover:bg-[hsl(var(--secondary)/0.5)]"
                  >
                    + Párrafo
                  </button>
                  <button
                    onClick={() => addBlock("list")}
                    className="border border-[hsl(var(--border))] px-4 py-2 text-sm hover:bg-[hsl(var(--secondary)/0.5)]"
                  >
                    + Lista
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[hsl(var(--muted-foreground))]">
            <p>Crea o selecciona un documento para empezar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
