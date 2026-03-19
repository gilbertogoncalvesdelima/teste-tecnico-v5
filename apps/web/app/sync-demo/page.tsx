"use client";

import { useState, useCallback } from "react";
import { resolveConflict } from "@repo/shared/domain/SyncConflictResolver";
import type { Property } from "@repo/shared/domain/Property";

type Simulate = "success" | "conflict" | "fail";

interface QueuedItem {
  id: string;
  type: string;
  entityId: string;
  payload: unknown;
  status: "pending" | "processing" | "done" | "failed";
  result?: string;
}

function makeBaseProperty(entityId: string): Property {
  return {
    id: entityId,
    slug: `imovel-${entityId}`,
    title: `Imóvel ${entityId}`,
    description: "Descrição local",
    neighborhood: "Jardins",
    price: 600_000_00,
    area: 100,
    bedrooms: 2,
    suites: 1,
    parkingSpots: 1,
    status: "available",
    notes: ["Nota do corretor"],
    photos: [],
    amenities: [],
    updatedAt: Date.now() - 10000,
    updatedBy: "field_agent",
  } as Property;
}

export default function SyncDemoPage() {
  const [queue, setQueue] = useState<QueuedItem[]>([]);
  const [simulate, setSimulate] = useState<Simulate>("success");
  const [entityId, setEntityId] = useState("1");
  const [processing, setProcessing] = useState(false);
  const [lastConflict, setLastConflict] = useState<{
    strategy: string;
    requiresReview: boolean;
    resolved: Property;
  } | null>(null);

  const enqueue = useCallback(() => {
    const base = makeBaseProperty(entityId);
    setQueue((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: "UPDATE_STATUS",
        entityId,
        payload: { status: "reserved", baseVersion: base },
        status: "pending",
      },
    ]);
  }, [entityId]);

  const processOne = useCallback(async () => {
    const pending = queue.find((q) => q.status === "pending");
    if (!pending || processing) return;

    setProcessing(true);
    setQueue((prev) =>
      prev.map((q) => (q.id === pending.id ? { ...q, status: "processing" as const } : q))
    );

    const url = `/api/sync?simulate=${simulate}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: pending.type,
          entityId: pending.entityId,
          payload: pending.payload,
        }),
      });
      const data = await res.json();

      if (!data.success && data.serverVersion) {
        const local = makeBaseProperty(pending.entityId);
        const base = (pending.payload as { baseVersion?: Property })?.baseVersion ?? local;
        const conflictResult = resolveConflict(local, data.serverVersion, base);
        setLastConflict({
          strategy: conflictResult.strategy,
          requiresReview: conflictResult.requiresReview,
          resolved: conflictResult.resolved,
        });
        setQueue((prev) =>
          prev.map((q) =>
            q.id === pending.id
              ? { ...q, status: "done", result: `Conflito resolvido: ${conflictResult.strategy}` }
              : q
          )
        );
      } else if (!data.success) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === pending.id ? { ...q, status: "failed", result: data.error ?? "Erro" } : q
          )
        );
      } else {
        setQueue((prev) =>
          prev.map((q) => (q.id === pending.id ? { ...q, status: "done", result: "OK" } : q))
        );
      }
    } catch (e) {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === pending.id ? { ...q, status: "failed", result: String(e) } : q
        )
      );
    } finally {
      setProcessing(false);
    }
  }, [queue, processing, simulate]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setLastConflict(null);
  }, []);

  return (
    <div style={{ width: "100%", padding: "24px 0", fontFamily: "system-ui", boxSizing: "border-box" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Sync Offline — teste visual</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Enfileire operações e processe contra a API. Use &quot;Simular&quot; para sucesso, conflito ou falha.
      </p>

      <div style={{ marginBottom: 24, padding: 16, background: "#f8fafc", borderRadius: 8 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          entityId
        </label>
        <input
          type="text"
          value={entityId}
          onChange={(e) => setEntityId(e.target.value)}
          style={{ padding: 8, width: "100%", boxSizing: "border-box", marginBottom: 12 }}
        />
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          Resposta da API (simular)
        </label>
        <select
          value={simulate}
          onChange={(e) => setSimulate(e.target.value as Simulate)}
          style={{ padding: 8, width: "100%", marginBottom: 12 }}
        >
          <option value="success">success</option>
          <option value="conflict">conflict (serverVersion)</option>
          <option value="fail">fail (erro 500)</option>
        </select>
        <button
          type="button"
          onClick={enqueue}
          style={{
            padding: "10px 16px",
            background: "#1a5fb4",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            marginRight: 8,
          }}
        >
          Enfileirar
        </button>
        <button
          type="button"
          onClick={processOne}
          disabled={processing || !queue.some((q) => q.status === "pending")}
          style={{
            padding: "10px 16px",
            background: "#059669",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: processing ? "not-allowed" : "pointer",
            marginRight: 8,
          }}
        >
          {processing ? "Processando…" : "Processar próxima"}
        </button>
        <button
          type="button"
          onClick={clearQueue}
          style={{
            padding: "10px 16px",
            background: "#64748b",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Limpar fila
        </button>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Fila</h2>
        {queue.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>Nenhuma operação na fila. Clique em Enfileirar.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {queue.map((item) => (
              <li
                key={item.id}
                style={{
                  padding: 12,
                  marginBottom: 8,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {item.type} — {item.entityId}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    color:
                      item.status === "done"
                        ? "#059669"
                        : item.status === "failed"
                          ? "#dc2626"
                          : item.status === "processing"
                            ? "#1a5fb4"
                            : "#64748b",
                  }}
                >
                  {item.status}
                  {item.result != null ? ` (${item.result})` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {lastConflict && (
        <section
          style={{
            padding: 16,
            background: "#ecfdf5",
            border: "1px solid #059669",
            borderRadius: 8,
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Último conflito resolvido</h2>
          <p>
            <strong>Estratégia:</strong> {lastConflict.strategy}
          </p>
          <p>
            <strong>Requer revisão:</strong> {lastConflict.requiresReview ? "Sim" : "Não"}
          </p>
          <p>
            <strong>Status resolvido:</strong> {lastConflict.resolved.status}
          </p>
          {lastConflict.resolved.notes?.length ? (
            <p>
              <strong>Notas resolvidas:</strong> {lastConflict.resolved.notes.join(", ")}
            </p>
          ) : null}
        </section>
      )}

      <p style={{ marginTop: 32, fontSize: 14, color: "#94a3b8" }}>
        Rota: <code>POST /api/sync?simulate=success|conflict|fail</code>
      </p>
    </div>
  );
}
