import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Phone } from "lucide-react";
import { toast } from "sonner";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { STAGES, formatBRL, type LeadStage } from "@/lib/crm-data";

export const Route = createFileRoute("/crm/pipeline")({
  head: () => ({
    meta: [
      { title: "Pipeline · CRM Milla Conceito" },
      {
        name: "description",
        content:
          "Funil de vendas Milla Conceito: leads por etapa, valores em aberto e responsáveis.",
      },
      { property: "og:title", content: "Pipeline · CRM Milla Conceito" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PipelinePage,
});

function PipelinePage() {
  return (
    <CrmLayout
      title="Pipeline de Vendas"
      subtitle="Arraste os cards entre as etapas para atualizar o funil"
    >
      <PipelineContent />
    </CrmLayout>
  );
}

function PipelineContent() {
  const { leads, addLead, moveLead, deleteLead } = useCrm();
  const [open, setOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    value: "",
    interest: "",
    responsible: "Milla",
    stage: "novo" as LeadStage,
  });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Informe nome e telefone.");
      return;
    }
    addLead({
      name: form.name,
      phone: form.phone,
      value: Number(form.value) || 0,
      interest: form.interest,
      responsible: form.responsible,
      stage: form.stage,
    });
    setForm({ name: "", phone: "", value: "", interest: "", responsible: "Milla", stage: "novo" });
    setOpen(false);
    toast.success("Lead adicionado ao pipeline.");
  }

  const totalOpen = leads
    .filter((l) => !["fechado", "perdido"].includes(l.stage))
    .reduce((s, l) => s + l.value, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          <span className="font-serif text-xl text-[#C9A14A]">{formatBRL(totalOpen)}</span> em
          aberto · {leads.length} negociações
        </p>
        <Button
          onClick={() => setOpen(true)}
          className="bg-[#C9A14A] text-black hover:bg-[#C9A14A]/90"
        >
          <Plus className="mr-1 h-4 w-4" /> Novo lead
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {STAGES.map((st) => {
          const items = leads.filter((l) => l.stage === st.id);
          const sum = items.reduce((s, l) => s + l.value, 0);
          return (
            <div
              key={st.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId) {
                  moveLead(dragId, st.id);
                  setDragId(null);
                  toast.success(`Movido para ${st.label}`);
                }
              }}
              className="flex min-h-[300px] flex-col rounded-xl border border-zinc-800 bg-zinc-950"
            >
              <div className="border-b border-zinc-900 p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: st.color }} />
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-200">
                    {st.label}
                  </p>
                  <span className="ml-auto rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-400">
                    {items.length}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-500">{formatBRL(sum)}</p>
              </div>
              <div className="flex-1 space-y-2 p-2">
                {items.map((l) => (
                  <div
                    key={l.id}
                    draggable
                    onDragStart={() => setDragId(l.id)}
                    className="cursor-grab rounded-lg border border-zinc-800 bg-black p-3 transition hover:border-[#C9A14A]/50 active:cursor-grabbing"
                  >
                    <p className="text-sm font-medium text-white">{l.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500">
                      <Phone className="h-3 w-3" />
                      {l.phone}
                    </p>
                    {l.interest && <p className="mt-1 text-xs text-zinc-400">{l.interest}</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-serif text-sm font-semibold text-[#C9A14A]">
                        {formatBRL(l.value)}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm("Excluir negociação?")) deleteLead(l.id);
                        }}
                        className="text-zinc-600 hover:text-red-400"
                        aria-label="Excluir"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-1 text-[10px] text-zinc-600">
                      {l.responsible} · {l.updatedAt}
                    </p>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="p-4 text-center text-xs text-zinc-600">Arraste cards para cá</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-white">Novo lead</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2 sm:col-span-1">
                <Label>Nome *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border-zinc-800 bg-black"
                />
              </div>
              <div className="col-span-2 space-y-2 sm:col-span-1">
                <Label>Telefone *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="border-zinc-800 bg-black"
                />
              </div>
              <div className="space-y-2">
                <Label>Valor estimado (R$)</Label>
                <Input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="border-zinc-800 bg-black"
                />
              </div>
              <div className="space-y-2">
                <Label>Etapa</Label>
                <Select
                  value={form.stage}
                  onValueChange={(v) => setForm({ ...form, stage: v as LeadStage })}
                >
                  <SelectTrigger className="border-zinc-800 bg-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Interesse</Label>
                <Input
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  className="border-zinc-800 bg-black"
                  placeholder="Ex.: vestido de festa"
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
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
