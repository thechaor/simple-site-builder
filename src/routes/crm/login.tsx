import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogIn, Loader2 } from "lucide-react";

export const Route = createFileRoute("/crm/login")({
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValid) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulação de login (substituir com chamada real ao backend)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // navigate({ to: "/crm" });
    } catch {
      setError("Email ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Acesse sua conta
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Entre com seu e-mail e senha para continuar
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={!!error && !email}
                className="transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={!!error && !password}
                className="transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground transition-all duration-200 ease-in-out hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}