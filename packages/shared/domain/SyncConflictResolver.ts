// packages/shared/domain/SyncConflictResolver.ts

import type { Property } from "./Property";

export type ConflictStrategy = "LOCAL_WINS" | "SERVER_WINS" | "MERGED";

export interface ConflictResult {
  resolved: Property;
  strategy: ConflictStrategy;
  requiresReview: boolean;
  /** Campos que foram modificados em ambos os lados */
  conflictingFields: string[];
}

/**
 * Resolve conflitos de sincronização entre versão local e do servidor.
 *
 * Regras de negócio:
 * 1. Se apenas `status` mudou → SERVER_WINS (backoffice controla status)
 * 2. Se apenas `notes` ou `photos` mudaram → LOCAL_WINS (corretor em campo)
 * 3. Se `price` mudou nos dois lados → SERVER_WINS (proprietário define preço)
 * 4. Se campos DIFERENTES mudaram em cada lado → MERGED (sem conflito real)
 * 5. Se mesmo campo (exceto status/price) mudou nos dois → LOCAL_WINS + requiresReview=true
 *
 * @param local   - versão do dispositivo do corretor
 * @param server  - versão vinda do backend
 * @param base    - última versão sincronizada (ancestral comum)
 */
export function resolveConflict(
  local: Property,
  server: Property,
  base: Property
): ConflictResult {
  // TODO: Candidato deve implementar
  throw new Error("Not implemented");
}

/**
 * Detecta quais campos mudaram entre duas versões de uma Property.
 * Retorna array de nomes de campos que diferem.
 */
export function getChangedFields(a: Property, b: Property): (keyof Property)[] {
  // TODO: Candidato deve implementar
  throw new Error("Not implemented");
}
