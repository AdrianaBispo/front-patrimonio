# LendIt — Gestão de Patrimônio

Front-end do LendIt, sistema para gerenciamento de equipamentos e patrimônio.
O projeto consome uma API Laravel autenticada por cookie HttpOnly, com refresh
automático via interceptor Axios.

## Tecnologias

- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- Axios
- Zod
- i18next / react-i18next
- React IMask
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

O Axios está configurado com `withCredentials: true` e tenta renovar a sessão
com `POST /auth/refresh` em respostas `401` (exceto nas rotas de login/refresh).

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

## Internacionalização (i18n)

- Bootstrap em `src/shared/i18n/index.ts` (idioma padrão: `pt`).
- Traduções em `src/shared/locales/pt.json` e `en.json`.
- Telas e hooks usam chaves (`errors.*`, `messages.*`, `auth.*`, `user.*`,
  `category.*`, `role.*`, `equipment.*`, etc.).
- Exceptions de feature expõem a chave i18n; a UI traduz com `t()`.

## Módulos implementados

### Autenticação (`/auth`)

- Login em `/auth/login`.
- Recuperação de senha em `/auth/forgot-password`.
- Logout por `POST /auth/logout`.
- Sessão baseada em cookies + `GET /auth/user` (`me`).

### Usuários (`/users`)

- Listagem, cadastro e edição.
- Perfis (roles) no formulário; máscara de celular com react-imask.

### Perfis de acesso (`/roles`)

- Listagem paginada, cadastro e edição de permissões.
- Formulário compartilhado `RoleForm`.

### Categorias (`/categorias`)

- Listagem com pesquisa e paginação no hook.
- Cadastro e edição via `CategoryForm`.

### Tipos de equipamento (`/tipo-equipamento`)

- Listagem, pesquisa, paginação, cadastro e edição.
- Ativação e desativação de registros.

### Equipamentos (`/equipamentos`)

- Listagem paginada com pesquisa por série.
- Cadastro e edição com upload de imagem.
- Opções (status, usuários, categorias, tipos) carregadas no hook de formulário.
- Histórico registrado automaticamente em create/update.

### Histórico de equipamentos (`/historico-equipamentos`)

- Listagem paginada; paginação obtida do hook (`paginator`).

## Estrutura do projeto

```text
src/
├── app/routes/                 # Rotas por módulo
├── config/                     # Variáveis de ambiente
├── features/
│   ├── auth/                   # Login, logout, forgot password
│   ├── categories/             # Categorias
│   ├── collaborator/           # Colaboradores
│   ├── department/             # Departamentos
│   ├── equipment/              # Equipamentos
│   ├── equipmentHistory/       # Histórico de equipamentos
│   ├── equipmentType/          # Tipos de equipamento
│   ├── manager/                # Gestores
│   ├── permissions/            # Permissões (serviço/hook)
│   ├── roles/                  # Perfis de acesso
│   ├── status/                 # Status
│   ├── supplier/               # Fornecedores
│   └── user/                   # Usuários
├── shared/
│   ├── api/                    # Axios compartilhado
│   ├── components/             # Componentes reutilizáveis
│   ├── i18n/                   # Bootstrap i18next
│   ├── locales/                # pt.json / en.json
│   └── utils/                  # Helpers (ex.: formatPhone)
├── App.jsx
├── main.jsx
└── routes.jsx
```

Cada feature tipicamente contém:

- `components/`: formulários e UI do módulo.
- `exceptions/`: classes de erro com chaves i18n.
- `hooks/`: regras de negócio, validação Zod e paginação.
- `pages/`: telas.
- `services/`: integração com a API.
- `types/`: tipos TypeScript.
