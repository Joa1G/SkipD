export interface Materia {
  id: number;
  nome: string;
  cargaHorariaTotal: number;
  faltas: number;
  status: 'Aprovado' | 'Risco' | 'Reprovado';
  aulasDaSemana?: {
    dia: string;
    horas: number;
  }[];
  idInstituicao: number;
}
