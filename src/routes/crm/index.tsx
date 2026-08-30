import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Users,
  ShoppingBag,
  TrendingUp,
  Clock,
  Search,
  Plus,
  Star,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/crm/')({
  head: () => ({
    meta: [
      { title: 'CRM · Milla Conceito' },
      {
        name: 'description',
        content:
          'Painel de gestão de clientes e vendas da Milla Conceito.',
      },
      { property: 'og:title', content: 'CRM · Milla Conceito' },
      {
        property: 'og:description',
        content:
          'Painel de gestão de clientes e vendas da Milla Conceito.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: CrmPage,
});

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'VIP' | 'Ouro' | 'Prata' | 'Novo';
  totalSpent: number;
  lastPurchase: string;
  status: 'Ativo' | 'Inativo';
};

const customers: Customer[] = [
  {
    id: '1',
    name: 'Ana Beatriz Lima',
    email: 'ana.lima@email.com',
    phone: '(11) 98765-4321',
    tier: 'VIP',
    totalSpent: 12480,
    lastPurchase: '12/03/2025',
    status: 'Ativo',
  },
  {
    id: '2',
    name: 'Carolina Mendes',
    email: 'carol.mendes@email.com',
    phone: '(21) 99812-3344',
    tier: 'Ouro',
    totalSpent: 6320,
    lastPurchase: '28/02/2025',
    status: 'Ativo',
  },
  {
    id: '3',
    name: 'Juliana Rocha',
    email: 'juliana.rocha@email.com',
    phone: '(31) 97654-2211',
    tier: 'Prata',
    totalSpent: 2890,
    lastPurchase: '05/02/2025',
    status: 'Ativo',
  },
  {
    id: '4',
    name: 'Fernanda Albuquerque',
    email: 'fer.albuquerque@email.com',
    phone: '(41) 98890-1122',
    tier: 'Ouro',
    totalSpent: 7150,
    lastPurchase: '19/01/2025',
    status: 'Inativo',
  },
  {
    id: '5',
    name: 'Mariana Costa',
    email: 'mari.costa@email.com',
    phone: '(51) 99901-7788',
    tier: 'Novo',
    totalSpent: 420,
    lastPurchase: '02/03/2025',
    status: 'Ativo',
  },
];

const tierStyles: Record<Customer['tier'], string> = {
  VIP:
    'bg-[#C9A14A] text-black border-[#C9A14A] hover:bg-[#C9A14A]/90',
  Ouro:
    'bg-[#C9A14A]/15 text-[#C9A14A] border-[#C9A14A]/40 hover:bg-[#C9A14A]/25',
  Prata:
    'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700',
  Novo:
    'bg-black text-[#C9A14A] border-[#C9A14A]/30 hover:bg-zinc-900',
};

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function CrmPage() {
  const [query, setQuery] = React.useState('');
  const [tierFilter, setTierFilter] =
    React.useState<'Todos' | Customer['tier']>('Todos');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      const matchesTier = tierFilter === 'Todos' || c.tier === tierFilter;
      return matchesQuery && matchesTier;
    });
  }, [query, tierFilter]);

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const activeCount = customers.filter((c) => c.status === 'Ativo').length;
  const vipCount = customers.filter((c) => c.tier === 'VIP').length;

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="border-b border-[#C9A14A]/30 bg-gradient-to-b from-black via-black to-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#C9A14A]">
              Milla Conceito
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-white md:text-5xl">
              CRM da Loja
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              Acompanhe clientes, vendas e relacionamento em um só lugar.
            </p>
          </div>
          <Button className="bg-[#C9A14A] text-black hover:bg-[#C9A14A]/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo cliente
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        <section
          aria-label="Indicadores"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <KpiCard
            icon={<Users className="h-5 w-5" />}
            label="Clientes ativos"
            value={activeCount.toString()}
            accent
          />
          <KpiCard
            icon={<Star className="h-5 w-5" />}
            label="Clientes VIP"
            value={vipCount.toString()}
          />
          <KpiCard
            icon={<ShoppingBag className="h-5 w-5" />}
            label="Pedidos no mês"
            value="38"
          />
          <KpiCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Receita acumulada"
            value={formatCurrency(totalRevenue)}
          />
        </section>

        <section aria-label="Filtros" className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou e-mail"
                className="border-zinc-800 bg-zinc-950 pl-9 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#C9A14A]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                ['Todos', 'VIP', 'Ouro', 'Prata', 'Novo'] as const
              ).map((tier) => {
                const active = tierFilter === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setTierFilter(tier)}
                    className={
                      active
                        ? 'rounded-full border border-[#C9A14A] bg-[#C9A14A] px-4 py-1.5 text-xs font-semibold text-black transition'
                        : 'rounded-full border border-zinc-800 bg-zinc-950 px-4 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-[#C9A14A]/60 hover:text-[#C9A14A]'
                    }
                  >
                    {tier}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section aria-label="Lista de clientes">
          <Card className="overflow-hidden border-zinc-800 bg-zinc-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-800 bg-black/60 text-xs uppercase tracking-wider text-[#C9A14A]">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Cliente
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Contato
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Nível
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Total gasto
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Última compra
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-sm text-zinc-500"
                      >
                        Nenhum cliente encontrado para os filtros atuais.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c) => (
                      <tr
                        key={c.id}
                        className="transition-colors hover:bg-zinc-900/60"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A14A]/40 bg-black font-serif text-sm text-[#C9A14A]">
                              {c.name.charAt(0)}
                            </div>
                            <span className="font-medium text-white">
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                          <div>{c.email}</div>
                          <div className="text-xs text-zinc-500">{c.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className={tierStyles[c.tier]}
                          >
                            {c.tier}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-medium text-white">
                          {formatCurrency(c.totalSpent)}
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-zinc-500" />
                            {c.lastPurchase}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {c.status === 'Ativo' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A14A]/40 bg-[#C9A14A]/10 px-2.5 py-0.5 text-xs font-medium text-[#C9A14A]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A14A]" />
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                              Inativo
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        <footer className="border-t border-zinc-900 pt-6 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Milla Conceito · CRM interno
        </footer>
      </main>
    </div>
  );
}

type KpiCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
};

function KpiCard({ icon, label, value, accent }: KpiCardProps) {
  return (
    <Card
      className={
        accent
          ? 'border-[#C9A14A]/50 bg-gradient-to-br from-black to-zinc-950 shadow-[0_0_0_1px_rgba(201,161,74,0.15)]'
          : 'border-zinc-800 bg-zinc-950'
      }
    >
      <div className="flex items-start justify-between p-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            {label}
          </p>
          <p
            className={
              accent
                ? 'mt-2 font-serif text-3xl font-semibold text-[#C9A14A]'
                : 'mt-2 font-serif text-3xl font-semibold text-white'
            }
          >
            {value}
          </p>
        </div>
        <div
          className={
            accent
              ? 'flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A14A]/40 bg-black text-[#C9A14A]'
              : 'flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-black text-zinc-300'
          }
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
