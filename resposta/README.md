# Resumo do que foi feito

Resumo em linguagem simples do que foi entregue no teste técnico.

---

## Site (web)

- **Listagem de imóveis**: A página busca os dados no servidor para carregar rápido e aparecer bem em buscas. Os filtros (bairro, preço, suítes, metragem) funcionam na URL: dá para copiar o link e abrir em outra aba com os mesmos filtros.
- **Página do imóvel**: Dados do imóvel vêm do servidor; galeria de fotos, calculadora de financiamento e formulário de contato continuam interativos no cliente.
- **Filtros de busca**: Componente que filtra por bairro, faixa de preço, número de suítes e metragem mínima. Tudo refletido na URL, com testes cobrindo os cenários pedidos.
- **Página de demonstração do sync** (`/sync-demo`): Tela para testar a fila de operações offline e a resolução de conflitos (sucesso, conflito ou falha), usando a API de sync.

### Telas (screenshots)

| Arquivo | O que mostra |
|---------|----------------|
| `listagemImoveis.png` | Listagem geral com filtros na lateral e muitos resultados (ex.: 101). |
| `listagemImoveisFiltroMoema.png` | Listagem com filtro por bairro Moema (ex.: 9 resultados). |
| `listagemImoveisFiltroPinheiros.png` | Listagem com filtros Pinheiros, 4+ suítes e área mín. 200 m² (ex.: 4 resultados). |
| `listagemImoveisOrdenar.png` | Listagem com o dropdown "Ordenar por" aberto (mais relevantes, menor/maior preço, mais recentes). |
| `detalhesImovel.png` | Página do imóvel: galeria de fotos, título, especificações e simulação de custos (entrada e prazo). |
| `detalhesImovelFormularioVisita.png` | Mesma página do imóvel com a simulação e o formulário "Agendar visita" (nome, e-mail, telefone, enviar). |

---

## App mobile (React Native)

- **Performance**: Foi feita só a análise no arquivo DECISIONS: o que já existe (memo nos itens da lista, cache no store, animação no header) e o que faríamos a seguir se a lista tivesse 10 mil itens (altura fixa, carregar imagem só quando aparecer, listas por seção). Nenhuma mudança de código nesse módulo.
- **Sync offline**: Implementada a fila de operações (atualizar status, adicionar nota, adicionar foto) com nova tentativa em caso de falha e limite de tentativas. O hook de sync usa essa fila e, quando o servidor devolve conflito, usa o resolvedor de conflitos para decidir qual versão fica.
- **Resolvedor de conflitos** (código compartilhado): Regras de negócio para quando local e servidor mudaram ao mesmo tempo (por exemplo: status segue o servidor, notas/fotos seguem o local, preço segue o servidor; quando cada um mudou coisa diferente, faz merge).

---

## Documentação e decisões

- **DECISIONS.md**: Preenchido com respostas curtas sobre (1) por que os dados ficam no servidor e o interativo no cliente, (2) técnicas de performance no RN e próximos passos para lista grande, (3) fraqueza do sync e o que faríamos com mais tempo, (4) o bug mais difícil (erro de tipo no merge), (5) o que não mexeríamos em produção (ContactForm).

---

## Testes e qualidade

- Testes passando para: listagem, ficha do imóvel, filtros de busca, sync (fila e retry), resolvedor de conflitos, e os que já vinham no projeto.
- Build e lint ok no monorepo (web, mobile, shared).

---

## Estrutura em poucas palavras

- **Web**: Next.js; páginas de imóveis, filtros na URL, sync-demo e API de sync.
- **Mobile**: Telas e hooks de lista e sync; testes em ambiente Node (sem rodar no celular).
- **Shared**: Regras de domínio (imóvel, preço, resolução de conflito) usadas pela web e pelo mobile.

**Como rodar:** na raiz do projeto, `npm test`, `npm run build` e `npm run lint`. Para o site, `npm run dev` (e acessar a pasta web).
