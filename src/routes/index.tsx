import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, LogIn, ShieldCheck, Users, TrendingUp } from "lucide-react";
import { AuthError, getRememberedEmail, signIn } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar · Milla Conceito" },
      {
        name: "description",
        content:
          "Acesse o CRM Milla Conceito com e-mail e senha para gerenciar clientes, pipeline e pedidos.",
      },
      { property: "og:title", content: "Entrar · Milla Conceito" },
      {
        property: "og:description",
        content: "Acesso interno ao CRM: clientes, pipeline, pedidos, tarefas e relatórios.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeLoginPage,
});

function HomeLoginPage() {
  const navigate = useNavigate();
  // Inicializa vazio para evitar divergência de hidratação SSR (localStorage
  // só existe no cliente). O e-mail lembrado é carregado no useEffect abaixo.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setEmail(getRememberedEmail());
  }, []);

  const trimmedEmail = email.trim();
  const isValid = trimmedEmail !== "" && password !== "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isValid) {
      setError("Por favor, preencha e-mail e senha.");
      return;
    }

    setIsLoading(true);
    try {
      // Integração real de auth em src/lib/auth.ts (trocar corpo por fetch no backend).
      await signIn({ email: trimmedEmail, password, remember });
      await navigate({ to: "/crm" });
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError("Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main id="conteudo" className="min-h-screen w-full bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl lg:grid-cols-2">
        {/* Coluna institucional */}
        <section
          aria-label="Sobre o CRM Milla Conceito"
          className="relative hidden flex-col justify-between overflow-hidden border-r border-zinc-900 bg-zinc-950 px-10 py-12 lg:flex"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(201,161,74,0.16),transparent_70%)]"
          />
          <header className="relative">
            <img
              src="/logo.png"
              alt="Logotipo Milla Conceito"
              className="h-14 w-14 rounded-xl object-cover shadow-lg"
              loading="eager"
              decoding="async"
            />
            <p className="brand-eyebrow mt-6 text-[#C9A14A]">Milla Conceito</p>
            <h1 className="brand-title mt-3 text-4xl font-semibold text-white">
              Gestão da loja em um só lugar
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
              CRM interno para acompanhar clientes, pipeline de vendas, pedidos, tarefas e
              relatórios — com padrão visual sóbrio e acessível.
            </p>
          </header>

          <ul className="relative space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A14A]" aria-hidden="true" />
              <span className="text-zinc-300">
                <strong className="font-semibold text-white">Clientes e histórico</strong>
                <span className="block text-zinc-400">
                  Segmentação por nível, LTV e timeline de atendimentos.
                </span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A14A]" aria-hidden="true" />
              <span className="text-zinc-300">
                <strong className="font-semibold text-white">Pipeline e pedidos</strong>
                <span className="block text-zinc-400">
                  Do lead ao pós-venda, com status e responsáveis claros.
                </span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A14A]" aria-hidden="true" />
              <span className="text-zinc-300">
                <strong className="font-semibold text-white">Acesso interno</strong>
                <span className="block text-zinc-400">
                  Uso restrito à equipe. Seus dados ficam neste dispositivo até a integração com o
                  servidor.
                </span>
              </span>
            </li>
          </ul>

          <p className="relative text-xs text-zinc-600">
            © {new Date().getFullYear()} Milla Conceito · Acesso interno da equipe
          </p>
        </section>

        {/* Coluna do formulário */}
        <section
          aria-label="Acesso à conta"
          className="flex items-center justify-center px-4 py-12 sm:px-8"
        >
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <img
                src="/logo.png"
                alt="Logotipo Milla Conceito"
                className="mx-auto h-16 w-16 rounded-2xl object-cover shadow-lg"
                loading="eager"
                decoding="async"
              />
              <p className="brand-eyebrow mt-4 text-[#C9A14A]">Milla Conceito</p>
            </div>

            <div className="mb-6 text-left">
              <h2 className="brand-title text-3xl font-semibold text-white">Bem-vinda de volta</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Entre com seu e-mail e senha para continuar
              </p>
            </div>

            <Card className="border-zinc-800 bg-zinc-950 shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-semibold text-white">Acesse sua conta</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div aria-live="polite" role="status" className="min-h-0">
                    {error ? (
                      <div
                        role="alert"
                        className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                      >
                        {error}
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-200">
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? "login-erro" : undefined}
                      className="border-zinc-800 bg-black text-zinc-100 placeholder:text-zinc-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-zinc-200">
                        Senha
                      </Label>
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="inline-flex items-center gap-1 rounded text-xs font-medium text-zinc-400 transition hover:text-[#C9A14A]"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? (
                          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      aria-invalid={error ? true : undefined}
                      className="border-zinc-800 bg-black text-zinc-100 placeholder:text-zinc-500"
                    />
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                      className="h-4 w-4 accent-[#C9A14A]"
                    />
                    Lembrar meu e-mail neste dispositivo
                  </label>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    aria-disabled={isLoading}
                    className="w-full bg-[#C9A14A] text-black transition hover:bg-[#C9A14A]/90 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                        Entrar
                      </>
                    )}
                  </Button>

                  {error ? (
                    <p id="login-erro" className="sr-only">
                      {error}
                    </p>
                  ) : null}
                </form>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-xs text-zinc-600">
              © {new Date().getFullYear()} Milla Conceito · Acesso interno ·{" "}
              <span className="text-zinc-500">
                Em caso de dificuldade, fale com a responsável pela loja.
              </span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
