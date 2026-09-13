import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Check, Trash2, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { TaskPriority, TaskStatus } from "@/lib/crm-data";

export const Route = createFileRoute("/crm/tarefas")({
  head: () => ({
    meta: [
      { title: "Tarefas · CRM Milla Conceito" },
      {
        name: "description",
        content: "Agenda da equipe Milla Conceito: follow-ups, provadores, cobranças e pós-venda.",
      },
      { property: "og:title", content: "Tarefas · CRM Milla Conceito" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TarefasPage,
});

function TarefasPage() {
  return (
    <CrmLayout title="Tarefas & Agenda" subtitle="Follow-up, cobranças, provadores e pós-venda">
      <TarefasContent />
    </CrmLayout>
  );
}

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};
const STATUS_LABEL: Record<TaskStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

function TarefasContent() {
  const { tasks, addTask, toggleTask, deleteTask, clients } = useCrm();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("todas");
  const [form, setForm] = useState({
    title: "",
    dueDate: "",
    dueTime: "",
    priority: "media" as TaskPriority,
    responsible: "Milla",
    type: "whatsapp" as const,
    clientId: "",
  });

  const filtered = tasks.filter((t) => {
    if (filter === "pendentes") return t.status !== "concluida";
    if (filter === "concluidas") return t.status === "concluida";
    return true;
  });

  const done = tasks.filter((t) => t.status === "concluida").length;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) {
      toast.error("Informe título e data.");
      return;
    }
    addTask({
      title: form.title,
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      priority: form.priority,
      responsible: form.responsible,
      type: form.type,
      ...(form.clientId ? { clientId: form.clientId } : {}),
      status: "pendente",
    });
    setForm({
      title: "",
      dueDate: "",
      dueTime: "",
      priority: "media",
      responsible: "Milla",
      type: "whatsapp",
      clientId: "",
    });
    setOpen(false);
    toast.success("Tarefa criada.");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {(["todas", "pendentes", "concluidas"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                filter === f
                  ? "rounded-full bg-[#C9A14A] px-4 py-1.5 text-xs font-semibold text-black"
                  : "rounded-full border border-zinc-800 px-4 py-1.5 text-xs text-zinc-300 hover:border-[#C9A14A]/60"
              }
            >
              {f === "todas"
                ? `Todas (${tasks.length})`
                : f === "pendentes"
                  ? `Pendentes (${tasks.length - done})`
                  : `Concluídas (${done})`}
            </button>
          ))}
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="ml-auto bg-[#C9A14A] text-black hover:bg-[#C9A14A]/90"
        >
          <Plus className="mr-1 h-4 w-4" /> Nova tarefa
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filtered.map((t) => {
          const client = clients.find((c) => c.id === t.clientId);
          const isDone = t.status === "concluida";
          return (
            <Card
              key={t.id}
              className={`border-zinc-800 bg-zinc-950 ${isDone ? "opacity-60" : ""}`}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <Checkbox
                  checked={isDone}
                  onCheckedChange={() => toggleTask(t.id)}
                  className="mt-1 border-zinc-600 data-[state=checked]:bg-[#C9A14A]"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${isDone ? "text-zinc-500 line-through" : "text-white"}`}
                  >
                    {t.title}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {t.dueDate}
                      {t.dueTime ? ` ${t.dueTime}` : ""}
                    </span>
                    <span>· {t.responsible}</span>
                    {client && <span>· {client.name}</span>}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Badge
                      variant="outline"
                      className={
                        t.priority === "alta"
                          ? "border-red-500/40 text-red-400"
                          : t.priority === "media"
                            ? "border-[#C9A14A]/40 text-[#C9A14A]"
                            : "border-zinc-700 text-zinc-400"
                      }
                    >
                      {PRIORITY_LABEL[t.priority]}
                    </Badge>
                    <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                      {t.type.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                      {STATUS_LABEL[t.status]}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {!isDone && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        toggleTask(t.id);
                        toast.success("Tarefa concluída!");
                      }}
                    >
                      <Check className="h-4 w-4 text-green-400" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => deleteTask(t.id)}>
                    <Trash2 className="h-4 w-4 text-zinc-600 hover:text-red-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-zinc-500">Nenhuma tarefa neste filtro.</p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-white">Nova tarefa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border-zinc-800 bg-black"
                placeholder="Ex.: Confirmar provador"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data *</Label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="border-zinc-800 bg-black"
                />
              </div>
              <div className="space-y-2">
                <Label>Hora</Label>
                <Input
                  type="time"
                  value={form.dueTime}
                  onChange={(e) => setForm({ ...form, dueTime: e.target.value })}
                  className="border-zinc-800 bg-black"
                />
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm({ ...form, priority: v as TaskPriority })}
                >
                  <SelectTrigger className="border-zinc-800 bg-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={form.type}
                  onValueChange={(v: never) => setForm({ ...form, type: v })}
                >
                  <SelectTrigger className="border-zinc-800 bg-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="ligacao">Ligação</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                    <SelectItem value="pos_venda">Pós-venda</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cliente (opcional)</Label>
              <Select
                value={form.clientId || "none"}
                onValueChange={(v) => setForm({ ...form, clientId: v === "none" ? "" : v })}
              >
                <SelectTrigger className="border-zinc-800 bg-black">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                Criar tarefa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
