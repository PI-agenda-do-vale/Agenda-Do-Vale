import { apiRequest } from "@/lib/api";
import type {
  CadastroUsuarioRequest,
  LoginRequest,
  LoginResponse,
} from "@/types/auth";

export function login(request: LoginRequest) {
  return apiRequest<LoginResponse>("/login", {
    method: "POST",
    body: request,
  });
}

export function cadastro(request: CadastroUsuarioRequest) {
  return apiRequest<LoginResponse>("/cadastro", {
    method: "POST",
    body: request,
  });
}
