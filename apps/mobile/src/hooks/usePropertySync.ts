// apps/mobile/src/hooks/usePropertySync.ts

import { useCallback, useEffect } from "react";
import { usePropertyStore } from "../stores/propertyStore";
import { useOfflineQueue } from "./useOfflineQueue";
import { syncOperation } from "@repo/web/lib/api"; // shared sync function
import { resolveConflict } from "@repo/shared/domain/SyncConflictResolver";
import type { Property } from "@repo/shared/domain/Property";

/**
 * Hook que orquestra a sincronização de propriedades.
 *
 * Responsabilidades:
 * 1. Escuta mudanças de conectividade (NetInfo)
 * 2. Quando online, processa a fila de operações offline
 * 3. Quando server retorna conflito, usa SyncConflictResolver para resolver
 * 4. Atualiza o store local com o resultado da resolução
 *
 * CANDIDATO: Este hook é um "bonus" — se você implementou useOfflineQueue
 * e SyncConflictResolver corretamente, este hook é a cola entre eles.
 * Não é obrigatório implementá-lo completamente, mas ajuda na avaliação.
 */
export function usePropertySync() {
  const updateProperty = usePropertyStore((s) => s.updateProperty);

  const { enqueue, processQueue, pending, processing } = useOfflineQueue({
    executor: async (op) => {
      const result = await syncOperation({
        type: op.type,
        entityId: op.entityId,
        payload: op.payload,
      });

      if (!result.success && result.serverVersion) {
        const localProperty = usePropertyStore.getState().properties[op.entityId];
        if (localProperty) {
          const baseVersion = (op.payload as { baseVersion?: Property })?.baseVersion ?? localProperty;
          const { resolved } = resolveConflict(localProperty, result.serverVersion, baseVersion);
          updateProperty(op.entityId, resolved);
          return;
        }
      }

      if (!result.success && !result.serverVersion) {
        throw new Error(result.error ?? "Sync failed");
      }
    },
  });

  // TODO: Candidato pode adicionar listener de NetInfo aqui

  return {
    enqueue,
    processQueue,
    pending,
    processing,
  };
}
