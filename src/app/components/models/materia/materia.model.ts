export interface Materia {
  id: number;
  nome: string;
  cargaHorariaTotal: number;
  faltas: number;
  status: 'Aprovado' | 'Risco' | 'Reprovado';
  aulasDaSemana: {
    domingo: number;
    segunda: number;
    terca: number;
    quarta: number;
    quinta: number;
    sexta: number;
    sabado: number;
  };
  idInstituicao: number;
}
