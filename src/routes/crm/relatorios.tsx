import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCrm } from "@/lib/crm-store";
import { revenueByMonth, formatBRL } from "@/lib/crm-data";

export const Route = createFileRoute("/crm/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios · CRM Milla Conceito" },
      {
        name: "description",
        content:
          "Performance Milla Conceito: receita por nível de cliente, vendas por vendedora e formas de pagamento.",
      },
      { property: "og:title", content: "Relatórios · CRM Milla Conceito" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RelatoriosPage,
});

function RelatoriosPage() {
  return (
    <CrmLayout title="Relatórios" subtitle="Performance de vendas, clientes e equipe">
      <RelatoriosContent />
    </CrmLayout>
  );
}

const COLORS = ["#C9A14A", "#60a5fa", "#c084fc", "#22c55e", "#fb923c", "#52525b"];

function RelatoriosContent() {
  const { clients, orders, leads } = useCrm();

  const tierData = ["VIP", "Ouro", "Prata", "Novo"].map((tier) => ({
    name: tier,
    value: clients.filter((c) => c.tier === tier).reduce((s, c) => s + c.totalSpent, 0),
    count: clients.filter((c) => c.tier === tier).length,
  }));

  const sellerMap = new Map<string, number>();
  orders.forEach((o) => {
    if (o.status !== "cancelado") sellerMap.set(o.seller, (sellerMap.get(o.seller) ?? 0) + o.total);
  });
  const sellerData = [...sellerMap.entries()].map(([name, total]) => ({ name, total }));

  const paymentMap = new Map<string, number>();
  orders.forEach((o) =>
    paymentMap.set(o.paymentMethod, (paymentMap.get(o.paymentMethod) ?? 0) + 1),
  );
  const paymentData = [...paymentMap.entries()].map(([name, total]) => ({ name, total }));

  const inativos = clients.filter((c) => c.status === "Inativo");
  const semCompra = clients.filter((c) => c.totalSpent < 1000);

  function handleExport() {
    const rows = [
      ["Nome", "Email", "Telefone", "Nivel", "Status", "LTV"],
      ...clients.map((c) => [c.name, c.email, c.phone, c.tier, c.status, String(c.totalSpent)]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clientes-milla-conceito.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Base de clientes exportada em CSV.");
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={handleExport}
          variant="outline"
          className="border-[#C9A14A]/40 text-[#C9A14A] hover:bg-[#C9A14A] hover:text-black"
        >
          <Download className="mr-2 h-4 w-4" /> Exportar clientes (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-white">Receita por nível de cliente</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {tierData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: 8,
                  }}
                  formatter={(v) => formatBRL(Number(v))}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-white">Vendas por vendedora</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sellerData.length ? sellerData : [{ name: "Sem dados", total: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
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
                  formatter={(v) => formatBRL(Number(v))}
                />
                <Bar dataKey="total" fill="#C9A14A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-white">Evolução da receita</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth}>
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
                />
                <Bar dataKey="receita" fill="#C9A14A" radius={[6, 6, 0, 0]} />
                <Bar dataKey="meta" fill="#27272a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-white">Formas de pagamento (pedidos)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentData.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  <span className="flex-1 text-sm text-zinc-300">{p.name}</span>
                  <span className="text-sm font-semibold text-white">{p.total} pedidos</span>
                </div>
              ))}
              {paymentData.length === 0 && <p className="text-sm text-zinc-500">Sem dados.</p>}
            </div>
            <div className="mt-6 rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
              <p className="text-sm font-semibold text-orange-300">Oportunidades de reativação</p>
              <p className="mt-1 text-xs text-zinc-400">
                {inativos.length} clientes inativos · {semCompra.length} com LTV abaixo de R$ 1.000
                · {leads.filter((l) => l.stage === "proposta").length} propostas em aberto.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
