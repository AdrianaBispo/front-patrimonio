# LendIt — Gestão de Patrimônio

Front-end do LendIt, sistema para gerenciamento de equipamentos e patrimônio.
O projeto consome uma API Laravel autenticada por cookie `access_token`.

## Tecnologias

- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- Axios
- Zod
- React Toastify
- Plus Jakarta Sans

## Requisitos

- Node.js compatível com Vite 8
- npm
- API Laravel em execução

## Configuração

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_BASEURL=http://localhost:8000/api
```

Somente variáveis iniciadas por `VITE_` ficam disponíveis no navegador. A URL é
lida em `src/config/env.ts` e utilizada pela instância compartilhada
`src/shared/api/axios.ts`.

O Axios está configurado com `withCredentials: true`, necessário para enviar o
cookie de autenticação nas requisições.

## Instalação e execução

```bash
npm install
npm run dev
```

Por padrão, o Vite disponibiliza a aplicação em `http://localhost:5173`.

### Scripts

- `npm run dev`: inicia o ambiente de desenvolvimento.
- `npm run build`: gera o build de produção em `dist/`.
- `npm run preview`: executa localmente o build de produção.

## Módulos implementados

### Autenticação

- Login em `/auth/login`.
- Recuperação de senha em `/auth/forgot-password`.
- Logout por `POST /auth/logout`.
- Autenticação baseada no cookie `access_token`.

### Usuários

- Listagem em `/users`.
- Cadastro em `/users/cadastrar`.
- Edição em `/users/editar/:id`.

### Categorias

- Listagem com pesquisa e paginação em `/categorias`.
- Cadastro em `/categorias/cadastrar`.
- Edição em `/categorias/editar/:id`.

### Tipos de equipamento

- Listagem, pesquisa e paginação em `/tipo-equipamento`.
- Cadastro em `/tipo-equipamento/cadastrar`.
- Edição em `/tipo-equipamento/editar/:id`.
- Ativação e desativação de registros.

### Equipamentos

- Listagem paginada em `/equipamentos`.
- Pesquisa por número de série.
- Cadastro em `/equipamentos/cadastrar`.
- Edição em `/equipamentos/editar/:id`.
- Validação dos campos com Zod.
- Status carregados por `GET /status/all`.
- Usuários carregados por `GET /auth/users`.

O upload de imagem ainda não está disponível. Nos cadastros e atualizações de
equipamento, `imagem_url` é enviado como `null`.

## Endpoints de equipamentos

- `GET /equipaments/all`: lista equipamentos, aceita `nome`, `serie`, `page` e
  `per_page`.
- `GET /equipaments/get`: busca equipamentos.
- `POST /equipaments/create`: cria um equipamento.
- `PUT /equipaments/update/{id}`: atualiza um equipamento.

Todas as requisições usam a instância compartilhada do Axios e enviam
credenciais automaticamente.

## Estrutura do projeto

```text
src/
├── app/routes/              # Rotas separadas por módulo
├── config/                  # Configuração das variáveis de ambiente
├── features/
│   ├── auth/                # Login, recuperação de senha e logout
│   ├── Categorias/          # Categorias
│   ├── equipamentos/        # Equipamentos
│   ├── status/              # Tipos e serviço de status
│   ├── tipoEquipamento/     # Tipos de equipamento
│   └── user/                # Usuários
├── shared/
│   ├── api/                 # Instância compartilhada do Axios
│   └── components/          # Componentes reutilizáveis
├── App.jsx                  # Layout principal
├── main.jsx                 # Entrada da aplicação
└── routes.jsx               # Roteador principal
```

Cada feature pode conter:

- `components/`: componentes específicos ou formulários reutilizáveis.
- `hooks/`: estado, validação e regras de interação.
- `pages/`: telas do módulo.
- `services/`: integração com a API.
- `types/`: tipos TypeScript.

## Padrões do projeto

- As páginas exibem loading enquanto aguardam dados da API.
- Erros de validação são exibidos abaixo dos campos com `ErrorLabel`.
- Erros gerais e mensagens de sucesso são exibidos com toast.
- Listagens paginadas reutilizam `Pagination` e `PaginationButton`.
- Serviços devem reutilizar `src/shared/api/axios.ts`, sem criar novas
  instâncias locais do Axios.
