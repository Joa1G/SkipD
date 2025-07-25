import { Signal } from '@angular/core'
import { Instituicao } from '../../models/instituicao/instituicao.model';
import { Observable } from 'rxjs';
import { OperationResult } from '../../models/operation-result.model';

export abstract class AbstractInstituicaoService {
  abstract instituicoes: Signal<Instituicao[]>;
  abstract getInstituicoes(): Observable<OperationResult>;
  abstract getInstituicaoById(id: number): Observable<OperationResult>;
  abstract addInstituicao(instituicao: Instituicao): Observable<OperationResult>;
  abstract updateInstituicao(instituicao: Instituicao): Observable<OperationResult>;
  abstract deleteInstituicao(id: number): Observable<OperationResult>;
  abstract getInstituicaoByUsuarioId(id: number): Observable<OperationResult>;
}
