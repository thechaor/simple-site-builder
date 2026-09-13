/**
 * Camada de autenticação do CRM Milla Conceito.
 *
 * Hoje o app opera em modo local (demonstração). Para integrar o backend real,
 * implemente `signIn` abaixo com a chamada à sua API (ex.: POST /api/auth/login)
 * e mantenha a mesma assinatura: resolve com o e-mail autenticado ou lança
 * um `AuthError` com mensagem em pt-BR.
 */

export class AuthError extends Error {
  code: "invalid-credentials" | "network" | "unknown";
  constructor(message: string, code: AuthError["code"] = "unknown") {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export interface SignInInput {
  email: string;
  password: string;
  remember: boolean;
}

const SESSION_KEY = "mc_session_email";
const REMEMBER_KEY = "mc_user_email";

export function getRememberedEmail(): string {
  try {
    return localStorage.getItem(REMEMBER_KEY) ?? "";
  } catch {
    return "";
  }
}

export function getSessionEmail(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function signOut() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Autentica o usuário. Substitua o corpo por fetch real quando o backend existir:
 *
 *   const res = await fetch("/api/auth/login", { method: "POST", ... });
 *   if (res.status === 401) throw new AuthError("E-mail ou senha inválidos.", "invalid-credentials");
 *   if (!res.ok) throw new AuthError("Não foi possível entrar. Tente novamente.", "network");
 */
export async function signIn({ email, password, remember }: SignInInput): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();

  // Guardas locais — espelham a validação que o backend deve repetir.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new AuthError("Informe um endereço de e-mail válido.", "invalid-credentials");
  }
  if (password.length < 4) {
    throw new AuthError("A senha deve ter pelo menos 4 caracteres.", "invalid-credentials");
  }

  // TODO: trocar por chamada real ao backend (sem setTimeout simulado).
  // Mantido síncrono de propósito: nenhuma latência artificial.
  try {
    localStorage.setItem(SESSION_KEY, normalizedEmail);
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, normalizedEmail);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
  } catch {
    throw new AuthError("Não foi possível salvar a sessão neste navegador.", "unknown");
  }

  return normalizedEmail;
}

export function formatDateBR(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("pt-BR");
}
