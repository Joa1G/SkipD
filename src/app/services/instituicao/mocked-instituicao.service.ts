import { Instituicao} from '../../models/instituicao/instituicao.model';
import { AbstractInstituicaoService } from './abstract-instituicao.service';
import { OperationResult } from '../../models/operation-result.model';
import { Injectable, signal, computed, Signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockedInstituicaoService extends AbstractInstituicaoService {
  private _instituicoes: WritableSignal<Instituicao[]> = signal<Instituicao[]>([
    {
      id: 1,
      nome: 'Instituto Federal do Amazonas',
      percentual_limite_faltas: 0.25,
    },
    {
      id: 2,
      nome: 'Dx Academy',
      percentual_limite_faltas: 0.30,
    }
  ]);

  instituicoes: Signal<Instituicao[]> = computed(() => this._instituicoes());

  override getInstituicoes(): Observable<OperationResult> {
    try {
      const instituicoes = this.instituicoes();
      return of({success: true, status: 200, data: instituicoes});
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao buscar instituições.'});
    }
  }

  override getInstituicaoById(id: number): Observable<OperationResult> {
    try {
      const instituicao = this._instituicoes().find(i => i.id === id);
      if (instituicao) {
        return of({success: true, status: 200, data: instituicao});
      } else {
        return of({success: false, status: 404, message: 'Instituição não encontrada.'});
      }
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao buscar instituição.'});
    }
  }

  override addInstituicao(instituicao: Omit<Instituicao, 'id'>): Observable<OperationResult> {
    try {
      const instituicoes = this._instituicoes();
      const newId = instituicoes.length > 0 ? Math.max(...instituicoes.map(i => i.id)) + 1 : 1;
      const newInstituicao: Instituicao = {
        id: newId,
        ...instituicao,
      };
      this._instituicoes.set([...instituicoes, newInstituicao]);
      return of({success: true, status: 201});
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao adicionar instituição.'});
    }
  }

  override updateInstituicao(instituicao: Instituicao): Observable<OperationResult> {
    try {
      const instituicoes = this._instituicoes();
      const index = instituicoes.findIndex(i => i.id === instituicao.id);
      if (index !== -1) {
        instituicoes[index] = instituicao;
        this._instituicoes.set(instituicoes);
        return of({success: true, status: 200});
      } else {
        return of({success: false, status: 404, message: 'Instituição não encontrada.'});
      }
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao atualizar instituição.'});
    }
  }

  override deleteInstituicao(id: number): Observable<OperationResult> {
    try {
      const instituicoes = this._instituicoes();
      const index = instituicoes.findIndex(i => i.id === id);
      if (index !== -1) {
        instituicoes.splice(index, 1);
        this._instituicoes.set(instituicoes);
        return of({success: true, status: 200});
      } else {
        return of({success: false, status: 404, message: 'Instituição não encontrada.'});
      }
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao deletar instituição.'});
    }
  }
}
