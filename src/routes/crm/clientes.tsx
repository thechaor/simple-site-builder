import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Phone,
  Mail,
  MapPin,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCrm } from "@/lib/crm-store";
import { formatBRL, type ClientTier, type CrmClient } from "@/lib/crm-data";

export const Route = createFileRoute("/crm/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes · CRM Milla Conceito" },
      {
        name: "description",
        content:
          "Base oficial de clientes Milla Conceito: cadastro, segmentação por nível, LTV e histórico.",
      },
      { property: "og:title", content: "Clientes · CRM Milla Conceito" },
      { property: "og:description", content: "Cadastro, segmentação e histórico de cada cliente." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ClientesPage,
});

const TIERS: ClientTier[] = ["VIP", "Ouro", "Prata", "Novo"];
const PAGE_SIZE = 8;

function ClientesPage() {
  return (
    <CrmLayout title="Clientes" subtitle="Cadastro, segmentação e histórico de cada cliente">
      <ClientesContent />
    </CrmLayout>
  );
}

function ClientesContent() {
  const { clients, addClient, updateClient, deleteClient, interactions, addInteraction, orders } =
    useCrm();
  const [query, setQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("Todos");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CrmClient | null>(null);
  const [detail, setDetail] = useState<CrmClient | null>(null);
  const [note, setNote] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    tier: "Novo" as ClientTier,
    tags: "",
  });
  const [sortKey, setSortKey] = useState<"name" | "totalSpent">("name");
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const list = clients.filter((c) => {
      const okQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q);
      const okT = tierFilter === "Todos" || c.tier === tierFilter;
      const okS = statusFilter === "Todos" || c.status === statusFilter;
      return okQ && okT && okS;
    });
    return [...list].sort((a, b) => {
      if (sortKey === "totalSpent") return (a.totalSpent - b.totalSpent) * sortDir;
      return a.name.localeCompare(b.name, "pt-BR") * sortDir;
    });
  }, [clients, query, tierFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [query, tierFilter, statusFilter]);

  function toggleSort(key: "name" | "totalSpent") {
    if (sortKey === key) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  function openNew() {
    setEditing(null);
    setForm({ name: "", email: "", phone: "", city: "", tier: "Novo", tags: "" });
    setDialogOpen(true);
  }

  function openEdit(c: CrmClient) {
    setEditing(c);
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone,
      city: c.city ?? "",
      tier: c.tier,
      tags: c.tags.join(", "),
    });
    setDialogOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Preencha nome, e-mail e telefone.");
      return;
    }
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (editing) {
      updateClient(editing.id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        tier: form.tier,
        tags,
      });
      toast.success("Cliente atualizado.");
    } else {
      if (clients.some((c) => c.email.toLowerCase() === form.email.toLowerCase())) {
        toast.error("Já existe cliente com este e-mail.");
        return;
      }
      addClient({
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        tier: form.tier,
        tags,
        status: "Ativo",
        origin: "Manual",
      });
      toast.success("Cliente cadastrado.");
    }
    setDialogOpen(false);
  }

  function handleAddNote() {
    if (!detail || !note.trim()) return;
    addInteraction({
      clientId: detail.id,
      date: new Date().toLocaleDateString("pt-BR"),
      type: "nota",
      text: note.trim(),
    });
    setNote("");
    toast.success("Anotação adicionada ao histórico.");
  }

  const detailOrders = detail ? orders.filter((o) => o.clientId === detail.id) : [];
  const detailHistory = detail ? interactions.filter((i) => i.clientId === detail.id) : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="border-zinc-800 bg-zinc-950 pl-9"
          />
        </div>
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-36 border-zinc-800 bg-zinc-950">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos níveis</SelectItem>
            {TIERS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 border-zinc-800 bg-zinc-950">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Ativo">Ativos</SelectItem>
            <SelectItem value="Inativo">Inativos</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={openNew} className="bg-[#C9A14A] text-black hover:bg-[#C9A14A]/90">
          <Plus className="mr-1 h-4 w-4" /> Novo cliente
        </Button>
      </div>

      <Card className="border-zinc-800 bg-zinc-950">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-xs uppercase tracking-wider text-[#C9A14A]">
                <tr>
                  <th className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => toggleSort("name")}
                      className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-white"
                      aria-label="Ordenar por nome"
                    >
                      Cliente <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="px-5 py-4">Contato</th>
                  <th className="px-5 py-4">Nível</th>
                  <th className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => toggleSort("totalSpent")}
                      className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-white"
                      aria-label="Ordenar por LTV"
                    >
                      LTV <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {paged.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-900/50">
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setDetail(c)}
                        className="flex items-center gap-3 text-left"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A14A]/40 font-serif text-sm text-[#C9A14A]">
                          {c.name.charAt(0)}
                        </div>
                        <span>
                          <span className="block font-medium text-white hover:underline">
                            {c.name}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {c.city ?? "—"} · desde {c.createdAt}
                          </span>
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-400">
                      {c.email}
                      <br />
                      {c.phone}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="outline" className="border-[#C9A14A]/40 text-[#C9A14A]">
                        {c.tier}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 font-medium text-white">{formatBRL(c.totalSpent)}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => {
                          updateClient(c.id, {
                            status: c.status === "Ativo" ? "Inativo" : "Ativo",
                          });
                        }}
                        title="Alternar status"
                      >
                        <Badge
                          className={
                            c.status === "Ativo"
                              ? "bg-[#C9A14A]/15 text-[#C9A14A] hover:bg-[#C9A14A]/25"
                              : "bg-zinc-800 text-zinc-400"
                          }
                        >
                          {c.status}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(c)}>
                          <Pencil className="h-4 w-4 text-zinc-400" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (confirm(`Excluir ${c.name}?`)) {
                              deleteClient(c.id);
                              toast.success("Cliente excluído.");
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <Users className="mx-auto h-8 w-8 text-zinc-700" aria-hidden="true" />
                      <p className="mt-3 font-medium text-zinc-300">Nenhum cliente encontrado</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Ajuste os filtros ou cadastre um novo cliente com o botão acima.
                      </p>
                      <Button
                        onClick={openNew}
                        variant="outline"
                        className="mt-4 border-[#C9A14A]/40 text-[#C9A14A]"
                      >
                        <Plus className="mr-1 h-4 w-4" aria-hidden="true" /> Cadastrar cliente
                      </Button>
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
                {Math.min(safePage * PAGE_SIZE, filtered.length)} de {filtered.length} cliente(s) ·
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editing ? "Editar cliente" : "Novo cliente"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Nome *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border-zinc-800 bg-black"
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail *</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="border-zinc-800 bg-black"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="border-zinc-800 bg-black"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="border-zinc-800 bg-black"
                  placeholder="São Paulo · SP"
                />
              </div>
              <div className="space-y-2">
                <Label>Nível</Label>
                <Select
                  value={form.tier}
                  onValueChange={(v) => setForm({ ...form, tier: v as ClientTier })}
                >
                  <SelectTrigger className="border-zinc-800 bg-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIERS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Tags (separadas por vírgula)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="border-zinc-800 bg-black"
                  placeholder="festa, vip, provador"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-zinc-700"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#C9A14A] text-black hover:bg-[#C9A14A]/90">
                {editing ? "Salvar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full overflow-y-auto border-zinc-800 bg-zinc-950 text-zinc-100 sm:max-w-lg">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3 text-white">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A14A]/40 font-serif text-lg text-[#C9A14A]">
                    {detail.name.charAt(0)}
                  </div>
                  <span>
                    {detail.name}
                    <span className="block text-xs font-normal text-zinc-500">
                      {detail.tier} · {detail.status} · desde {detail.createdAt}
                    </span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-zinc-800 bg-black p-3">
                    <p className="flex items-center gap-1 text-xs text-zinc-500">
                      <Mail className="h-3 w-3" /> E-mail
                    </p>
                    <p className="mt-1 break-all text-zinc-200">{detail.email}</p>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-black p-3">
                    <p className="flex items-center gap-1 text-xs text-zinc-500">
                      <Phone className="h-3 w-3" /> Telefone
                    </p>
                    <p className="mt-1 text-zinc-200">{detail.phone}</p>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-black p-3">
                    <p className="flex items-center gap-1 text-xs text-zinc-500">
                      <MapPin className="h-3 w-3" /> Cidade
                    </p>
                    <p className="mt-1 text-zinc-200">{detail.city ?? "—"}</p>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-black p-3">
                    <p className="text-xs text-zinc-500">LTV acumulado</p>
                    <p className="mt-1 font-serif text-lg text-[#C9A14A]">
                      {formatBRL(detail.totalSpent)}
                    </p>
                  </div>
                </div>
                {detail.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {detail.tags.map((t) => (
                      <Badge key={t} variant="outline" className="border-zinc-700 text-zinc-300">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
                {detail.notes && (
                  <p className="rounded-lg border border-[#C9A14A]/30 bg-[#C9A14A]/5 p-3 text-sm text-zinc-300">
                    {detail.notes}
                  </p>
                )}

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-white">
                    Pedidos ({detailOrders.length})
                  </h4>
                  {detailOrders.length === 0 ? (
                    <p className="text-xs text-zinc-500">Nenhum pedido vinculado.</p>
                  ) : (
                    <div className="space-y-2">
                      {detailOrders.map((o) => (
                        <div
                          key={o.id}
                          className="flex justify-between rounded-lg border border-zinc-800 bg-black p-2.5 text-sm"
                        >
                          <span className="text-zinc-300">
                            {o.code} · {o.items}
                          </span>
                          <span className="font-medium text-white">{formatBRL(o.total)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-white">Histórico / Timeline</h4>
                  <div className="space-y-2">
                    {detailHistory.map((h) => (
                      <div
                        key={h.id}
                        className="rounded-lg border border-zinc-800 bg-black p-2.5 text-sm"
                      >
                        <p className="text-zinc-200">{h.text}</p>
                        <p className="mt-1 text-[11px] text-zinc-500">
                          {h.date} · {h.type} {h.value ? `· ${formatBRL(h.value)}` : ""}
                        </p>
                      </div>
                    ))}
                    {detailHistory.length === 0 && (
                      <p className="text-xs text-zinc-500">Sem interações registradas.</p>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Nova anotação..."
                      className="border-zinc-800 bg-black"
                    />
                    <Button
                      onClick={handleAddNote}
                      className="bg-[#C9A14A] text-black hover:bg-[#C9A14A]/90"
                    >
                      Salvar
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-zinc-700"
                  onClick={() => {
                    setDetail(null);
                    openEdit(detail);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Editar cliente
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
