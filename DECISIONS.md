# Decisões Técnicas

> Preencha cada seção respeitando o limite de linhas. Respostas genéricas serão penalizadas.
> Queremos opinião, não hedge.

## 1. Boundary Server/Client (máx 3 linhas)

<!-- Por que a boundary server/client está onde você colocou? O que é servidor e o que é cliente, e por quê? -->

Servidor busca e entrega os dados (listagem e ficha). Cliente cuida do que o usuário interage: filtros, galeria, calculadora. Assim a página carrega rápido e o que precisa de clique fica no cliente.

## 2. Próximos passos de performance RN (máx 5 linhas)

<!-- Se este app tivesse 10.000 itens com imagens, vídeos inline e seções colapsáveis, quais seriam suas 3 primeiras ações para garantir 60fps? NÃO repita o que já fez (memo, selector, Reanimated). Queremos o PRÓXIMO nível. -->

Já tem memo no item, cache no selector e animação no Reanimated. Próximo passo: (1) definir altura fixa da lista para não medir tudo; (2) carregar imagem e vídeo só quando o item aparecer na tela; (3) quebrar em listas menores por seção em vez de uma lista gigante.

## 3. Trade-off do Sync (máx 5 linhas)

<!-- A resolução de conflito que implementei tem uma fraqueza: [descreva]. Se tivesse mais tempo, eu: [descreva]. -->

Fraqueza: não temos versão “oficial” do documento (tipo timestamp), então em uso pesado podemos decidir errado em conflito. O “precisa revisar” também não é guardado. Com mais tempo: guardar versão no imóvel, mandar essa base no sync e salvar o que precisa de revisão para alguém conferir depois.

## 4. O bug mais difícil (máx 3 linhas)

<!-- O bug que mais demorei para encontrar foi: [qual]. Porque: [por que foi difícil]. -->

Foi o erro de tipo no merge do SyncConflictResolver: o TypeScript não deixa atribuir por nome de campo dinâmico. Difícil porque a mensagem não deixava óbvio; a saída foi um cast duplo para o tipo certo.

## 5. O que eu NÃO mexeria em produção (máx 3 linhas)

<!-- Se este fosse um app real, o arquivo que eu NÃO refatoraria agora é: [qual]. Porque: [justifique — custo vs benefício]. -->

ContactForm.tsx. Já está estável e marcado como não mexer; refatorar daria trabalho e risco de quebrar algo sem ganho claro para o usuário.
