import { Instituicao } from '../models/instituicao.model';

export let instituicoesMockedData: Instituicao[] = [
  {
    id: 1,
    nome: 'Instituto Federal do Amazonas',
    percentual_limite_faltas: 25,
    materia: [
      {
        id: 1,
        nome: 'Algoritmo e Estruturas de Dados II',
        carga_horaria_total: 200,
        faltas: 25,
        status: 'Aprovado',
      },
      {
        id: 2,
        nome: 'Cálculo I',
        carga_horaria_total: 40,
        faltas: 2,
        status: 'Aprovado',
      },
      {
        id: 3,
        nome: 'Redes de Computadores',
        carga_horaria_total: 60,
        faltas: 14,
        status: 'Risco',
      },
      {
        id: 4,
        nome: 'Inteligência Artificial',
        carga_horaria_total: 80,
        faltas: 20,
        status: 'Reprovado',
      },
      {
        id: 5,
        nome: 'Banco de Dados',
        carga_horaria_total: 100,
        faltas: 5,
        status: 'Aprovado',
      },
    ],
  },
  {
    id: 2,
    nome: 'Dx Academy',
    percentual_limite_faltas: 30,
    materia: [
      {
        id: 1,
        nome: 'Desenvolvimento Web Full Stack',
        carga_horaria_total: 200,
        faltas: 10,
        status: 'Aprovado',
      },
    ],
  },
];
