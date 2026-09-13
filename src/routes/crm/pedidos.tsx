import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCrm } from "@/lib/crm-store";
import { formatBRL, type OrderStatus } from "@/lib/crm-data";

export const Route = createFileRoute("/crm/pedidos")({
  head: () => ({
    meta: [
      { title: "Pedidos · CRM Milla Conceito" },
      {
        name: "description",
        content: "Vendas Milla Conceito: pedidos, pagamentos, status de entrega e total filtrado.",
      },
      { property: "og:title", content: "Pedidos · CRM Milla Conceito" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PedidosPage,
});

function PedidosPage() {
  return (
    <CrmLayout title="Pedidos & Vendas" subtitle="Acompanhe vendas, pagamentos e entregas">
      <PedidosContent />
    </CrmLayout>
  );
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  pendente: "border-orange-500/40 text-orange-400",
  pago: "border-blue-500/40 text-blue-400",
  separacao: "border-purple-500/40 text-purple-400",
  enviado: "border-cyan-500/40 text-cyan-400",
  entregue: "border-green-500/40 text-green-400",
  cancelado: "border-zinc-700 text-zinc-500",
};

function PedidosContent() {
  const { orders, clients, addOrder, updateOrderStatus } = useCrm();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    clientId: "",
    items: "",
    quantity: "1",
    total: "",
    paymentMethod: "Pix",
    seller: "Milla",
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const filtered = orders.filter((o) => {
    const q = query.toLowerCase();
    const okQ =
      !q ||
      o.clientName.toLowerCase().includes(q) ||
      o.code.toLowerCase().includes(q) ||
      o.items.toLowerCase().includes(q);
    const okS = status === "todos" || o.status === status;
    return okQ && okS;
  });

  useEffect(() => {
    setPage(1);
  }, [query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const total = filtered.filter((o) => o.status !== "cancelado").reduce((s, o) => s + o.total, 0);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const client = clients.find((c) => c.id === form.clientId);
    if (!client) {
      toast.error("Selecione um cliente.");
      return;
    }
    if (!form.items.trim() || !form.total) {
      toast.error("Informe itens e valor.");
      return;
    }
    addOrder({
      clientId: client.id,
      clientName: client.name,
      items: form.items,
      quantity: Number(form.quantity) || 1,
      total: Number(form.total) || 0,
      status: "pendente",
      paymentMethod: form.paymentMethod,
      date: new Date().toLocaleDateString("pt-BR"),
      seller: form.seller,
    });
    setForm({
      clientId: "",
      items: "",
      quantity: "1",
      total: "",
      paymentMethod: "Pix",
      seller: "Milla",
    });
    setOpen(false);
    toast.success("Pedido registrado.");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cliente, código ou peça..."
            className="border-zinc-800 bg-zinc-950 pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44 border-zinc-800 bg-zinc-950">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="separacao">Em separação</SelectItem>
            <SelectItem value="enviado">Enviado</SelectItem>
            <SelectItem value="entregue">Entregue</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => setOpen(true)}
          className="bg-[#C9A14A] text-black hover:bg-[#C9A14A]/90"
        >
          <Plus className="mr-1 h-4 w-4" /> Novo pedido
        </Button>
      </div>

      <p className="text-sm text-zinc-400">
        Total filtrado:{" "}
        <span className="font-serif text-lg font-semibold text-[#C9A14A]">{formatBRL(total)}</span>
      </p>

      <Card className="border-zinc-800 bg-zinc-950">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-zinc-800 text-xs uppercase tracking-wider text-[#C9A14A]">
                <tr>
                  <th className="px-5 py-4">Pedido</th>
                  <th className="px-5 py-4">Itens</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Pagamento</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {paged.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-900/50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-white">{o.code}</p>
                      <p className="text-xs text-zinc-500">
                        {o.clientName} · {o.date} · {o.seller}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-300">
                      {o.items} <span className="text-zinc-500">({o.quantity} un.)</span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-white">{formatBRL(o.total)}</td>
                    <td className="px-5 py-3 text-xs text-zinc-400">{o.paymentMethod}</td>
                    <td className="px-5 py-3">
                      <Select
                        value={o.status}
                        onValueChange={(v) => {
                          updateOrderStatus(o.id, v as OrderStatus);
                          toast.success("Status atualizado.");
                        }}
                      >
                        <SelectTrigger
                          className={`w-36 border bg-black text-xs ${STATUS_COLOR[o.status]}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="pago">Pago</SelectItem>
                          <SelectItem value="separacao">Em separação</SelectItem>
                          <SelectItem value="enviado">Enviado</SelectItem>
                          <SelectItem value="entregue">Entregue</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <ShoppingBag className="mx-auto h-8 w-8 text-zinc-700" aria-hidden="true" />
                      <p className="mt-3 font-medium text-zinc-300">Nenhum pedido encontrado</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Ajuste a busca ou registre um novo pedido.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-zinc-800 px-5 py-3 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite">
                Mostrando {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} de {filtered.length} pedido(s) ·
                Página {safePage} de {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="border-zinc-800 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Anterior
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="border-zinc-800 disabled:opacity-40"
                >
                  Próxima <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-white">Novo pedido</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Select
                value={form.clientId || "none"}
                onValueChange={(v) => setForm({ ...form, clientId: v === "none" ? "" : v })}
              >
                <SelectTrigger className="border-zinc-800 bg-black">
                  <SelectValue placeholder="Selecionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecionar...</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Itens *</Label>
              <Input
                value={form.items}
                onChange={(e) => setForm({ ...form, items: e.target.value })}
                className="border-zinc-800 bg-black"
                placeholder="Ex.: Vestido Midi + Clutch"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Qtd</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="border-zinc-800 bg-black"
                />
              </div>
              <div className="space-y-2">
                <Label>Total (R$) *</Label>
                <Input
                  type="number"
                  value={form.total}
                  onChange={(e) => setForm({ ...form, total: e.target.value })}
                  className="border-zinc-800 bg-black"
                />
              </div>
              <div className="space-y-2">
                <Label>Pagamento</Label>
                <Select
                  value={form.paymentMethod}
                  onValueChange={(v) => setForm({ ...form, paymentMethod: v })}
                >
                  <SelectTrigger className="border-zinc-800 bg-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pix">Pix</SelectItem>
                    <SelectItem value="Cartão à vista">Cartão à vista</SelectItem>
                    <SelectItem value="Cartão 3x">Cartão 3x</SelectItem>
                    <SelectItem value="Cartão 6x">Cartão 6x</SelectItem>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="Link pagamento">Link pagamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vendedora</Label>
                <Input
                  value={form.seller}
                  onChange={(e) => setForm({ ...form, seller: e.target.value })}
                  className="border-zinc-800 bg-black"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-zinc-700"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#C9A14A] text-black hover:bg-[#C9A14A]/90">
                Registrar pedido
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
