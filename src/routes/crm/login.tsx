import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Login oficial do projeto vive em `/`.
 * Esta rota existe apenas por compatibilidade e redireciona para lá.
 */
export const Route = createFileRoute("/crm/login")({
  head: () => ({
    meta: [
      { title: "Entrar · Milla Conceito" },
      {
        name: "description",
        content: "O acesso ao CRM Milla Conceito é feito pela página inicial.",
      },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
