import { Instituicao} from '../../models/instituicao/instituicao.model';
import { AbstractInstituicaoService } from './abstract-instituicao.service';
import { OperationResult } from '../../models/operation-result.model';
import { Injectable, signal, computed, Signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class InstituicaoService extends AbstractInstituicaoService {
  private _instituicoes: WritableSignal<Instituicao[]> = signal<Instituicao[]>([]);

  instituicoes: Signal<Instituicao[]> = computed(() => this._instituicoes());

  constructor(private http: HttpClient) {
    super();
  }

  override getInstituicoes(): Observable<OperationResult> {
    return of();
  }

  override getInstituicaoById(id: number): Observable<OperationResult> {
    return of();
  }

  override addInstituicao(instituicao: Omit<Instituicao, 'id'>): Observable<OperationResult> {
    return of();
  }

  override updateInstituicao(instituicao: Instituicao): Observable<OperationResult> {
    return of();
  }

  override deleteInstituicao(id: number): Observable<OperationResult> {
    return of();
  }
  override getInstituicaoByUsuarioId(id: number): Observable<OperationResult> {
    return of();
  }
}
