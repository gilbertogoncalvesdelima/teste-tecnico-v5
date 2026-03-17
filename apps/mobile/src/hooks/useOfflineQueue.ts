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
  /** Função que executa a operação remota. Deve lançar erro se falhar. */
  executor: (op: QueuedOperation) => Promise<void>;
  /** Máximo de tentativas antes de marcar como FAILED (default: 5) */
  maxRetries?: number;
}

/**
 * Hook para gerenciar fila de operações offline.
 *
 * CANDIDATO: Implemente este hook seguindo os requisitos:
 *
 * - enqueue: Adiciona operação com status PENDING. Gera id único (uuid ou timestamp).
 *   Se já existe operação PENDING com mesma entityId + type, NÃO duplica (idempotência).
 *
 * - processQueue: Processa operações PENDING em ordem FIFO (createdAt crescente).
 *   Para cada operação:
 *     1. Marca como PROCESSING
 *     2. Chama executor(op)
 *     3. Se sucesso → marca como DONE
 *     4. Se falha → incrementa retryCount, volta para PENDING
 *     5. Se retryCount >= maxRetries → marca como FAILED
 *   Retry com backoff exponencial: delay = 1000 * 2^retryCount (1s, 2s, 4s, 8s, 16s)
 *   Se processQueue é chamado enquanto já está processando → retorna sem fazer nada.
 *
 * - pending: Array de operações com status PENDING ou PROCESSING
 *
 * - processing: boolean indicando se está processando a fila
 */
export function useOfflineQueue({ executor, maxRetries = 5 }: UseOfflineQueueOptions) {
  // TODO: Candidato implementa

  const enqueue = useCallback(
    (op: Omit<QueuedOperation, "id" | "createdAt" | "retryCount" | "status">) => {
      throw new Error("Not implemented");
    },
    []
  );

  const processQueue = useCallback(async (): Promise<ProcessResult> => {
    throw new Error("Not implemented");
  }, []);

  return {
    enqueue,
    processQueue,
    pending: [] as QueuedOperation[],
    processing: false,
  };
}
