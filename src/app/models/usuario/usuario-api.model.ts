// Interfaces para comunicação com a API Python (snake_case)
export interface UsuarioAPI {
  id: number;
  nome: string;
  email: string;
  senha: string;
  is_premium: boolean;
  url_foto: string;
}

export interface UsuarioCreateAPI {
  nome: string;
  email: string;
  senha: string;
  is_premium?: boolean;
  url_foto?: string;
}

export interface UsuarioUpdateAPI {
  id: number;
  nome: string;
  email: string;
  senha: string;
  is_premium: boolean;
  url_foto: string;
}
