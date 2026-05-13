import { createContext, useContext, useEffect, useState } from "react";
import { AUTH_TOKEN_KEY } from "@/lib/api";
import * as authService from "@/services/authService";
import type { CadastroUsuarioRequest } from "@/types/auth";

const USER_STORAGE_KEY = "agenda_do_vale_user";

export interface AuthUser {
  usuarioId: number;
  nome: string;
  email: string;
}

export type AuthResult = { ok: true } | { ok: false; error: string };

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<AuthResult>;
  cadastro: (data: CadastroUsuarioRequest) => Promise<AuthResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(AUTH_TOKEN_KEY),
  );

  useEffect(() => {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_STORAGE_KEY);
  }, [user]);

  async function login(email: string, senha: string): Promise<AuthResult> {
    try {
      const result = await authService.login({ email, senha });
      setToken(result.token);
      setUser({
        usuarioId: result.usuarioId,
        nome: result.nome,
        email: result.email,
      });
      return { ok: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Email ou senha inválidos";
      return { ok: false, error: message };
    }
  }

  async function cadastro(data: CadastroUsuarioRequest): Promise<AuthResult> {
    try {
      const result = await authService.cadastro(data);
      setToken(result.token);
      setUser({
        usuarioId: result.usuarioId,
        nome: result.nome,
        email: result.email,
      });
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao cadastrar";
      return { ok: false, error: message };
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, cadastro, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return context;
}
