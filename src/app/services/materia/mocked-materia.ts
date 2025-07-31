import { Materia } from "../../models/materia/materia.model"

export const mockedMateria: Materia[] = [
  {
      id: 1,
      nome: 'Algoritmo e Estruturas de Dados II',
      cargaHorariaTotal: 200,
      faltas: 25,
      status: 'Aprovado',
      aulasDaSemana: {
        domingo: 0,
        segunda: 2,
        terca: 1,
        quarta: 0,
        quinta: 0,
        sexta: 0,
        sabado: 0
      },
      idInstituicao: 1,
    },
    {
      id: 2,
      nome: 'Cálculo I',
      cargaHorariaTotal: 40,
      faltas: 2,
      status: 'Aprovado',
      aulasDaSemana: {
        domingo: 0,
        segunda: 0,
        terca: 0,
        quarta: 1,
        quinta: 0,
        sexta: 0,
        sabado: 0
      },
      idInstituicao: 1,
    },
    {
      id: 3,
      nome: 'Redes de Computadores',
      cargaHorariaTotal: 60,
      faltas: 14,
      status: 'Risco',
      aulasDaSemana: {
        domingo: 0,
        segunda: 0,
        terca: 0,
        quarta: 1,
        quinta: 0,
        sexta: 0,
        sabado: 0
      },
      idInstituicao: 1,
    },
    {
      id: 4,
      nome: 'Inteligência Artificial',
      cargaHorariaTotal: 80,
      faltas: 20,
      status: 'Reprovado',
      aulasDaSemana: {
        domingo: 0,
        segunda: 0,
        terca: 0,
        quarta: 2,
        quinta: 0,
        sexta: 2,
        sabado: 0
      },
      idInstituicao: 1,
    },
    {
      id: 5,
      nome: 'Banco de Dados',
      cargaHorariaTotal: 100,
      faltas: 5,
      status: 'Aprovado',
      aulasDaSemana: {
        domingo: 0,
        segunda: 0,
        terca: 0,
        quarta: 1,
        quinta: 2,
        sexta: 0,
        sabado: 0
      },
      idInstituicao: 1,
    },
    {
      id: 7,
      nome: 'Matemática Discreta',
      cargaHorariaTotal: 60,
      faltas: 5,
      status: 'Aprovado',
      aulasDaSemana: {
        domingo: 0,
        segunda: 0,
        terca: 0,
        quarta: 1,
        quinta: 0,
        sexta: 0,
        sabado: 0
      },
      idInstituicao: 3,
    },
    {
      id: 8,
      nome: 'Programação Orientada a Objetos',
      cargaHorariaTotal: 80,
      faltas: 15,
      status: 'Risco',
      aulasDaSemana: {
        domingo: 0,
        segunda: 0,
        terca: 1,
        quarta: 0,
        quinta: 1,
        sexta: 0,
        sabado: 0
      },
      idInstituicao: 3,
    },
    {
      id: 9,
      nome: 'Engenharia de Software',
      cargaHorariaTotal: 120,
      faltas: 24,
      status: 'Reprovado',
      aulasDaSemana: {
        domingo: 0,
        segunda: 0,
        terca: 0,
        quarta: 1,
        quinta: 1,
        sexta: 1,
        sabado: 0
      },
      idInstituicao: 3,
    }
]
