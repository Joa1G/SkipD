export interface Materia {
  id: number;
  nome: string;
  carga_horaria_total: number;
  faltas: number;
  status: 'Aprovado' | 'Risco' | 'Reprovado';
  idInstituicao: number;
}
