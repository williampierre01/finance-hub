# Deploy do Banco de Dados e Backend

## Arquitetura

- PostgreSQL: Neon
- Backend Node.js: Render
- Frontend: Vercel, configurado em aula posterior

## PostgreSQL

O banco de dados de produção utiliza o PostgreSQL do Neon.

Configuração:

- Branch: `production`
- Database: `neondb`
- Região: São Paulo
- Autenticação do Neon: desativada

O FinanceHub continua utilizando sua própria autenticação com JWT armazenado em cookie HTTP-only.

## Backend

O backend está hospedado como Web Service no Render.

Configuração:

- Runtime: Node
- Root Directory: `backend`
- Health Check Path: `/health`
- Auto-Deploy: On Commit

### Build Command

```text
npm ci --include=dev --include=optional && npm run prisma:migrate:deploy && npm run build
```

### Start Command

```text
npm start
```

## Variáveis de ambiente

O Render utiliza as seguintes variáveis:

```text
APP_NAME
NODE_ENV
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
CORS_ORIGIN
```

Os valores reais não devem ser adicionados ao Git.

A variável `PORT` é fornecida automaticamente pelo Render.

## Endereço da API

```text
https://financehub-api-ry31.onrender.com
```

## Verificação de saúde

```text
GET /health
```

Endereço:

```text
https://financehub-api-ry31.onrender.com/health
```

A rota deve retornar o status `ok`, confirmando que a API está disponível.