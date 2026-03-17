# 🧪 Teste Técnico — React & React Native Sênior v5.0

> **Formato**: Fork este repo → implemente → abra PR para `main`
> **Tempo**: 3h (informe horário de início e fim no PR)
> **Stack**: React 19, Next.js 15, React Native (New Arch), TypeScript
> **Dica**: Os tempos por módulo são sugestão. Priorize pelo peso na rubrica — não precisa completar tudo para pontuar bem.

---

## ⚠️ Regras Inegociáveis

```
1. Todos os testes devem passar:     npm test
2. O build deve funcionar:           npm run build
3. O linter não pode ter errors:     npm run lint
4. Commits incrementais obrigatórios (mín. 5 commits com mensagens descritivas)
5. Um commit gigante = eliminação automática
```

**Sobre uso de IA**: Pode usar qualquer ferramenta. Mas o código precisa funcionar, os testes precisam passar, e os commits precisam contar uma história coerente de resolução. Nós vamos ler seu histórico de commits.

---

## 📁 Estrutura do Repositório

```
├── apps/
│   ├── web/                    # Next.js 15 App Router
│   │   ├── app/
│   │   │   ├── imoveis/
│   │   │   │   ├── page.tsx              # Listagem (MÓDULO 2A)
│   │   │   │   ├── [slug]/
│   │   │   │   │   ├── page.tsx          # Ficha do imóvel (MÓDULO 2B)
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── components/
│   │   │   │   │       ├── GalleryClient.tsx
│   │   │   │   │       ├── PriceCalculator.tsx
│   │   │   │   │       └── ContactForm.tsx      # ← NÃO MEXA (tests verificam)
│   │   │   │   └── components/
│   │   │   │       ├── PropertyCard.tsx
│   │   │   │       ├── SearchFilters.tsx  # ← MÓDULO 3
│   │   │   │       └── MapView.tsx        # ← NÃO MEXA
│   │   │   └── layout.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── formatters.ts              # ← parece errado, MAS ESTÁ CERTO
│   │   │   └── types.ts
│   │   └── __tests__/
│   │       ├── property-card.test.tsx     # 6 passing
│   │       ├── gallery.test.tsx           # 4 passing
│   │       ├── price-calculator.test.tsx  # 8 passing
│   │       ├── search-filters.test.tsx    # 0 tests (VOCÊ ESCREVE)
│   │       ├── api.test.ts               # 7 passing
│   │       └── formatters.test.ts         # 6 passing (NÃO QUEBRE)
│   │
│   └── mobile/                 # React Native (mocks para teste)
│       ├── src/
│       │   ├── screens/
│       │   │   └── PropertyListScreen.tsx  # ← MÓDULO 4
│       │   ├── components/
│       │   │   ├── AnimatedHeader.tsx       
│       │   │   ├── PropertyListItem.tsx     
│       │   │   └── FavoriteButton.tsx       # ← NÃO MEXA
│       │   ├── hooks/
│       │   │   ├── usePropertySync.ts       # ← MÓDULO 5
│       │   │   └── useOfflineQueue.ts       # ← MÓDULO 5
│       │   └── stores/
│       │       └── propertyStore.ts         
│       └── __tests__/
│           ├── setup.ts                    # Mocks globais RN
│           ├── animated-header.test.tsx    # 3 passing
│           ├── property-list-item.test.tsx # 3 passing
│           ├── property-store.test.ts     # 5 passing
│           ├── sync.test.ts               # 0 tests (VOCÊ ESCREVE)
│           └── render-count.test.tsx      # 1 passing
│
├── packages/
│   └── shared/                 # Código compartilhado web + mobile
│       ├── domain/
│       │   ├── Property.ts                # Entidade de domínio
│       │   ├── PriceEngine.ts
│       │   └── SyncConflictResolver.ts    # ← MÓDULO 5
│       └── __tests__/
│           ├── price-engine.test.ts       # 9 passing
│           └── conflict-resolver.test.ts  # 0 tests (VOCÊ ESCREVE)
│
├── DECISIONS.md                # ← VOCÊ PREENCHE (obrigatório)
├── vitest.config.ts
├── vitest.workspace.ts         # Projetos: web (jsdom), mobile (node), shared (node)
├── package.json
└── turbo.json
```

---

## ✅ Status Atual: 0 testes falhando, 52 passando

```bash
$ npm test

 PASS  apps/web/__tests__/property-card.test.tsx        (6 passed)
 PASS  apps/web/__tests__/gallery.test.tsx               (4 passed)
 PASS  apps/web/__tests__/price-calculator.test.tsx       (8 passed)
 PASS  apps/web/__tests__/formatters.test.ts              (6 passed) ← NÃO QUEBRE
 PASS  apps/web/__tests__/api.test.ts                     (7 passed)
 SKIP  apps/web/__tests__/search-filters.test.tsx          (0 tests — VOCÊ ESCREVE)
 PASS  apps/mobile/__tests__/animated-header.test.tsx      (3 passed)
 PASS  apps/mobile/__tests__/property-list-item.test.tsx   (3 passed)
 PASS  apps/mobile/__tests__/property-store.test.ts        (5 passed)
 PASS  apps/mobile/__tests__/render-count.test.tsx          (1 passed)
 SKIP  apps/mobile/__tests__/sync.test.ts                  (0 tests — VOCÊ ESCREVE)
 PASS  packages/shared/__tests__/price-engine.test.ts       (9 passed)
 SKIP  packages/shared/__tests__/conflict-resolver.test.ts  (0 tests — VOCÊ ESCREVE)

Tests:  0 failed, 52 passed, 3 skipped
```

> Os 3 *skipped* são os arquivos de teste vazios dos módulos que VOCÊ implementa (search-filters, sync, conflict-resolver).

**Sua meta**: manter os 52 existentes passando + escrever os novos testes dos 3 módulos vazios

---

## Módulo 1 — Compreensão do Codebase (20 min)

> Leia o código antes de mexer. Todos os 52 testes passam — **não quebre nenhum**.

### O que NÃO mexer

#### 🪤 ARMADILHA: `formatters.ts`

O arquivo `lib/formatters.ts` tem um trecho que **parece** errado:

```typescript
// lib/formatters.ts
export function formatArea(meters: number): string {
  // Parece bug: por que não usar toLocaleString?
  const formatted = Math.round(meters).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted} m²`;
}

export function formatPrice(cents: number): string {
  // Parece bug: por que dividir por 100 e não usar Intl?
  const reais = cents / 100;
  const parts = reais.toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${parts.join(",")}`;
}
```

**Não mexa nesse arquivo.** Ele está correto e 6 testes dependem dele. Parece feio, mas lida com edge cases que `Intl.NumberFormat` não cobre neste contexto (valores em centavos vindos da API legada). Se você "melhorar" esse código, os testes vão quebrar.

#### 🔗 Arquitetura Cross-File: `PriceEngine.ts` ↔ `PriceCalculator.tsx` ↔ `api.ts`

A API legada retorna o preço em formato diferente para imóveis de luxo (centavos vs reais). O campo `priceInReais` indica qual formato. A função `normalizePriceToCents` no `PriceEngine.ts` lida com essa conversão. Entenda esse fluxo antes de criar novos componentes que lidam com preço.

> **Por que isso importa**: Seus novos testes e componentes precisam respeitar essa arquitetura. Não assuma que `price` está sempre em centavos.

---

## Módulo 2 — Server/Client Boundaries (30 min)

> Os arquivos `page.tsx` da ficha do imóvel misturam concerns. Refatore.

### 2A: Listagem (`imoveis/page.tsx`)

O componente atual está marcado como `"use client"` e faz `useEffect` + `fetch` para buscar imóveis. Refatore para:

- `page.tsx` ser um **Server Component** que busca dados via `lib/api.ts` direto
- O filtro de busca continuar interativo (Client Component separado)
- O estado do filtro viver nos `searchParams` da URL

**Testes relevantes**: `property-card.test.tsx` testa o componente `PropertyCard` isolado. Ele não deve quebrar.

### 2B: Ficha do Imóvel (`imoveis/[slug]/page.tsx`)

Refatore para que:

- Dados do imóvel (título, preço, descrição, endereço) venham do Server Component
- A galeria de fotos (`GalleryClient.tsx`) permaneça Client Component
- A calculadora de financiamento (`PriceCalculator.tsx`) permaneça Client Component
- O formulário de contato (`ContactForm.tsx`) NÃO seja alterado

No arquivo `DECISIONS.md`, responda em **máximo 3 linhas**: por que você desenhou a boundary server/client nesse ponto e não em outro?

> **Como verificamos**: code review manual da PR. Não há teste automatizado para esta separação.

---

## Módulo 3 — Busca Facetada com Testes (30 min)

> O arquivo `search-filters.test.tsx` existe mas está vazio. Você vai implementar o componente E os testes.

### Requisitos do `SearchFilters`

Implemente o componente `SearchFilters.tsx` que:

1. Filtra por: bairro (multi-select), faixa de preço (min/max), nº de suítes (1-5+), metragem mínima
2. Cada mudança de filtro atualiza os `searchParams` da URL (sem reload)
3. A URL é a fonte de verdade — se eu copiar a URL com filtros e abrir em outra aba, os filtros devem estar aplicados
4. Funciona SEM JavaScript no primeiro render (os filtros vêm dos `searchParams` do Server Component)

### Testes obrigatórios (escreva em `search-filters.test.tsx`)

Escreva **no mínimo 5 testes** que cubram:

- [ ] Filtro de bairro aplica corretamente nos searchParams
- [ ] Faixa de preço com min > max mostra erro de validação
- [ ] Limpar filtros reseta a URL para estado inicial
- [ ] Filtros são restaurados corretamente a partir de uma URL com query strings
- [ ] Pelo menos 1 teste de edge case à sua escolha (documente por quê no teste)

```typescript
// search-filters.test.tsx — estrutura esperada
describe("SearchFilters", () => {
  it("aplica filtro de bairro nos searchParams", () => { /* ... */ });
  it("mostra erro quando preço mínimo > máximo", () => { /* ... */ });
  it("limpar filtros reseta URL", () => { /* ... */ });
  it("restaura filtros a partir da URL", () => { /* ... */ });
  it("[SEU EDGE CASE]: ...", () => { /* ... */ });
});
```

---

## Módulo 4 — React Native Performance (30 min)

> Os testes `render-count.test.tsx`, `animated-header.test.tsx` e `property-list-item.test.tsx` **já passam**. O código em `PropertyListItem.tsx`, `propertyStore.ts` e `AnimatedHeader.tsx` já contém otimizações de performance aplicadas.
>
> **Este módulo é puramente analítico — nenhum código precisa ser alterado.** Os testes já passam. Sua entrega é no `DECISIONS.md`.

### Sua tarefa

Analise os 3 arquivos e os testes correspondentes. No `DECISIONS.md`, documente:

1. **Quais técnicas de performance foram usadas** em cada arquivo e por quê (máx 3 linhas por arquivo):
   - `PropertyListItem.tsx`
   - `propertyStore.ts`
   - `AnimatedHeader.tsx`

2. **O que aconteceria** se você removesse o `React.memo` do `PropertyListItem` e o cache manual do `selectPropertyList` — quantos re-renders o teste `render-count.test.tsx` detectaria e por quê? (máx 5 linhas)

### Pergunta de escala (máx 5 linhas):

> Se este app tivesse 10.000 itens com imagens, vídeos inline e seções colapsáveis, quais seriam suas 3 primeiras ações para garantir 60fps? Não repita técnicas já presentes no código — queremos saber o PRÓXIMO passo.

---

## Módulo 5 — Sync Offline com Conflict Resolution (40 min)

> Os arquivos `usePropertySync.ts`, `useOfflineQueue.ts` e `SyncConflictResolver.ts` estão incompletos.

### Contexto de negócio

Corretores de imóveis visitam propriedades em áreas sem sinal. Eles precisam:
- Atualizar status do imóvel (disponível → reservado → vendido)
- Adicionar fotos e notas
- Tudo funciona offline e sincroniza quando voltar o sinal

### 5A: Implemente `useOfflineQueue.ts`

O hook deve:

```typescript
interface QueuedOperation {
  id: string;
  type: "UPDATE_STATUS" | "ADD_NOTE" | "ADD_PHOTO";
  entityId: string;
  payload: unknown;
  createdAt: number;
  retryCount: number;
  status: "PENDING" | "PROCESSING" | "FAILED" | "DONE";
}

interface UseOfflineQueue {
  enqueue(op: Omit<QueuedOperation, "id" | "createdAt" | "retryCount" | "status">): void;
  processQueue(): Promise<ProcessResult>;
  pending: QueuedOperation[];
  processing: boolean;
}
```

**Requisitos verificados por teste**:

- Enfileira operações com status PENDING
- `processQueue` processa em ordem FIFO
- Retry com backoff exponencial (1s, 2s, 4s, 8s — máx 5 tentativas)
- Após 5 falhas, marca como FAILED (não tenta mais)
- Operações são idempotentes (se a mesma `entityId` + `type` já está na fila com status PENDING, não duplica)
- Se `processQueue` é chamado enquanto já está processando, retorna sem fazer nada (lock)

### 5B: Implemente `SyncConflictResolver.ts`

```typescript
// O teste vai chamar assim:
const result = resolver.resolve(localVersion, serverVersion, baseVersion);
// result: { resolved: Property, strategy: "LOCAL_WINS" | "SERVER_WINS" | "MERGED" }
```

**Regras de negócio (customizadas para este domínio — IA não conhece)**:

1. Se apenas `status` mudou: **server wins** (status é controlado pelo backoffice)
2. Se apenas `notes` ou `photos` mudaram: **local wins** (corretor em campo tem a informação mais recente)
3. Se `price` mudou nos dois: **server wins** (preço é definido pelo proprietário via backoffice)
4. Se campos diferentes mudaram em cada lado: **merge** (combina os dois sem conflito)
5. Se o mesmo campo (que não seja status nem price) mudou nos dois: **local wins** com flag `requiresReview: true`

### Testes obrigatórios (escreva em `sync.test.ts` e `conflict-resolver.test.ts`)

**`sync.test.ts`** — mínimo 4 testes:
- [ ] Enfileira e processa operação com sucesso
- [ ] Retry com backoff após falha
- [ ] Não duplica operação idempotente
- [ ] Marca FAILED após 5 tentativas

**`conflict-resolver.test.ts`** — mínimo 5 testes (1 para cada regra acima)

---

## 📝 DECISIONS.md (Obrigatório)

Crie este arquivo na raiz do repo com o seguinte formato. Respostas **curtas e opinativas** — máximo de linhas indicado por pergunta. Respostas genéricas ou "em cima do muro" serão penalizadas.

```markdown
# Decisões Técnicas

## 1. Boundary Server/Client (máx 3 linhas)
[Sua resposta aqui — por que a boundary está onde está?]

## 2. Próximos passos de performance RN (máx 5 linhas)
[Sua resposta aqui — o que faria ALÉM do que já corrigiu?]

## 3. Trade-off do Sync (máx 5 linhas)
A resolução de conflito que implementei tem uma fraqueza: [descreva].
Se tivesse mais tempo, eu: [descreva].

## 4. O bug mais difícil (máx 3 linhas)
O bug que mais demorei para encontrar foi: [qual].
Porque: [por que foi difícil].

## 5. O que eu NÃO mexeria em produção (máx 3 linhas)
Se este fosse um app real, o arquivo que eu NÃO refatoraria agora é: [qual].
Porque: [justifique — custo vs benefício].
```

---

## 🏁 Critérios de Avaliação

### Eliminatório (não passa = não avaliamos o resto)

| Critério | Comando |
|----------|---------|
| Testes passam | `npm test` → 0 failures |
| Build funciona | `npm run build` → exit 0 |
| Lint limpo | `npm run lint` → 0 errors |
| Mínimo 5 commits | `git log --oneline \| wc -l` ≥ 5 |
| DECISIONS.md existe e preenchido | — |
| Testes que já passavam continuam passando | Os 52 originais intactos |

### Pontuação (0-100)

| Módulo | Peso | O que avaliamos |
|--------|------|-----------------|
| 1 — Compreensão | 10% | Não quebrou nenhum dos 52 testes, DECISIONS.md coerente |
| 2 — Server/Client | 20% | Separação correta, dados no servidor, interatividade no client |
| 3 — Busca + Testes | 25% | Componente funcional, testes relevantes, URL como source of truth |
| 4 — Performance RN | 15% | Render count ≤ 2, memoização correta, Reanimated correto |
| 5 — Sync Offline | 30% | Queue robusta, conflict resolver com TODAS as regras, testes |

### Boa sorte! 🚀
