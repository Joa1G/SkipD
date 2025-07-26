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
      id_usuario: 2
    },
    {
      id: 2,
      nome: 'Dx Academy',
      percentual_limite_faltas: 0.30,
      id_usuario: 2
    },
    {
      id: 3,
      nome: 'Universidade Estadual do Amazonas',
      percentual_limite_faltas: 0.20,
      id_usuario: 1
    },
    {
      id: 4,
      nome: 'Dx Academy',
      percentual_limite_faltas: 0.30,
      id_usuario: 1
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
      this._instituicoes.update(instituicoes => [...instituicoes, newInstituicao]);
      return of({success: true, status: 201, data: newInstituicao});
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao adicionar instituição.'});
    }
  }

  override updateInstituicao(instituicao: Instituicao): Observable<OperationResult> {
    try {
      let updated = false;
      this._instituicoes.update(list =>
        list.map(i => {
          if (i.id === instituicao.id) {
            updated = true;
            return { ...instituicao };
          }
          return i;
        })
      );
      if (updated) {
        return of({success: true, status: 200, message: 'Instituição atualizada com sucesso.'});
      } else {
        return of({success: false, status: 404, message: 'Instituição não encontrada.'});
      }
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao atualizar instituição.'});
    }
  }

  override deleteInstituicao(id: number): Observable<OperationResult> {
    try {
      const index = this._instituicoes().findIndex(i => i.id === id);
      if (index === -1) {
        return of({success: false, status: 404, message: 'Instituição não encontrada.'});
      }
      this._instituicoes.update(instituicoes => {
        const updatedInstituicoes = [...instituicoes];
        updatedInstituicoes.splice(index, 1);
        return updatedInstituicoes;
      });
      return of({success: true, status: 200, message: 'Instituição deletada com sucesso.'});
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao deletar instituição.'});
    }
  }

  override getInstituicaoByUsuarioId(userId: number): Observable<OperationResult> {
    try {
      const instituicao = this._instituicoes().find(i => i.id_usuario === userId);
      if (instituicao) {
        return of({success: true, status: 200, data: instituicao});
      } else {
        return of({success: false, status: 404, message: 'Instituição não encontrada.'});
      }
    } catch (error) {
      return of({success: false, status: 500, message: 'Erro ao buscar instituição por usuário.'});
    }
  }
}
