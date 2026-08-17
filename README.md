# LendIt — Gestão de Inventário

Front-end do sistema de gestão de equipamentos **LendIt**. Permite cadastrar e listar equipamentos, fornecedores, colaboradores e usuários, com telas de autenticação (login e recuperação de senha).

## Stack

- [React](https://react.dev/) 18
- [Vite](https://vitejs.dev/) 5
- [React Router](https://reactrouter.com/) 7
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

## Requisitos

- Node.js 18 ou superior
- npm

## Como executar

```bash
npm install
npm run dev
```

O Vite sobe o servidor de desenvolvimento (em geral em `http://localhost:5173`).

### Outros scripts

| Comando           | Descrição                          |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Ambiente de desenvolvimento        |
| `npm run build`   | Build de produção em `dist/`       |
| `npm run preview` | Serve o build localmente           |

## Módulos e rotas

| Módulo            | Rota principal        | Cadastro                         |
| ----------------- | --------------------- | -------------------------------- |
| Login             | `/auth/login`         | —                                |
| Esqueci a senha   | `/auth/forgot-password` | —                              |
| Usuários          | `/users`              | `/users/cadastrar`               |
| Equipamentos      | `/equipamentos`       | `/equipamentos/cadastrar`        |
| Fornecedores      | `/fornecedores`       | `/fornecedores/cadastrar`        |
| Colaboradores     | `/colaboradores`      | `/colaboradores/cadastrar`       |

A raiz (`/`) redireciona para `/users`. O layout autenticado inclui menu lateral (equipamentos, fornecedores, colaboradores e usuários). Dashboard e histórico de manutenção ainda aparecem no menu, mas não têm rota implementada.

## Estrutura

```
src/
  pages/
    auth/            # Login e recuperação de senha
    user/            # Lista e cadastro de usuários
    equipamentos/    # Lista e cadastro de equipamentos
    fornecedor/      # Lista e cadastro de fornecedores
    colaborador/     # Lista e cadastro de colaboradores
  shared/components/ # SideMenu, Navbar, botões
  routes.jsx         # Rotas da aplicação
  App.jsx            # Layout com menu lateral
```

## Observações

Este repositório contém apenas o front-end. As telas usam dados de exemplo; a integração com API ainda não está ligada.
