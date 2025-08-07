export type DiaSemana = 'domingo' | 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado';
export interface Materia {
  id: number;
  nome: string;
  cargaHorariaTotal: number;
  faltas: number;
  status: 'Aprovado' | 'Risco' | 'Reprovado';
  aulasDaSemana: Record<DiaSemana, number>;
  idInstituicao: number;
}
