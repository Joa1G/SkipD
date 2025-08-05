export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  isPremium: boolean;
  urlFoto: string;
}

export interface UsuarioLogin {
  email: string;
  senha: string;
}
