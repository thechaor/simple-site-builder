import { Link } from "@tanstack/react-router";
import { AlertTriangle, SearchX } from "lucide-react";

export function NotFoundState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <SearchX className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <p className="brand-eyebrow mt-4 text-muted-foreground">Milla Conceito</p>
        <h1 className="mt-2 font-serif text-6xl font-semibold text-foreground">404</h1>
        <h2 className="mt-3 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O endereço acessado não existe ou foi movido. Verifique o link ou volte ao início.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
          <Link
            to="/crm"
            className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Ir para o CRM
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RootErrorState({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <p className="brand-eyebrow mt-4 text-muted-foreground">Milla Conceito</p>
        <h1 className="mt-2 font-serif text-6xl font-semibold text-foreground">500</h1>
        <h2 className="mt-3 text-xl font-semibold text-foreground">Algo não saiu como esperado</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocorreu um erro inesperado. Tente novamente em instantes.
          {import.meta.env.DEV && error?.message ? (
            <span className="mt-2 block rounded-md border bg-muted p-2 text-left text-xs text-muted-foreground">
              {error.message}
            </span>
          ) : null}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
