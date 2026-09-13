export type ClientTier = "VIP" | "Ouro" | "Prata" | "Novo";
export type ClientStatus = "Ativo" | "Inativo";
export type LeadStage =
  | "novo"
  | "atendimento"
  | "provador"
  | "proposta"
  | "fechado"
  | "perdido";
export type TaskPriority = "alta" | "media" | "baixa";
export type TaskStatus = "pendente" | "em_andamento" | "concluida";
export type OrderStatus =
  | "pendente"
  | "pago"
  | "separacao"
  | "enviado"
  | "entregue"
  | "cancelado";

export interface CrmClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  tier: ClientTier;
  status: ClientStatus;
  tags: string[];
  totalSpent: number;
  lastPurchase: string;
  createdAt: string;
  notes?: string;
  origin?: string;
}

export interface CrmLead {
  id: string;
  clientId?: string;
  name: string;
  phone: string;
  email?: string;
  stage: LeadStage;
  value: number;
  interest?: string;
  responsible: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CrmTask {
  id: string;
  title: string;
  description?: string;
  clientId?: string;
  dueDate: string;
  dueTime?: string;
  priority: TaskPriority;
  status: TaskStatus;
  responsible: string;
  type: "ligacao" | "whatsapp" | "email" | "reuniao" | "pos_venda" | "outro";
}

export interface CrmOrder {
  id: string;
  code: string;
  clientId: string;
  clientName: string;
  items: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  date: string;
  seller: string;
}

export interface CrmInteraction {
  id: string;
  clientId: string;
  date: string;
  type: "compra" | "atendimento" | "whatsapp" | "ligacao" | "nota";
  text: string;
  value?: number;
}

export const STAGES: { id: LeadStage; label: string; color: string }[] = [
  { id: "novo", label: "Novo Lead", color: "#C9A14A" },
  { id: "atendimento", label: "Em Atendimento", color: "#60a5fa" },
  { id: "provador", label: "Provador / Visita", color: "#c084fc" },
  { id: "proposta", label: "Proposta", color: "#fb923c" },
  { id: "fechado", label: "Fechado", color: "#22c55e" },
  { id: "perdido", label: "Perdido", color: "#52525b" },
];

export const seedClients: CrmClient[] = [
  {
    id: "c1",
    name: "Ana Beatriz Lima",
    email: "ana.lima@email.com",
    phone: "(11) 98765-4321",
    city: "São Paulo · SP",
    tier: "VIP",
    status: "Ativo",
    tags: ["festa", "alfaiataria"],
    totalSpent: 12480,
    lastPurchase: "12/03/2025",
    createdAt: "10/01/2024",
    origin: "Instagram",
    notes: "Prefere atendimento com hora marcada. Tamanho M.",
  },
  {
    id: "c2",
    name: "Carolina Mendes",
    email: "carol.mendes@email.com",
    phone: "(21) 99812-3344",
    city: "Rio de Janeiro · RJ",
    tier: "Ouro",
    status: "Ativo",
    tags: ["casual", "jeans premium"],
    totalSpent: 6320,
    lastPurchase: "28/02/2025",
    createdAt: "15/03/2024",
    origin: "Indicação",
    notes: "Aniversário em junho — preparar mimo.",
  },
  {
    id: "c3",
    name: "Juliana Rocha",
    email: "juliana.rocha@email.com",
    phone: "(31) 97654-2211",
    city: "Belo Horizonte · MG",
    tier: "Prata",
    status: "Ativo",
    tags: ["trabalho"],
    totalSpent: 2890,
    lastPurchase: "05/02/2025",
    createdAt: "22/06/2024",
    origin: "Loja física",
  },
  {
    id: "c4",
    name: "Fernanda Albuquerque",
    email: "fer.albuquerque@email.com",
    phone: "(41) 98890-1122",
    city: "Curitiba · PR",
    tier: "Ouro",
    status: "Inativo",
    tags: ["festa"],
    totalSpent: 7150,
    lastPurchase: "19/01/2025",
    createdAt: "05/09/2023",
    origin: "Site",
    notes: "Sem compra há 60+ dias — entrar em reativação.",
  },
  {
    id: "c5",
    name: "Mariana Costa",
    email: "mari.costa@email.com",
    phone: "(51) 99901-7788",
    city: "Porto Alegre · RS",
    tier: "Novo",
    status: "Ativo",
    tags: ["primeira compra"],
    totalSpent: 420,
    lastPurchase: "02/03/2025",
    createdAt: "02/03/2025",
    origin: "WhatsApp",
  },
  {
    id: "c6",
    name: "Patrícia Gomes",
    email: "patricia.gomes@email.com",
    phone: "(11) 97654-8899",
    city: "São Paulo · SP",
    tier: "VIP",
    status: "Ativo",
    tags: ["noivas", "festa"],
    totalSpent: 15890,
    lastPurchase: "10/03/2025",
    createdAt: "11/11/2023",
    origin: "Indicação",
  },
];

export const seedLeads: CrmLead[] = [
  {
    id: "l1",
    name: "Beatriz Fonseca",
    phone: "(11) 99111-2233",
    email: "bia.fonseca@email.com",
    stage: "novo",
    value: 1200,
    interest: "Vestido de festa",
    responsible: "Milla",
    createdAt: "10/03/2025",
    updatedAt: "10/03/2025",
  },
  {
    id: "l2",
    name: "Camila Torres",
    phone: "(21) 98877-6655",
    stage: "atendimento",
    value: 850,
    interest: "Look casual premium",
    responsible: "Equipe Loja",
    createdAt: "08/03/2025",
    updatedAt: "11/03/2025",
  },
  {
    id: "l3",
    clientId: "c5",
    name: "Mariana Costa",
    phone: "(51) 99901-7788",
    stage: "provador",
    value: 1490,
    interest: "Provador agendado sábado",
    responsible: "Milla",
    createdAt: "02/03/2025",
    updatedAt: "09/03/2025",
  },
  {
    id: "l4",
    clientId: "c2",
    name: "Carolina Mendes",
    phone: "(21) 99812-3344",
    stage: "proposta",
    value: 2350,
    interest: "2 peças reservadas",
    responsible: "Milla",
    createdAt: "28/02/2025",
    updatedAt: "10/03/2025",
  },
  {
    id: "l5",
    clientId: "c1",
    name: "Ana Beatriz Lima",
    phone: "(11) 98765-4321",
    stage: "fechado",
    value: 3200,
    interest: "Vestido + acessórios",
    responsible: "Equipe Loja",
    createdAt: "05/03/2025",
    updatedAt: "12/03/2025",
  },
  {
    id: "l6",
    name: "Renata Prado",
    phone: "(19) 99777-1122",
    stage: "perdido",
    value: 900,
    interest: "Sem retorno após proposta",
    responsible: "Milla",
    createdAt: "20/02/2025",
    updatedAt: "05/03/2025",
  },
];

export const seedTasks: CrmTask[] = [
  {
    id: "t1",
    title: "Confirmar provador da Mariana (sábado 14h)",
    clientId: "c5",
    dueDate: "2026-09-13",
    dueTime: "14:00",
    priority: "alta",
    status: "pendente",
    responsible: "Milla",
    type: "whatsapp",
  },
  {
    id: "t2",
    title: "Enviar fotos dos vestidos festa para Beatriz",
    dueDate: "2026-09-12",
    dueTime: "16:00",
    priority: "alta",
    status: "em_andamento",
    responsible: "Equipe Loja",
    type: "whatsapp",
  },
  {
    id: "t3",
    title: "Pós-venda: agradecer Ana pela compra",
    clientId: "c1",
    dueDate: "2026-09-14",
    priority: "media",
    status: "pendente",
    responsible: "Milla",
    type: "pos_venda",
  },
  {
    id: "t4",
    title: "Reativar Fernanda (60 dias sem compra)",
    clientId: "c4",
    dueDate: "2026-09-15",
    priority: "media",
    status: "pendente",
    responsible: "Equipe Loja",
    type: "ligacao",
  },
  {
    id: "t5",
    title: "Fechar caixa e conferir reservas",
    dueDate: "2026-09-12",
    priority: "baixa",
    status: "concluida",
    responsible: "Equipe Loja",
    type: "outro",
  },
];

export const seedOrders: CrmOrder[] = [
  {
    id: "o1",
    code: "#1024",
    clientId: "c1",
    clientName: "Ana Beatriz Lima",
    items: "Vestido Midi Dourado + Clutch",
    quantity: 2,
    total: 3200,
    status: "entregue",
    paymentMethod: "Pix",
    date: "12/03/2025",
    seller: "Milla",
  },
  {
    id: "o2",
    code: "#1023",
    clientId: "c6",
    clientName: "Patrícia Gomes",
    items: "Conjunto Alfaiataria Areia",
    quantity: 1,
    total: 1890,
    status: "enviado",
    paymentMethod: "Cartão 3x",
    date: "10/03/2025",
    seller: "Equipe Loja",
  },
  {
    id: "o3",
    code: "#1022",
    clientId: "c2",
    clientName: "Carolina Mendes",
    items: "Calça Wide + Blazer Preto",
    quantity: 2,
    total: 2350,
    status: "pago",
    paymentMethod: "Pix",
    date: "08/03/2025",
    seller: "Milla",
  },
  {
    id: "o4",
    code: "#1021",
    clientId: "c3",
    clientName: "Juliana Rocha",
    items: "Camisa Seda + Saia Plissada",
    quantity: 2,
    total: 1290,
    status: "pendente",
    paymentMethod: "Link pagamento",
    date: "05/03/2025",
    seller: "Equipe Loja",
  },
  {
    id: "o5",
    code: "#1020",
    clientId: "c5",
    clientName: "Mariana Costa",
    items: "Vestido Floral",
    quantity: 1,
    total: 420,
    status: "entregue",
    paymentMethod: "Cartão à vista",
    date: "02/03/2025",
    seller: "Milla",
  },
];

export const seedInteractions: CrmInteraction[] = [
  {
    id: "i1",
    clientId: "c1",
    date: "12/03/2025",
    type: "compra",
    text: "Comprou Vestido Midi Dourado + Clutch",
    value: 3200,
  },
  {
    id: "i2",
    clientId: "c1",
    date: "10/03/2025",
    type: "whatsapp",
    text: "Enviado catálogo de festa, respondeu que amou o dourado.",
  },
  {
    id: "i3",
    clientId: "c2",
    date: "08/03/2025",
    type: "atendimento",
    text: "Atendimento na loja, reservou 2 peças para provar de novo.",
  },
  {
    id: "i4",
    clientId: "c4",
    date: "19/01/2025",
    type: "compra",
    text: "Última compra registrada. Entrar em fluxo de reativação.",
    value: 1150,
  },
];

export const revenueByMonth = [
  { month: "Set", receita: 18400, meta: 20000 },
  { month: "Out", receita: 22100, meta: 20000 },
  { month: "Nov", receita: 19800, meta: 22000 },
  { month: "Dez", receita: 31500, meta: 28000 },
  { month: "Jan", receita: 24300, meta: 24000 },
  { month: "Fev", receita: 26700, meta: 25000 },
  { month: "Mar", receita: 29200, meta: 26000 },
];

export function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
