export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  cpf: string;
  senha: string;
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  dataCriacao?: string;
}