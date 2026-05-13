export interface LoginRequest {
  email: string;
  senha: string;
}

export interface CadastroUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  nome: string;
  email: string;
  usuarioId: number;
}
