import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes · Simple Site Builder" },
      {
        name: "description",
        content: "Gerencie seus clientes e crie novos cadastros no Simple Site Builder.",
      },
      { property: "og:title", content: "Clientes · Simple Site Builder" },
      {
        property: "og:description",
        content: "Gerencie seus clientes e crie novos cadastros no Simple Site Builder.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientesPage,
});

type ClientStatus = "ativo" | "inativo" | "pendente";

type Client = {
  id: string;
  name: string;
  email: string;
  company: string;
  status: ClientStatus;
  createdAt: string;
};

const seedClients: Client[] = [
  {
    id: "1",
    name: "Ana Souza",
    email: "ana.souza@example.com",
    company: "Estúdio Aurora",
    status: "ativo",
    createdAt: "2024-08-12",
  },
  {
    id: "2",
    name: "Bruno Lima",
    email: "bruno.lima@example.com",
    company: "Lima & Filhos",
    status: "pendente",
    createdAt: "2024-09-03",
  },
  {
    id: "3",
    name: "Carla Mendes",
    email: "carla.mendes@example.com",
    company: "Mendes Design",
    status: "ativo",
    createdAt: "2024-09-21",
  },
  {
    id: "4",
    name: "Diego Rocha",
    email: "diego.rocha@example.com",
    company: "RochaTech",
    status: "inativo",
    createdAt: "2024-07-30",
  },
];

const statusVariant: Record<ClientStatus, "default" | "secondary" | "outline"> = {
  ativo: "default",
  pendente: "secondary",
  inativo: "outline",
};

const statusLabel: Record<ClientStatus, string> = {
  ativo: "Ativo",
  pendente: "Pendente",
  inativo: "Inativo",
};

function ClientesPage() {
  const [clients, setClients] = useState<Client[]>(seedClients);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [companyValue, setCompanyValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filtered = clients.filter((client) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      client.name.toLowerCase().includes(q) ||
      client.email.toLowerCase().includes(q) ||
      client.company.toLowerCase().includes(q)
    );
  });

  function resetForm() {
    setNameValue("");
    setEmailValue("");
    setCompanyValue("");
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      resetForm();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = nameValue.trim();
    const trimmedEmail = emailValue.trim();
    const trimmedCompany = companyValue.trim();

    if (!trimmedName || !trimmedEmail || !trimmedCompany) {
      setError("Preencha nome, e-mail e empresa para continuar.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Informe um endereço de e-mail válido.");
      return;
    }

    setSubmitting(true);
    const newClient: Client = {
      id: `${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      company: trimmedCompany,
      status: "pendente",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setClients((prev) => [newClient, ...prev]);
    setSubmitting(false);
    resetForm();
    setOpen(false);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Painel</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Clientes</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Cadastre novos clientes e acompanhe o status de cada conta em um só lugar.
            </p>
          </div>

          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button type="button" className="gap-2">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Novo cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo cliente</DialogTitle>
                <DialogDescription>
                  Preencha os dados abaixo para adicionar um cliente à sua base.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="client-name">Nome completo</Label>
                  <Input
                    id="client-name"
                    name="name"
                    autoComplete="name"
                    value={nameValue}
                    onChange={(event) => setNameValue(event.target.value)}
                    placeholder="Ex.: Mariana Alves"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-email">E-mail</Label>
                  <Input
                    id="client-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={emailValue}
                    onChange={(event) => setEmailValue(event.target.value)}
                    placeholder="cliente@empresa.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-company">Empresa</Label>
                  <Input
                    id="client-company"
                    name="company"
                    autoComplete="organization"
                    value={companyValue}
                    onChange={(event) => setCompanyValue(event.target.value)}
                    placeholder="Nome da empresa"
                    required
                  />
                </div>
                {error ? (
                  <p className="text-sm font-medium text-destructive" role="alert">
                    {error}
                  </p>
                ) : null}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Salvando..." : "Cadastrar cliente"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Base de clientes
              </CardTitle>
              <CardDescription>
                {clients.length} cliente{clients.length === 1 ? "" : "s"} cadastrados.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Buscar por nome, e-mail ou empresa"
                className="pl-9"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Buscar clientes"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12 text-center">
                <Plus className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="font-medium">Nenhum cliente encontrado</p>
                  <p className="text-sm text-muted-foreground">
                    Ajuste a busca ou cadastre um novo cliente usando o botão acima.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-3 pr-4 font-medium">Nome</th>
                      <th className="py-3 pr-4 font-medium">E-mail</th>
                      <th className="py-3 pr-4 font-medium">Empresa</th>
                      <th className="py-3 pr-4 font-medium">Status</th>
                      <th className="py-3 font-medium">Cadastro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((client) => (
                      <tr key={client.id} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-medium">{client.name}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{client.email}</td>
                        <td className="py-3 pr-4">{client.company}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={statusVariant[client.status]}>
                            {statusLabel[client.status]}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <nav className="mt-8">
          <Link to="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            ← Voltar para o início
          </Link>
        </nav>
      </div>
      <Outlet />
    </main>
  );
}
