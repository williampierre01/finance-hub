# Deploy do Frontend

## Arquitetura

- PostgreSQL: Neon
- Backend Node.js: Render
- Frontend Next.js: Vercel

## Frontend

O frontend está hospedado na Vercel.

Configuração:

- Repositório: `williampierre01/finance-hub`
- Branch de produção: `main`
- Root Directory: `frontend`
- Framework: Next.js
- Auto-Deploy: habilitado

## Variável de ambiente

A Vercel utiliza a seguinte variável:

```text
NEXT_PUBLIC_API_URL
```

Valor configurado:

```text
https://financehub-api-ry31.onrender.com
```

O endereço deve ser informado sem `/health` e sem barra no final.

A variável foi disponibilizada para os ambientes de produção e preview.

## Endereço do frontend

```text
https://finance-hub-three-pi.vercel.app
```

## Integração com o backend

No Render, a variável `CORS_ORIGIN` deve conter exatamente o endereço do frontend:

```text
https://finance-hub-three-pi.vercel.app
```

As requisições autenticadas do frontend utilizam:

```ts
credentials: "include"
```

Em produção, o cookie de autenticação permanece HTTP-only e utiliza `secure: true` e `sameSite: "none"` para permitir a comunicação entre os domínios da Vercel e do Render.

## Validações realizadas

Foram validados em produção:

- carregamento da página inicial;
- criação de usuário pela rota pública `POST /users`;
- login;
- recebimento e envio do cookie HTTP-only;
- carregamento do dashboard;
- criação de transação;
- persistência da transação após atualizar a página;
- logout;
- novo login;
- permanência dos dados após uma nova autenticação.

## Segurança

Senhas, tokens, cookies, `JWT_SECRET`, `DATABASE_URL` e outros valores secretos não devem ser adicionados ao Git nem à documentação.