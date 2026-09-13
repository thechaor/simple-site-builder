import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Rota legada consolidada.
 * A base oficial de clientes vive em /crm/clientes — esta rota apenas redireciona
 * para manter links antigos funcionando.
 */
export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes · Milla Conceito" },
      {
        name: "description",
        content: "Redirecionando para a base oficial de clientes do CRM Milla Conceito.",
      },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/crm/clientes" });
  },
});
