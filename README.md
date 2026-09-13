# Milla Conceito · CRM

CRM interno da loja **Milla Conceito**: clientes, pipeline de vendas, pedidos, tarefas e relatórios.
Stack: TanStack Start + React 19 + Tailwind CSS v4 + shadcn/ui.

## Como rodar

```bash
npm i
npm run dev
```

Acesse `http://localhost:3000` (ou a porta indicada no terminal). O login oficial vive em `/`.

## Scripts

| Comando           | O que faz                          |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Sobe o ambiente de desenvolvimento |
| `npm run build`   | Gera o build de produção           |
| `npm run preview` | Previa o build localmente          |
| `npm run lint`    | Roda o ESLint no projeto           |
| `npm run format`  | Formata com Prettier               |

## Rotas

| Rota              | Descrição                                        |
| ----------------- | ------------------------------------------------ |
| `/`               | Login oficial (duas colunas, acessível, pt-BR)   |
| `/crm`            | Dashboard com receita, funil, tarefas e pedidos  |
| `/crm/clientes`   | Base oficial de clientes (ordenação + paginação) |
| `/crm/pipeline`   | Funil de vendas por etapa                        |
| `/crm/pedidos`    | Pedidos e vendas (filtro por status + paginação) |
| `/crm/tarefas`    | Agenda e follow-ups                              |
| `/crm/relatorios` | Relatórios e exportação CSV                      |
| `/clientes`       | Rota legada → redireciona para `/crm/clientes`   |
| `/crm/login`      | Rota legada → redireciona para `/`               |

## Identidade e design system

- Paleta sóbria: neutro zinc + dourado `#C9A14A` como acento (`--brand` em `src/styles.css`).
- Tipografia: sans Inter/sistema para UI, serif para títulos institucionais (`.brand-title`).
- Foco visível dourado, `prefers-reduced-motion` respeitado, contraste AA nos textos.
- App Shell em `src/components/crm/CrmLayout.tsx`: sidebar, topbar com busca rápida, breadcrumb, container `max-w-6xl` e rodapé institucional.

## Autenticação

A camada de auth vive em `src/lib/auth.ts` (`signIn`, `signOut`, sessão em `localStorage`).
Hoje opera em modo local sem latência artificial. Para integrar o backend real,
implemente o `fetch` indicado nos comentários de `signIn` mantendo a mesma assinatura
e mensagens de erro em pt-BR.

## SEO / Acessibilidade

- `lang="pt-BR"`, metas por rota (título, descrição, OG/Twitter) e `robots.txt` bloqueando `/crm/*`.
- Páginas 404/500 em pt-BR em `src/components/layout/ErrorStates.tsx`.
- Datas em `pt-BR` (`toLocaleDateString("pt-BR")`) e moeda via `formatBRL`.

## Dados locais

O CRM persiste em `localStorage` (chaves `mc_*`) a partir dos seeds em `src/lib/crm-data.ts`.
