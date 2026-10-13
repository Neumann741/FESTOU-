# Código da Festou e os exercícios do curso

Referência: `Anngular777-main.zip` enviado pelo aluno.

## Padrão usado nas telas

- `signal`, `set` e `update` guardam e alteram informações, como no contador e nos cadastros dos exercícios.
- `inject` acessa um serviço, como no exercício de cadastro de alunos.
- Interfaces descrevem os campos dos dados, como `Produtos` e `CadastroForm`.
- `form`, `FormField` e validações continuam no cadastro de festas.
- `ngModel` continua nos formulários simples, como no exercício de imagem.
- `@if`, `@for`, eventos e bindings exibem as informações no HTML.
- `HttpClient` e `subscribe` continuam na busca de endereço, como nos exemplos de API.

## Como as festas chegam às telas

O `FestaService` guarda uma lista com `signal<Festa[]>`. Criar, editar e excluir mudam essa lista e salvam no navegador.

Perfil, agenda, destaques e minhas festas acessam a mesma lista. Não há mais `BehaviorSubject` nem assinaturas para copiar festas entre essas telas.

Os métodos `filtradas`, `lista`, `confirmadas` e `salvas` consultam a lista e retornam o que deve aparecer. Condições foram separadas em etapas para facilitar a leitura. Não é necessário aprender `computed` para entender essas telas.

## Por onde estudar

1. `src/app/models/cadastro-festa.ts`: campos usados para criar uma festa.
2. `src/app/services/festa.service.ts`: lista e operações de cadastro.
3. `src/app/pages/criar-festa/criar-festa.ts`: formulário, validação e localização.
4. `src/app/pages/vitrine/vitrine.ts`: filtros por texto, categoria, preço e amigos.
5. `src/app/pages/perfil/perfil.ts`: festas confirmadas, salvas e informações do perfil.
6. `src/app/services/playlist.ts`: adicionar, remover e votar em músicas.

## Exceções combinadas

Mapa Leaflet, localização, armazenamento em `localStorage`, copiar links e animações da Home precisam de recursos que não aparecem nos exercícios. Foram preservados.

No mapa, `effect` acompanha a lista para atualizar os marcadores do Leaflet; `untracked` evita que sinais internos do mapa provoquem novas atualizações dessa integração. Esse trecho é uma exceção de integração, não o modelo para escrever novos cadastros.

Os objetos agrupados pelo id da festa e a leitura de JSON preservam o formato que já estava salvo no navegador. Interfaces com nomes substituem `Record` nesses dados; mudar o formato sem conversão perderia os dados existentes.

O projeto ainda contém código de infraestrutura Angular para rotas, comunicação entre componentes e ciclo de vida. Esta simplificação não significa que cada API existente conste no material do curso.

## Testes

Cada componente possui seu `.spec.ts`. Execute `npm test -- --watch=false` para conferir os testes e `npm run build` para verificar a compilação.
