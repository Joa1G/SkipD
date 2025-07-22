import { Materia } from '../../models/materia/materia.model';
import { AbstractMateriaService } from './abstract-materia.service';
import { OperationResult } from '../../models/operation-result.model';
import { Injectable, signal, computed, Signal, WritableSignal, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AbstractInstituicaoService } from '../instituicao/abstract-instituicao.service';

@Injectable()
export class MockedMateriaService extends AbstractMateriaService {
  private _materias: WritableSignal<Materia[]> = signal<Materia[]>([
    {
      id: 1,
      nome: 'Algoritmo e Estruturas de Dados II',
      cargaHorariaTotal: 200,
      faltas: 25,
      status: 'Aprovado',
      aulasDaSemana: [
        { dia: 'domingo', horas: 0 },
        { dia: 'segunda', horas: 3 },
        { dia: 'terca', horas: 2 },
        { dia: 'quarta', horas: 0 },
        { dia: 'quinta', horas: 0 },
        { dia: 'sexta', horas: 0 },
        { dia: 'sabado', horas: 0 }
      ],
      idInstituicao: 1,
    },
    {
      id: 2,
      nome: 'Cálculo I',
      cargaHorariaTotal: 40,
      faltas: 2,
      status: 'Aprovado',
      aulasDaSemana: [
        { dia: 'domingo', horas: 0 },
        { dia: 'segunda', horas: 1 },
        { dia: 'terca', horas: 1 },
        { dia: 'quarta', horas: 0 },
        { dia: 'quinta', horas: 0 },
        { dia: 'sexta', horas: 0 },
        { dia: 'sabado', horas: 0 }
      ],
      idInstituicao: 1,
    },
    {
      id: 3,
      nome: 'Redes de Computadores',
      cargaHorariaTotal: 60,
      faltas: 14,
      status: 'Risco',
      aulasDaSemana: [
        { dia: 'domingo', horas: 0 },
        { dia: 'segunda', horas: 2 },
        { dia: 'terca', horas: 1 },
        { dia: 'quarta', horas: 0 },
        { dia: 'quinta', horas: 0 },
        { dia: 'sexta', horas: 0 },
        { dia: 'sabado', horas: 0 }
      ],
      idInstituicao: 1,
    },
    {
      id: 4,
      nome: 'Inteligência Artificial',
      cargaHorariaTotal: 80,
      faltas: 20,
      status: 'Reprovado',
      aulasDaSemana: [
        { dia: 'domingo', horas: 0 },
        { dia: 'segunda', horas: 0 },
        { dia: 'terca', horas: 0 },
        { dia: 'quarta', horas: 2 },
        { dia: 'quinta', horas: 1 },
        { dia: 'sexta', horas: 0 },
        { dia: 'sabado', horas: 0 }
      ],
      idInstituicao: 1,
    },
    {
      id: 5,
      nome: 'Banco de Dados',
      cargaHorariaTotal: 100,
      faltas: 5,
      status: 'Aprovado',
      aulasDaSemana: [
        { dia: 'domingo', horas: 0 },
        { dia: 'segunda', horas: 0 },
        { dia: 'terca', horas: 0 },
        { dia: 'quarta', horas: 1 },
        { dia: 'quinta', horas: 2 },
        { dia: 'sexta', horas: 0 },
        { dia: 'sabado', horas: 0 }
      ],
      idInstituicao: 1,
    },
    {
      id: 6,
      nome: 'Desenvolvimento Web Full Stack',
      cargaHorariaTotal: 200,
      faltas: 10,
      status: 'Aprovado',
      aulasDaSemana: [
        { dia: 'domingo', horas: 0 },
        { dia: 'segunda', horas: 0 },
        { dia: 'terca', horas: 0 },
        { dia: 'quarta', horas: 3 },
        { dia: 'quinta', horas: 2 },
        { dia: 'sexta', horas: 0 },
        { dia: 'sabado', horas: 0 }
      ],
      idInstituicao: 2,
    }
  ]);

  private serviceInstituicoes = inject(AbstractInstituicaoService);
  private instituicoes = this.serviceInstituicoes.instituicoes;

  override materias = computed(() => this._materias());

  override getMaterias(): Observable<OperationResult> {
    try {
      const materias = this.materias();
      return of({success: true, status: 200, data: materias});
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao buscar matérias.'});
    }
  }

  override getMateriaById(id: number): Observable<OperationResult> {
    try {
      const materia = this.materias().find(m => m.id === id);
      if (!materia) {
        return of({success: false, status: 404, message: 'Matéria não encontrada.'});
      }
      return of({success: true, status: 200, data: materia});
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao buscar matéria.'});
    }
  }

  override addMateria(materia: Omit<Materia, 'id'>): Observable<OperationResult> {
    try {
      const newId = this._materias().length > 0 ? Math.max(...this._materias().map(m => m.id)) + 1 : 1;
      const newMateria: Materia = {
        id: newId,
        ...materia,
      };
      this._materias.update(materias => [...materias, newMateria]);
      return of({success: true, status: 201, data: newMateria});
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao adicionar matéria.'});
    }
  }

  override updateMateria(materia: Materia): Observable<OperationResult> {
    try {
      const index = this._materias().findIndex(m => m.id === materia.id);
      if (index === -1) {
        return of({success: false, status: 404, message: 'Matéria não encontrada.'});
      }
      this._materias.update(materias => {
        const updatedMaterias = [...materias];
        updatedMaterias[index] = materia;
        return updatedMaterias;
      });
      return of({success: true, status: 200, data: materia});
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao atualizar matéria.'});
    }
  }

  override deleteMateria(id: number): Observable<OperationResult> {
    try {
      const index = this._materias().findIndex(m => m.id === id);
      if (index === -1) {
        return of({success: false, status: 404, message: 'Matéria não encontrada.'});
      }
      this._materias.update(materias => {
        const updatedMaterias = [...materias];
        updatedMaterias.splice(index, 1);
        return updatedMaterias;
      });
      return of({success: true, status: 200});
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao deletar matéria.'});
    }
  }

  override getInstituicaoByMateriaId(idInstituicao: number): Observable<OperationResult> {
    try {
      const materia = this._materias().find(m => m.id === idInstituicao);
      if (!materia) {
        return of({success: false, status: 404, message: 'Instituição não encontrada.'});
      }
      return of({success: true, status: 200, data: materia.idInstituicao});
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao buscar instituição.'});
    }
  }

  override addFalta(id: number, falta: any): Observable<OperationResult> {
    try {
      const materia = this._materias().find(m => m.id === id);
      if (!materia) {
        return of({success: false, status: 404, message: 'Matéria não encontrada.'});
      }
      materia.faltas += falta;
      this.updateStatus(id);
      this._materias.update(materias => {
        const updatedMaterias = [...materias];
        const index = updatedMaterias.findIndex(m => m.id === id);
        updatedMaterias[index] = materia;
        return updatedMaterias;
      });
      return of({success: true, status: 200, data: materia});
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao adicionar falta.'});
    }
  }

  override updateStatus(id: number): Observable<OperationResult> {
    try {
      const materia = this._materias().find(m => m.id === id);
      const limiteFaltasInsituicional = this.instituicoes().find(i => i.id === materia!.idInstituicao)?.percentual_limite_faltas || 0.25;
      const faltasPermitidas = materia!.cargaHorariaTotal * limiteFaltasInsituicional;
      if (!materia) {
        return of({success: false, status: 404, message: 'Matéria não encontrada.'});
      }
      if (materia.faltas >= faltasPermitidas) {
        materia.status = 'Reprovado';
      } else if (materia.faltas >= (faltasPermitidas * 0.75)) {
        materia.status = 'Risco';
      } else {
        materia.status = 'Aprovado';
      }
      return of({success: true, status: 200, data: materia});
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao atualizar status.'});
    }
  }

  override getDiasHorasComAula(id: number): Observable<OperationResult> {
    try {
      const materia = this._materias().find(m => m.id === id);
      if (!materia) {
        return of({success: false, status: 404, message: 'Matéria não encontrada.'});
      }
      const aulasHoras = materia.aulasDaSemana
      ?.filter(aula => aula.horas > 0)
      .map(aula => ({
        dia: aula.dia,
        horas: aula.horas
      }));
      return of({success: true, status: 200, data: aulasHoras});
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao buscar dias e horas com aula.'});
    }
  }

}
