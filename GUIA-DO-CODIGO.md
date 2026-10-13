# Como estudar o código da Festou

Referência: `Anngular777-main.zip`, enviado pelo aluno.

## Comece pelos cadastros

As telas usam os conceitos dos exercícios: componentes, interfaces, serviços, `inject`, `signal`, `set`, `update`, formulários, `ngModel`, `@if`, `@for` e eventos.

A lógica dos cadastros usa listas de objetos. Por exemplo, cada comentário tem `festaId`, `pessoa` e `texto`. Não é necessário entender objetos indexados pelo id da festa para adicionar um comentário.

O método de adicionar segue este padrão:

```typescript
const comentario: Comentario = { festaId: id, pessoa: 'Você', texto };
this.comentarios.update((lista) => [...lista, comentario]);
salvarComentarios(this.comentarios());
```

As duas primeiras linhas são a lógica do cadastro. A última pede à integração que salve a lista no navegador.

## Arquivos para ler primeiro

1. `src/app/models/interacoes.ts`: campos de comentários, convites, músicas e avaliações.
2. `src/app/services/galeria.ts`: exemplo pequeno de adicionar e listar fotos.
3. `src/app/services/playlist.ts`: adicionar, remover e votar em músicas.
4. `src/app/services/festa.service.ts`: criar, editar e excluir festas.
5. `src/app/pages/criar-festa/criar-festa.ts`: formulário e validações separadas de preço e limite.
6. `src/app/services/interacao.ts`: regras de participação, convites e amigos.

As festas ficam em um único `signal` no serviço. Perfil, agenda, destaques e minhas festas consultam essa mesma lista.

## O que continua fora dos exercícios

Mantivemos as exceções autorizadas para não perder funcionalidades. Não significa que toda API existente apareça no ZIP.

- `src/app/integracoes/armazenamento.ts`: acesso ao localStorage e conversão entre listas simples e o formato antigo. Continua gravando as mesmas chaves e estruturas, sem apagar os dados do navegador.
- `src/app/integracoes/compartilhamento.ts`: endereço da festa, link do WhatsApp e cópia pela API do navegador. O componente apenas chama a função e exibe a mensagem.
- `src/app/componentes/mapa/` e os serviços de localização: integração Leaflet, localização e atualização dos marcadores.
- `src/app/componentes/main/`: animação da Home, preservada sem alterações.

A infraestrutura de rotas, comunicação entre componentes e ciclo de vida do Angular também continua onde é necessária. Esses trechos não são o padrão a copiar para criar um formulário novo.

## O que não mudou

Visual, rotas e funcionalidades foram mantidos. Convites privados ainda precisam de aprovação; limites de participantes, votos e avaliações continuam com suas validações.

## Conferir o projeto

- `npm test -- --watch=false`: testes dos componentes, funcionalidades e compatibilidade dos dados antigos.
- `npm run build`: compilação do projeto.
