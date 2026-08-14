# Changelog

Todas as alterações relevantes do FinanceHub são registradas neste arquivo.

## [1.0.0] - 2026-08-14

### Adicionado

- Backend desenvolvido com Node.js, Express e TypeScript.
- Banco de dados PostgreSQL integrado com Prisma ORM.
- Frontend desenvolvido com React, Next.js App Router, TypeScript e Tailwind CSS.
- Cadastro, consulta, atualização e exclusão de usuários.
- Autenticação com JWT armazenado em cookie HTTP-only.
- Login, logout e consulta da sessão autenticada.
- Alteração de nome, e-mail e senha.
- Cadastro, consulta, edição e exclusão de receitas e despesas.
- Isolamento das transações por usuário autenticado.
- Filtros financeiros por título, categoria e período.
- Paginação das transações.
- Resumo financeiro mensal.
- Comparação com o mês anterior.
- Filtro mensal do dashboard.
- Gráfico de receitas versus despesas.
- Gráfico de despesas por categoria.
- Gráfico de evolução mensal de receitas e despesas.

### Segurança

- Senhas armazenadas utilizando hash.
- Tokens JWT protegidos por cookies HTTP-only.
- Cookies de produção configurados com `secure: true`.
- Comunicação entre frontend e backend configurada com credenciais.
- Rotas financeiras protegidas por autenticação.
- Validação do proprietário das transações no backend.
- Variáveis sensíveis mantidas fora do controle de versão.

### Infraestrutura e entrega

- PostgreSQL de produção hospedado no Neon.
- Backend publicado como Web Service no Render.
- Frontend publicado na Vercel.
- Migrações do Prisma executadas durante o deploy do backend.
- Rota de saúde disponibilizada para monitoramento da API.
- Configuração de CORS para comunicação entre os domínios de produção.
- Workflow de CI criado com GitHub Actions.
- Compilação automática do backend e do frontend em pushes e Pull Requests direcionados à `main`.
- Deploy automático configurado para atualizações da aplicação.

### Documentação

- Roadmap completo do projeto.
- Documentação das variáveis de ambiente.
- Documentação do deploy do banco de dados e do backend.
- Documentação do deploy do frontend.
- Registro das principais validações realizadas em produção.

### Planejado para versões futuras

- Categorização inteligente de transações.
- Assistente financeiro com inteligência artificial.
- Resumos financeiros e identificação de padrões.
- Integração com o servidor MCP e os agentes de análise financeira.

## [0.1.0] - 2026-07-23

### Adicionado

- Estrutura inicial do projeto.
- Configuração do Git.
- Configuração do NVM.
- Criação do repositório.