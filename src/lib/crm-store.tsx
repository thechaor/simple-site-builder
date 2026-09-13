import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  seedClients,
  seedInteractions,
  seedLeads,
  seedOrders,
  seedTasks,
  type CrmClient,
  type CrmInteraction,
  type CrmLead,
  type CrmOrder,
  type CrmTask,
} from "./crm-data";

interface CrmState {
  clients: CrmClient[];
  leads: CrmLead[];
  tasks: CrmTask[];
  orders: CrmOrder[];
  interactions: CrmInteraction[];
  addClient: (c: Omit<CrmClient, "id" | "createdAt" | "totalSpent" | "lastPurchase"> & { totalSpent?: number; lastPurchase?: string }) => CrmClient;
  updateClient: (id: string, patch: Partial<CrmClient>) => void;
  deleteClient: (id: string) => void;
  addLead: (l: Omit<CrmLead, "id" | "createdAt" | "updatedAt">) => void;
  moveLead: (id: string, stage: CrmLead["stage"]) => void;
  deleteLead: (id: string) => void;
  addTask: (t: Omit<CrmTask, "id">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addOrder: (o: Omit<CrmOrder, "id" | "code">) => void;
  updateOrderStatus: (id: string, status: CrmOrder["status"]) => void;
  addInteraction: (i: Omit<CrmInteraction, "id">) => void;
  resetAll: () => void;
}

const Ctx = createContext<CrmState | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function CrmProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<CrmClient[]>(() => load("mc_clients", seedClients));
  const [leads, setLeads] = useState<CrmLead[]>(() => load("mc_leads", seedLeads));
  const [tasks, setTasks] = useState<CrmTask[]>(() => load("mc_tasks", seedTasks));
  const [orders, setOrders] = useState<CrmOrder[]>(() => load("mc_orders", seedOrders));
  const [interactions, setInteractions] = useState<CrmInteraction[]>(() =>
    load("mc_interactions", seedInteractions),
  );

  useEffect(() => save("mc_clients", clients), [clients]);
  useEffect(() => save("mc_leads", leads), [leads]);
  useEffect(() => save("mc_tasks", tasks), [tasks]);
  useEffect(() => save("mc_orders", orders), [orders]);
  useEffect(() => save("mc_interactions", interactions), [interactions]);

  const addClient: CrmState["addClient"] = useCallback((c) => {
    const now = new Date().toLocaleDateString("pt-BR");
    const client: CrmClient = {
      ...c,
      id: `${Date.now()}`,
      createdAt: now,
      totalSpent: c.totalSpent ?? 0,
      lastPurchase: c.lastPurchase ?? now,
      tags: c.tags ?? [],
    };
    setClients((prev) => [client, ...prev]);
    return client;
  }, []);

  const updateClient = useCallback((id: string, patch: Partial<CrmClient>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addLead: CrmState["addLead"] = useCallback((l) => {
    const now = new Date().toLocaleDateString("pt-BR");
    setLeads((prev) => [{ ...l, id: `${Date.now()}`, createdAt: now, updatedAt: now }, ...prev]);
  }, []);

  const moveLead = useCallback((id: string, stage: CrmLead["stage"]) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, stage, updatedAt: new Date().toLocaleDateString("pt-BR") } : l,
      ),
    );
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const addTask: CrmState["addTask"] = useCallback((t) => {
    setTasks((prev) => [{ ...t, id: `${Date.now()}` }, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "concluida" ? "pendente" : "concluida" } : t,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addOrder: CrmState["addOrder"] = useCallback(
    (o) => {
      const code = `#${1025 + orders.length}`;
      setOrders((prev) => [{ ...o, id: `${Date.now()}`, code }, ...prev]);
    },
    [orders.length],
  );

  const updateOrderStatus = useCallback((id: string, status: CrmOrder["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const addInteraction: CrmState["addInteraction"] = useCallback((i) => {
    setInteractions((prev) => [{ ...i, id: `${Date.now()}` }, ...prev]);
  }, []);

  const resetAll = useCallback(() => {
    setClients(seedClients);
    setLeads(seedLeads);
    setTasks(seedTasks);
    setOrders(seedOrders);
    setInteractions(seedInteractions);
  }, []);

  const value = useMemo(
    () => ({
      clients,
      leads,
      tasks,
      orders,
      interactions,
      addClient,
      updateClient,
      deleteClient,
      addLead,
      moveLead,
      deleteLead,
      addTask,
      toggleTask,
      deleteTask,
      addOrder,
      updateOrderStatus,
      addInteraction,
      resetAll,
    }),
    [
      clients,
      leads,
      tasks,
      orders,
      interactions,
      addClient,
      updateClient,
      deleteClient,
      addLead,
      moveLead,
      deleteLead,
      addTask,
      toggleTask,
      deleteTask,
      addOrder,
      updateOrderStatus,
      addInteraction,
      resetAll,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCrm() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCrm deve ser usado dentro de <CrmProvider>");
  return ctx;
}
