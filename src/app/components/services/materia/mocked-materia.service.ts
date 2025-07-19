import { Materia } from '../../models/materia/materia.model';
import { AbstractMateriaService } from './abstract-materia.service';
import { OperationResult } from '../../models/operation-result.model';
import { Injectable, signal, computed, Signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockedMateriaService extends AbstractMateriaService {
  private _materias: WritableSignal<Materia[]> = signal<Materia[]>([
    {
      id: 1,
      nome: 'Algoritmo e Estruturas de Dados II',
      carga_horaria_total: 200,
      faltas: 25,
      status: 'Aprovado',
      idInstituicao: 1,
    },
    {
      id: 2,
      nome: 'Cálculo I',
      carga_horaria_total: 40,
      faltas: 2,
      status: 'Aprovado',
      idInstituicao: 1,
    },
    {
      id: 3,
      nome: 'Redes de Computadores',
      carga_horaria_total: 60,
      faltas: 14,
      status: 'Risco',
      idInstituicao: 1,
    },
    {
      id: 4,
      nome: 'Inteligência Artificial',
      carga_horaria_total: 80,
      faltas: 20,
      status: 'Reprovado',
      idInstituicao: 1,
    },
    {
      id: 5,
      nome: 'Banco de Dados',
      carga_horaria_total: 100,
      faltas: 5,
      status: 'Aprovado',
      idInstituicao: 1,
    },
    {
      id: 6,
      nome: 'Desenvolvimento Web Full Stack',
      carga_horaria_total: 200,
      faltas: 10,
      status: 'Aprovado',
      idInstituicao: 2,
    }
  ]);

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
}
