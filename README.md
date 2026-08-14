# FinanceHub

Aplicação web full stack para organização e acompanhamento de finanças pessoais.

O FinanceHub permite controlar receitas e despesas, consultar resumos mensais, comparar períodos e visualizar gráficos financeiros. Cada usuário acessa somente os próprios dados por meio de autenticação com JWT armazenado em cookie HTTP-only.

## Aplicação em produção

- Frontend: [FinanceHub na Vercel](https://finance-hub-three-pi.vercel.app)
- API: [FinanceHub API no Render](https://financehub-api-ry31.onrender.com)
- Verificação da API: [GET /health](https://financehub-api-ry31.onrender.com/health)

> O backend utiliza o plano gratuito do Render e pode levar alguns segundos para responder após um período sem uso.

## Funcionalidades

### Autenticação e usuários

- Criação de usuários pela API;
- Login com e-mail e senha;
- Senhas protegidas com hash;
- Autenticação por JWT;
- JWT armazenado em cookie HTTP-only;
- Consulta da sessão autenticada;
- Logout;
- Atualização de nome e e-mail;
- Alteração de senha;
- Exclusão da conta;
- Isolamento dos dados por usuário.

### Controle financeiro

- Cadastro de receitas;
- Cadastro de despesas;
- Listagem de transações;
- Edição de transações;
- Exclusão de transações;
- Filtro por tipo;
- Filtro por título;
- Filtro por categoria;
- Filtro por período;
- Paginação;
- Resumo financeiro mensal;
- Comparação com o mês anterior.

### Dashboard e gráficos

- Saldo total;
- Total de receitas;
- Total de despesas;
- Comparação mensal;
- Gráfico de receitas versus despesas;
- Gráfico de despesas por categoria;
- Gráfico de evolução financeira mensal;
- Integração dos gráficos com o filtro por mês.

## Tecnologias

### Backend

- Node.js;
- Express;
- TypeScript;
- Prisma ORM;
- PostgreSQL;
- JWT;
- bcrypt;
- Cookie Parser;
- CORS;
- Dotenv.

### Frontend

- React;
- Next.js com App Router;
- TypeScript;
- Tailwind CSS;
- Recharts.

### Infraestrutura

- Docker e Docker Compose para desenvolvimento local;
- Neon para o PostgreSQL de produção;
- Render para o backend;
- Vercel para o frontend;
- GitHub Actions para integração contínua;
- Git e GitHub para versionamento.

## Arquitetura

O backend utiliza uma arquitetura em camadas:

```text
Rota
→ middleware de autenticação
→ controller
→ service
→ repository
→ Prisma
→ PostgreSQL
```

Responsabilidades principais:

- **Routes:** declaram os endpoints e aplicam os middlewares;
- **Controllers:** recebem e devolvem os dados HTTP;
- **Services:** aplicam as regras de negócio;
- **Repositories:** realizam o acesso aos dados;
- **Prisma:** conecta a aplicação ao PostgreSQL;
- **Middlewares:** tratam autenticação e erros.

O ID do usuário autenticado é obtido pelo backend por meio do token e disponibilizado em:

```ts
response.locals.userId
```

O frontend não envia um ID fixo para determinar o proprietário das transações.

## Estrutura do projeto

```text
FinanceHub
├── .github
│   └── workflows
├── backend
│   ├── prisma
│   │   ├── migrations
│   │   └── schema.prisma
│   └── src
│       ├── config
│       ├── controllers
│       ├── database
│       ├── errors
│       ├── generated
│       ├── middlewares
│       ├── modules
│       │   ├── auth
│       │   ├── transactions
│       │   └── users
│       ├── routes
│       ├── security
│       ├── app.ts
│       └── server.ts
├── docker
├── docs
├── frontend
│   ├── public
│   └── src
│       ├── app
│       └── components
├── docker-compose.yml
├── LICENSE
└── README.md
```

## Requisitos para execução local

Antes de iniciar, instale:

- Git;
- Node.js 22.17.1;
- npm;
- Docker Desktop.

A versão utilizada pelo projeto está registrada no arquivo `.nvmrc`.

## Configuração local

Clone o repositório e entre na pasta:

```cmd
git clone https://github.com/williampierre01/finance-hub.git
cd finance-hub
```

Crie os arquivos locais de ambiente a partir dos exemplos:

```cmd
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env.local
```

Preencha os arquivos criados com valores adequados ao seu ambiente local.

Nunca adicione os arquivos `.env` ou `.env.local` ao Git.

## Variáveis de ambiente

### Backend

O arquivo `backend/.env` utiliza:

```text
APP_NAME
PORT
NODE_ENV
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
CORS_ORIGIN
```

Exemplo de ambiente local:

```text
APP_NAME=FinanceHub
PORT=3001
NODE_ENV=development
DATABASE_URL=URL_DO_POSTGRESQL
JWT_SECRET=CHAVE_SECRETA_FORTE
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:3000
```

### Frontend

O arquivo `frontend/.env.local` utiliza:

```text
NEXT_PUBLIC_API_URL
```

Exemplo local:

```text
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Os exemplos acima não devem ser utilizados como credenciais de produção.

## Banco de dados local

Inicie o PostgreSQL pelo Docker:

```cmd
cd C:\Projetos\FinanceHub
docker compose up -d
docker compose ps
```

O container do PostgreSQL deve aparecer como ativo e saudável.

## Execução do backend

Instale as dependências, gere o Prisma Client e aplique as migrações:

```cmd
cd C:\Projetos\FinanceHub\backend
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run dev
```

O backend local ficará disponível em:

```text
http://localhost:3001
```

Verificação de saúde:

```text
http://localhost:3001/health
```

## Execução do frontend

Em outro terminal:

```cmd
cd C:\Projetos\FinanceHub\frontend
npm install
npm run dev
```

O frontend local ficará disponível em:

```text
http://localhost:3000
```

## Compilação

Para validar o backend:

```cmd
cd C:\Projetos\FinanceHub\backend
npm run build
```

Para validar o frontend:

```cmd
cd C:\Projetos\FinanceHub\frontend
npm run build
```

## Autenticação

O processo de autenticação funciona da seguinte forma:

```text
Login
→ backend valida e-mail e senha
→ backend cria o JWT
→ JWT é armazenado em cookie HTTP-only
→ navegador envia o cookie nas próximas requisições
→ middleware valida o token
→ backend identifica o usuário
```

As requisições autenticadas feitas pelo frontend utilizam:

```ts
credentials: "include"
```

Em produção, o cookie utiliza configurações adequadas para a comunicação entre os domínios da Vercel e do Render.

## Segurança

O FinanceHub aplica as seguintes medidas:

- Hash das senhas;
- JWT armazenado em cookie HTTP-only;
- Cookie seguro no ambiente de produção;
- Validação do usuário autenticado no backend;
- Isolamento das transações por usuário;
- Tratamento centralizado de erros;
- CORS configurado por variável de ambiente;
- Arquivos de ambiente ignorados pelo Git;
- Campos sensíveis não retornados pelas consultas públicas de usuários.

Nunca devem ser enviados ao repositório:

- Senhas;
- Tokens;
- Cookies;
- `JWT_SECRET`;
- `DATABASE_URL`;
- Arquivos `.env`;
- Arquivos `.env.local`;
- Outras credenciais privadas.

## Deploy

A arquitetura de produção utiliza:

```text
Usuário
→ Vercel
→ Next.js
→ Render
→ Express
→ Prisma
→ Neon PostgreSQL
```

Serviços:

- **Neon:** banco de dados PostgreSQL;
- **Render:** API Node.js;
- **Vercel:** aplicação Next.js.

## CI/CD

O projeto utiliza GitHub Actions para executar verificações automáticas.

O workflow é executado em:

- Pushes para a branch `main`;
- Pull Requests direcionados à `main`;
- Execução manual.

As verificações incluem:

- Instalação das dependências do backend;
- Compilação do backend;
- Instalação das dependências do frontend;
- Compilação do frontend.

Depois que um Pull Request é integrado à `main`:

- O Render atualiza o backend automaticamente;
- A Vercel atualiza o frontend automaticamente.

## Documentação complementar

- [Roadmap do projeto](docs/00-roadmap.md)
- [Configuração de ambiente](docs/01-ambient.md)
- [Deploy do banco e backend](docs/02-deploy-backend.md)
- [Deploy do frontend](docs/03-deploy-frontend.md)
- [Histórico de versões](docs/CHANGELOG.md)

## Planejamento futuro

A integração com inteligência artificial será desenvolvida em uma etapa posterior.

Funcionalidades planejadas:

- Categorização inteligente de transações;
- Resumos financeiros gerados por IA;
- Identificação de padrões de receitas e despesas;
- Assistente financeiro;
- Recomendações baseadas nos dados do usuário;
- Integração opcional com um servidor MCP;
- Integração com agentes de análise de mercado e valuation;
- Controles de privacidade, segurança e custos.

A integração com IA deverá manter a separação entre:

- Dados financeiros privados do FinanceHub;
- Dados públicos utilizados pelo servidor MCP;
- Permissões concedidas pelo usuário;
- Serviços externos de modelos de linguagem.

## Versão

Versão atual:

```text
v1.0.0
```

## Autor

Desenvolvido por [williampierre01](https://github.com/williampierre01).

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE).