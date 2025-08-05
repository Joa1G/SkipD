// Interface que corresponde ao schema da API Python
export interface MateriaAPI {
  id?: number;
  nome: string;
  carga_horaria: number;
  faltas: number;
  status: string;
  aulas_domingo: number;
  aulas_segunda: number;
  aulas_terca: number;
  aulas_quarta: number;
  aulas_quinta: number;
  aulas_sexta: number;
  aulas_sabado: number;
  instituicao_id: number;
}

export interface MateriaCreateAPI {
  nome: string;
  carga_horaria: number;
  faltas: number;
  status: string;
  aulas_domingo: number;
  aulas_segunda: number;
  aulas_terca: number;
  aulas_quarta: number;
  aulas_quinta: number;
  aulas_sexta: number;
  aulas_sabado: number;
  instituicao_id: number; // Mantemos aqui para identificar a instituição, mas será usado na URL
}

// Interface para o corpo da requisição (sem instituicao_id)
export interface MateriaCreateBody {
  nome: string;
  carga_horaria: number;
  faltas: number;
  status: string;
  aulas_domingo: number;
  aulas_segunda: number;
  aulas_terca: number;
  aulas_quarta: number;
  aulas_quinta: number;
  aulas_sexta: number;
  aulas_sabado: number;
}
