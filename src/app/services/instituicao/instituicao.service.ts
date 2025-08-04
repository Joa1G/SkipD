import { Instituicao} from '../../models/instituicao/instituicao.model';
import { AbstractInstituicaoService } from './abstract-instituicao.service';
import { OperationResult } from '../../models/operation-result.model';
import { Injectable, signal, computed, Signal, WritableSignal } from '@angular/core';
import { map, Observable, of, catchError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environments/environments';

@Injectable()
export class InstituicaoService extends AbstractInstituicaoService {

  private _instituicoes: WritableSignal<Instituicao[]> = signal<Instituicao[]>([]);
  instituicoes: Signal<Instituicao[]> = computed(() => this._instituicoes());

  constructor(private http: HttpClient, private authService: AuthService) {
    super();
    this.refresh();
  }

  override refresh(): void {
    const userId = this.authService.getUserId()!;
    this.getInstituicoesByUsuarioId(userId).subscribe(result => {
      if (result.success) {
        this._instituicoes.set(result.data as Instituicao[]);
      }
    });
  }

  override getInstituicaoById(id: number): Observable<OperationResult> {
    return this.http.get(`${environment.apiUrl}/instituition/${id}`,
      {observe: 'response'}
    ).pipe(
      map(response => ({
        success: response.status >= 200 && response.status < 300,
        data: response.body,
        status: response.status
      })),
      catchError((error: HttpErrorResponse) => of({
        success: false,
        data: error.message,
        status: error.status
      }))
    )
  }

  override addInstituicao(instituicao: Omit<Instituicao, 'id'>): Observable<OperationResult> {
    const userId = this.authService.getUserId()!;
    return this.http.post(`${environment.apiUrl}/instituition/${userId}`, instituicao,
      {observe: 'response'}
    ).pipe(
      map(response => ({
        success: response.status >= 200 && response.status < 300,
        data: response.body,
        status: response.status
      })),
      catchError((error: HttpErrorResponse) => of({
        success: false,
        data: error.message,
        status: error.status
      }))
    );
  }

  override updateInstituicao(instituicao: Instituicao): Observable<OperationResult> {
    return this.http.put(`${environment.apiUrl}/instituition/${instituicao.id}`, instituicao,
      {observe: 'response'}
    ).pipe(
      map(response => ({
        success: response.status >= 200 && response.status < 300,
        data: response.body,
        status: response.status
      })),
      catchError((error: HttpErrorResponse) => of({
        success: false,
        data: error.message,
        status: error.status
      }))
    );
  }

  override deleteInstituicao(id: number): Observable<OperationResult> {
    return this.http.delete(`${environment.apiUrl}/instituition/${id}`,
      {observe: 'response'}
    ).pipe(
      map(response => ({
        success: response.status >= 200 && response.status < 300,
        data: response.body,
        status: response.status
      })),
      catchError((error: HttpErrorResponse) => of({
        success: false,
        data: error.message,
        status: error.status
      }))
    );
  }
  override getInstituicoesByUsuarioId(userId: number): Observable<OperationResult> {
    return this.http.get(`${environment.apiUrl}/instituition/all/${userId}`,
      {observe: 'response'}
    ).pipe(
      map(response => ({
        success: response.status >= 200 && response.status < 300,
        data: response.body,
        status: response.status
      })),
      catchError((error: HttpErrorResponse) => of({
        success: false,
        data: error.message,
        status: error.status
      }))
    )
  }
}
