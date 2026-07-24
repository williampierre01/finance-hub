# FinanceHub

Sistema de Gestão Financeira desenvolvido para estudos de:

- Node.js
- Next.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Docker

## Objetivo

Construir uma aplicação Full Stack moderna seguindo boas práticas de desenvolvimento.

## Backend

O backend do FinanceHub foi desenvolvido com Node.js, Express e TypeScript.

### Tecnologias

- Node.js
- Express
- TypeScript
- TSX
- Dotenv

### Estrutura principal

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── errors/
│   ├── middlewares/
│   ├── modules/
│   │   ├── transactions/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── types/
│   │   └── users/
│   │       ├── controllers/
│   │       ├── routes/
│   │       ├── services/
│   │       └── types/
│   ├── routes/
│   ├── app.ts
│   └── server.ts
├── package.json
└── tsconfig.json