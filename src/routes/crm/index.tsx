import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, TrendingUp, ShoppingBag, Target, Clock, ArrowRight, Star } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCrm } from "@/lib/crm-store";
import { revenueByMonth, formatBRL, STAGES } from "@/lib/crm-data";

export const Route = createFileRoute("/crm/")({
  head: () => ({
    meta: [
      { title: "Dashboard · CRM Milla Conceito" },
      {
        name: "description",
        content:
          "Visão geral da loja Milla Conceito: receita, clientes, pipeline, tarefas e pedidos.",
      },
      { property: "og:title", content: "Dashboard · CRM Milla Conceito" },
      {
        property: "og:description",
        content: "Visão geral de vendas, clientes e pipeline em tempo real.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <CrmLayout title="Dashboard" subtitle="Visão geral da loja em tempo real">
      <DashboardContent />
    </CrmLayout>
  );
}

function DashboardContent() {
  const { clients, leads, tasks, orders } = useCrm();

  const receitaMes = orders.reduce((s, o) => s + (o.status === "cancelado" ? 0 : o.total), 0);
  const ativos = clients.filter((c) => c.status === "Ativo").length;
  const ticket = clients.length
    ? clients.reduce((s, c) => s + c.totalSpent, 0) / clients.length
    : 0;
  const fechados = leads.filter((l) => l.stage === "fechado").length;
  const conversao = leads.length ? Math.round((fechados / leads.length) * 100) : 0;
  const pipelineValue = leads
    .filter((l) => !["fechado", "perdido"].includes(l.stage))
    .reduce((s, l) => s + l.value, 0);

  const funnel = STAGES.map((st) => ({
    name: st.label,
    total: leads.filter((l) => l.stage === st.id).length,
    valor: leads.filter((l) => l.stage === st.id).reduce((s, l) => s + l.value, 0),
  }));

  const topClients = [...clients].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 4);
  const pendingTasks = tasks.filter((t) => t.status !== "concluida").slice(0, 4);
  const recentOrders = orders.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={<TrendingUp className="h-5 w-5" />}
          label="Receita (pedidos)"
          value={formatBRL(receitaMes)}
          sub={`${orders.length} pedidos`}
          accent
        />
        <Kpi
          icon={<Users className="h-5 w-5" />}
          label="Clientes ativos"
          value={String(ativos)}
          sub={`${clients.length} no total`}
        />
        <Kpi
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Ticket médio"
          value={formatBRL(Math.round(ticket))}
          sub="por cliente"
        />
        <Kpi
          icon={<Target className="h-5 w-5" />}
          label="Pipeline aberto"
          value={formatBRL(pipelineValue)}
          sub={`${conversao}% conversão`}
        />
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-zinc-800 bg-zinc-950 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Receita × Meta</CardTitle>
            <p className="text-xs text-zinc-500">Últimos 7 meses · valores em R$</p>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                <YAxis
                  stroke="#71717a"
                  fontSize={12}
                  tickFormatter={(v: number) => `${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: 8,
                  }}
                  formatter={(v) => [formatBRL(Number(v)), ""]}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="#C9A14A"
                  fill="#C9A14A"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="meta"
                  stroke="#52525b"
                  fill="transparent"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-white">Funil de vendas</CardTitle>
            <p className="text-xs text-zinc-500">Leads por estágio</p>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={110} stroke="#a1a1aa" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="total" fill="#C9A14A" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Lists */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Top clientes</CardTitle>
            <Link
              to="/crm/clientes"
              className="inline-flex items-center gap-1 text-xs text-[#C9A14A] hover:underline"
            >
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {topClients.map((c, i) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-lg border border-zinc-900 bg-black/50 p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A14A]/40 font-serif text-sm text-[#C9A14A]">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    #{i + 1} {c.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {c.tier} · {c.lastPurchase}
                  </p>
                </div>
                <p className="text-sm font-semibold text-[#C9A14A]">{formatBRL(c.totalSpent)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-4 w-4 text-[#C9A14A]" /> Próximas tarefas
            </CardTitle>
            <Link
              to="/crm/tarefas"
              className="inline-flex items-center gap-1 text-xs text-[#C9A14A] hover:underline"
            >
              Ver todas <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.length === 0 && (
              <p className="text-sm text-zinc-500">Nenhuma tarefa pendente. 🎉</p>
            )}
            {pendingTasks.map((t) => (
              <div key={t.id} className="rounded-lg border border-zinc-900 bg-black/50 p-3">
                <p className="text-sm font-medium text-white">{t.title}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {t.dueDate} {t.dueTime ? `· ${t.dueTime}` : ""} · {t.responsible}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Últimos pedidos</CardTitle>
            <Link
              to="/crm/pedidos"
              className="inline-flex items-center gap-1 text-xs text-[#C9A14A] hover:underline"
            >
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-lg border border-zinc-900 bg-black/50 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {o.code} · {o.clientName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {o.date} · {o.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{formatBRL(o.total)}</p>
                  <Badge
                    variant="outline"
                    className="mt-1 border-zinc-700 text-[10px] text-zinc-300"
                  >
                    {o.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link to="/crm/pipeline">
          <Button
            variant="outline"
            className="w-full border-[#C9A14A]/40 bg-transparent text-[#C9A14A] hover:bg-[#C9A14A] hover:text-black"
          >
            <Star className="mr-2 h-4 w-4" /> Abrir Pipeline
          </Button>
        </Link>
        <Link to="/crm/clientes">
          <Button
            variant="outline"
            className="w-full border-zinc-800 bg-transparent text-zinc-200 hover:bg-zinc-900"
          >
            <Users className="mr-2 h-4 w-4" /> Gerenciar Clientes
          </Button>
        </Link>
        <Link to="/crm/relatorios">
          <Button
            variant="outline"
            className="w-full border-zinc-800 bg-transparent text-zinc-200 hover:bg-zinc-900"
          >
            <TrendingUp className="mr-2 h-4 w-4" /> Ver Relatórios
          </Button>
        </Link>
      </section>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <Card
      className={
        accent
          ? "border-[#C9A14A]/50 bg-gradient-to-br from-black to-zinc-950"
          : "border-zinc-800 bg-zinc-950"
      }
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
            <p
              className={`mt-2 font-serif text-2xl font-semibold ${accent ? "text-[#C9A14A]" : "text-white"}`}
            >
              {value}
            </p>
            <p className="mt-1 text-xs text-zinc-500">{sub}</p>
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${accent ? "border-[#C9A14A]/40 text-[#C9A14A]" : "border-zinc-800 text-zinc-300"}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
