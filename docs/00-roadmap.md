# Roadmap do FinanceHub

Este documento apresenta a evolução do FinanceHub e o estado atual de cada módulo do projeto.

## Módulo 1 — Organização do projeto

Status: concluído.

- Estrutura inicial do projeto
- Configuração do Git e GitHub
- Organização do backend e frontend
- Padronização de branches e commits

## Módulo 2 — Backend

Status: concluído.

- Node.js
- Express
- TypeScript
- Arquitetura em camadas
- Controllers, services e repositories
- Tratamento centralizado de erros

## Módulo 3 — Banco de dados

Status: concluído.

- PostgreSQL
- Docker Compose
- Prisma ORM
- Migrações
- Relacionamento entre usuários e transações
- Persistência de dados

## Módulo 4 — Frontend

Status: concluído.

- React
- Next.js com App Router
- TypeScript
- Tailwind CSS
- Componentes reutilizáveis
- Navegação entre páginas

## Módulo 5 — Autenticação

Status: concluído.

- Cadastro de usuários pela API
- Login
- JWT
- Cookie HTTP-only
- Proteção de rotas
- Consulta da sessão autenticada
- Logout

## Módulo 6 — CRUD de usuários

Status: concluído.

- Consulta de perfil
- Atualização de nome e e-mail
- Alteração de senha
- Exclusão de conta
- Proteção dos dados do usuário

## Módulo 7 — Receitas

Status: concluído.

- Cadastro de receitas
- Listagem
- Filtros
- Edição
- Exclusão
- Isolamento das receitas por usuário

## Módulo 8 — Despesas

Status: concluído.

- Cadastro de despesas
- Listagem
- Filtros
- Edição
- Exclusão
- Isolamento das despesas por usuário

## Módulo 9 — Dashboard

Status: concluído.

- Saldo
- Total de receitas
- Total de despesas
- Resumo financeiro mensal
- Comparação com o mês anterior
- Filtro por mês
- Transações recentes

## Módulo 10 — Gráficos

Status: concluído.

- Gráfico de receitas versus despesas
- Gráfico de despesas por categoria
- Gráfico de evolução mensal
- Integração dos gráficos ao dashboard
- Integração com o filtro mensal

## Módulo 11 — Inteligência Artificial

Status: planejado para uma evolução futura.

A integração de inteligência artificial foi adiada até a conclusão da aplicação principal, do deploy e da documentação.

Planejamento:

- Categorização inteligente de transações
- Resumos financeiros
- Identificação de padrões
- Assistente financeiro
- Integração com o servidor MCP
- Orquestração de agentes especializados
- Utilização responsável dos dados financeiros
- Controle de privacidade, segurança e custos

## Módulo 12 — Deploy e entrega

Status: em fase final.

Concluído:

- Preparação do projeto para produção
- PostgreSQL publicado no Neon
- Backend publicado no Render
- Frontend publicado na Vercel
- Configuração das variáveis de ambiente
- Configuração do CORS
- Autenticação entre domínios
- Validação do cookie HTTP-only em produção
- Migrações do Prisma em produção
- Verificação de saúde da API
- CI com GitHub Actions
- Builds automáticos do backend e frontend

Em andamento:

- Atualização da documentação
- Revisão do projeto
- Monitoramento
- Preparação do changelog
- Criação da release `v1.0.0`

## Próximas evoluções

Depois da versão `v1.0.0`, o FinanceHub poderá receber:

- Interface para cadastro de novos usuários
- Recuperação de senha
- Confirmação de e-mail
- Testes automatizados
- Melhorias de acessibilidade
- Monitoramento avançado
- Inteligência artificial
- Integração com o servidor MCP
- Novos relatórios financeiros