export interface Instituicao {
  id: number;
  nome: string;
  percentual_limite_faltas: number;
  materias: Materia[];
}

export interface Materia {
  id: number;
  nome: string;
  carga_horaria_total: number;
  faltas: number;
  status: 'Aprovado' | 'Risco' | 'Reprovado';
}
