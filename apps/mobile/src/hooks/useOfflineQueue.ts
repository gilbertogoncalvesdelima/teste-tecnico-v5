// apps/mobile/src/hooks/useOfflineQueue.ts

import { useState, useCallback, useRef } from "react";

export interface QueuedOperation {
  id: string;
  type: "UPDATE_STATUS" | "ADD_NOTE" | "ADD_PHOTO";
  entityId: string;
  payload: unknown;
  createdAt: number;
  retryCount: number;
  status: "PENDING" | "PROCESSING" | "FAILED" | "DONE";
}

export interface ProcessResult {
  processed: number;
  failed: number;
  skipped: number;
}

interface UseOfflineQueueOptions {
  executor: (op: QueuedOperation) => Promise<void>;
  maxRetries?: number;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useOfflineQueue({ executor, maxRetries = 5 }: UseOfflineQueueOptions) {
  const [queue, setQueue] = useState<QueuedOperation[]>([]);
  const queueRef = useRef<QueuedOperation[]>([]);
  queueRef.current = queue;
  const processingRef = useRef(false);

  const enqueue = useCallback(
    (op: Omit<QueuedOperation, "id" | "createdAt" | "retryCount" | "status">) => {
      setQueue((prev) => {
        const already = prev.some(
          (q) => q.entityId === op.entityId && q.type === op.type && q.status === "PENDING"
        );
        if (already) return prev;
        const newOp: QueuedOperation = {
          ...op,
          id: `${op.entityId}-${op.type}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          createdAt: Date.now(),
          retryCount: 0,
          status: "PENDING",
        };
        return [...prev, newOp];
      });
    },
    []
  );

  const processQueue = useCallback(async (): Promise<ProcessResult> => {
    if (processingRef.current) {
      return { processed: 0, failed: 0, skipped: 1 };
    }
    processingRef.current = true;
    const result: ProcessResult = { processed: 0, failed: 0, skipped: 0 };

    try {
      while (true) {
        let current = [...queueRef.current];
        const pending = current
          .filter((q) => q.status === "PENDING")
          .sort((a, b) => a.createdAt - b.createdAt);
        if (pending.length === 0) break;

        const op = pending[0];
        const idx = current.findIndex((q) => q.id === op.id);
        current = current.slice();
        current[idx] = { ...op, status: "PROCESSING" };
        setQueue(current);
        queueRef.current = current;

        try {
          await executor(current[idx]);
          current = current.slice();
          current[idx] = { ...current[idx], status: "DONE" };
          setQueue(current);
          queueRef.current = current;
          result.processed += 1;
        } catch {
          const nextRetry = op.retryCount + 1;
          if (nextRetry >= maxRetries) {
            current = current.slice();
            current[idx] = { ...current[idx], status: "FAILED", retryCount: nextRetry };
            setQueue(current);
            queueRef.current = current;
            result.failed += 1;
          } else {
            const backoffMs = 1000 * Math.pow(2, op.retryCount);
            await delay(backoffMs);
            current = current.slice();
            current[idx] = {
              ...current[idx],
              status: "PENDING",
              retryCount: nextRetry,
            };
            setQueue(current);
            queueRef.current = current;
          }
        }
      }
    } finally {
      processingRef.current = false;
    }

    return result;
  }, [executor, maxRetries]);

  const pending = queue.filter((q) => q.status === "PENDING" || q.status === "PROCESSING");
  const processing = queue.some((q) => q.status === "PROCESSING");

  return {
    enqueue,
    processQueue,
    pending,
    processing,
  };
}
