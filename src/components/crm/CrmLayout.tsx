import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  CheckSquare,
  ShoppingBag,
  BarChart3,
  LogOut,
  Menu,
  Search,
  Plus,
  X,
  ChevronRight,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { CrmProvider, useCrm } from "@/lib/crm-store";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";

const NAV = [
  { to: "/crm", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/crm/clientes", label: "Clientes", icon: Users, exact: false },
  { to: "/crm/pipeline", label: "Pipeline", icon: KanbanSquare, exact: false },
  { to: "/crm/tarefas", label: "Tarefas", icon: CheckSquare, exact: false },
  { to: "/crm/pedidos", label: "Pedidos", icon: ShoppingBag, exact: false },
  { to: "/crm/relatorios", label: "Relatórios", icon: BarChart3, exact: false },
];

const LABEL_BY_PATH: Record<string, string> = {
  "/crm": "Dashboard",
  "/crm/clientes": "Clientes",
  "/crm/pipeline": "Pipeline",
  "/crm/tarefas": "Tarefas",
  "/crm/pedidos": "Pedidos",
  "/crm/relatorios": "Relatórios",
};

function InnerLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { clients } = useCrm();

  const results =
    globalQuery.trim().length > 1
      ? clients.filter((c) => c.name.toLowerCase().includes(globalQuery.toLowerCase())).slice(0, 5)
      : [];

  const currentLabel = LABEL_BY_PATH[pathname] ?? title;

  function handleSignOut() {
    signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 lg:flex">
      {/* Sidebar desktop */}
      <aside
        className="hidden w-64 shrink-0 flex-col border-r border-zinc-900 bg-zinc-950 lg:flex"
        aria-label="Navegação principal do CRM"
      >
        <div className="flex items-center gap-3 border-b border-zinc-900 px-6 py-5">
          <img
            src="/logo.png"
            alt="Logotipo Milla Conceito"
            className="h-10 w-10 rounded-lg object-cover"
            loading="lazy"
            decoding="async"
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A14A]">
              Milla Conceito
            </p>
            <p className="font-serif text-xl font-semibold text-white">CRM</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Seções do CRM">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "flex items-center gap-3 rounded-lg bg-[#C9A14A] px-3 py-2.5 text-sm font-semibold text-black"
                    : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
                }
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-zinc-900 p-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sair
          </button>
          <p className="mt-3 px-3 text-[11px] text-zinc-600">
            © {new Date().getFullYear()} Milla Conceito · Uso interno
          </p>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu do CRM"
        >
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-zinc-950 p-4">
            <div className="mb-4 flex items-center justify-between px-2">
              <p className="font-serif text-xl text-white">Milla Conceito · CRM</p>
              <button onClick={() => setOpen(false)} aria-label="Fechar menu">
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900"
              >
                <item.icon className="h-4 w-4 text-[#C9A14A]" aria-hidden="true" /> {item.label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sair
            </button>
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu">
              <Menu className="h-5 w-5 text-zinc-300" />
            </button>
            <div className="relative hidden flex-1 sm:block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
              <Input
                value={globalQuery}
                onChange={(e) => setGlobalQuery(e.target.value)}
                placeholder="Busca rápida de cliente..."
                aria-label="Busca rápida de cliente"
                className="max-w-md border-zinc-800 bg-zinc-950 pl-9 text-sm placeholder:text-zinc-600"
              />
              {results.length > 0 && (
                <div className="absolute top-11 w-full max-w-md overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-xl">
                  {results.map((c) => (
                    <Link
                      key={c.id}
                      to="/crm/clientes"
                      className="block px-4 py-2.5 text-sm hover:bg-zinc-900"
                      onClick={() => setGlobalQuery("")}
                    >
                      <span className="font-medium text-white">{c.name}</span>
                      <span className="ml-2 text-xs text-zinc-500">{c.phone}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                onClick={() => navigate({ to: "/crm/clientes" })}
                className="bg-[#C9A14A] text-black hover:bg-[#C9A14A]/90"
                size="sm"
              >
                <Plus className="mr-1 h-4 w-4" aria-hidden="true" /> Novo
              </Button>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A14A]/40 bg-zinc-950 font-serif text-sm text-[#C9A14A]"
                aria-hidden="true"
              >
                M
              </div>
            </div>
          </div>
        </header>

        <main id="conteudo" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Caminho de navegação"
            className="mb-4 flex items-center gap-1.5 text-xs text-zinc-500"
          >
            <Link to="/crm" className="transition hover:text-[#C9A14A]">
              CRM
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span aria-current="page" className="font-medium text-zinc-300">
              {currentLabel}
            </span>
          </nav>

          <div className="mb-6">
            <h1 className="font-serif text-3xl font-semibold text-white">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
          </div>
          {children}

          <footer className="mt-12 border-t border-zinc-900 pt-6 pb-2 text-xs text-zinc-600">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Milla Conceito · CRM de uso interno da equipe</p>
              <nav aria-label="Links institucionais" className="flex gap-4">
                <Link to="/crm" className="transition hover:text-zinc-300">
                  Dashboard
                </Link>
                <Link to="/crm/clientes" className="transition hover:text-zinc-300">
                  Clientes
                </Link>
                <Link to="/crm/relatorios" className="transition hover:text-zinc-300">
                  Relatórios
                </Link>
              </nav>
            </div>
          </footer>
        </main>
      </div>
      <Toaster theme="dark" />
    </div>
  );
}

export function CrmLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string | undefined;
}) {
  return (
    <CrmProvider>
      <InnerLayout title={title} subtitle={subtitle}>
        {children}
      </InnerLayout>
    </CrmProvider>
  );
}
