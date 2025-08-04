import { Materia } from '../../models/materia/materia.model';
import { AbstractMateriaService } from './abstract-materia.service';
import { OperationResult } from '../../models/operation-result.model';
import {
  Injectable,
  signal,
  computed,
  Signal,
  WritableSignal,
} from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { AbstractInstituicaoService } from '../instituicao/abstract-instituicao.service';

@Injectable()
export class MateriaService extends AbstractMateriaService {
  constructor(private http: HttpClient, private serviceInstituicoes: AbstractInstituicaoService) {
    super();
  }

  override getMateriaById(id: number): Observable<OperationResult> {
    return this.http
      .get(`${environment.apiUrl}/subject/${id}`, { observe: 'response' })
      .pipe(
        map((response) => ({
          success: response.status >= 200 && response.status < 300,
          data: response.body,
          status: response.status,
        })),
        catchError((error: HttpErrorResponse) =>
          of({
            success: false,
            data: error.message,
            status: error.status,
          })
        )
      );
  }

  override addMateria(
    materia: Omit<Materia, 'id'>
  ): Observable<OperationResult> {
    return this.http
      .post(`${environment.apiUrl}/subject`, materia, { observe: 'response' })
      .pipe(
        map((response) => ({
          success: response.status >= 200 && response.status < 300,
          data: response.body,
          status: response.status,
        })),
        catchError((error: HttpErrorResponse) =>
          of({
            success: false,
            data: error.message,
            status: error.status,
          })
        )
      );
  }

  override updateMateria(materia: Materia): Observable<OperationResult> {
    return this.http
      .put(`${environment.apiUrl}/subject/${materia.id}`, materia, {
        observe: 'response',
      })
      .pipe(
        map((response) => ({
          success: response.status >= 200 && response.status < 300,
          data: response.body,
          status: response.status,
        })),
        catchError((error: HttpErrorResponse) =>
          of({
            success: false,
            data: error.message,
            status: error.status,
          })
        )
      );
  }

  override deleteMateria(id: number): Observable<OperationResult> {
    return this.http
      .delete(`${environment.apiUrl}/subject/${id}`, { observe: 'response' })
      .pipe(
        map((response) => ({
          success: response.status >= 200 && response.status < 300,
          data: response.body,
          status: response.status,
        })),
        catchError((error: HttpErrorResponse) =>
          of({
            success: false,
            data: error.message,
            status: error.status,
          })
        )
      );
  }

  override getMateriasByInstituicaoId(
    idInstituicao: number
  ): Observable<OperationResult> {
    return this.http
      .get(`${environment.apiUrl}/subject/all/${idInstituicao}`, {
        observe: 'response',
      })
      .pipe(
        map((response) => ({
          success: response.status >= 200 && response.status < 300,
          data: response.body,
          status: response.status,
        })),
        catchError((error: HttpErrorResponse) =>
          of({
            success: false,
            data: error.message,
            status: error.status,
          })
        )
      );
  }

  override addFalta(
    id: number,
    falta: { quantidade: number }
  ): Observable<OperationResult> {
    return this.getMateriaById(id).pipe(
      switchMap((result) => {
        if (result.success && result.data) {
          const materia = result.data as Materia;
          // Incrementa o valor das faltas
          materia.faltas = (materia.faltas || 0) + (falta.quantidade || 1);

          // Usa o método updateMateria existente
          return this.updateMateria(materia);
        } else {
          return of({
            success: false,
            data: 'Matéria não encontrada',
            status: 404,
          });
        }
      })
    );
  }

  override updateStatus(id: number): Observable<OperationResult> {
    return this.getMateriaById(id).pipe(
      switchMap((materiaResult) => {
        if (!materiaResult.success || !materiaResult.data) {
          return of({
            success: false,
            status: 404,
            data: 'Matéria não encontrada.',
          });
        }

        const materia = materiaResult.data as Materia;

        // Você precisará buscar a instituição também via HTTP
        return this.serviceInstituicoes.getInstituicaoById(materia.idInstituicao).pipe(
          switchMap((instituicaoResult) => {
            if (!instituicaoResult.success || !instituicaoResult.data) {
              return of({
                success: false,
                status: 404,
                data: 'Instituição não encontrada.',
              });
            }

            const instituicao = instituicaoResult.data as any; // Tipagem da instituição
            const limiteFaltasInstitucional =
              instituicao.percentual_limite_faltas || 0.25;
            const faltasPermitidas =
              materia.cargaHorariaTotal * limiteFaltasInstitucional;

            // Atualiza o status baseado nas faltas
            if (materia.faltas >= faltasPermitidas) {
              materia.status = 'Reprovado';
            } else if (materia.faltas >= faltasPermitidas * 0.75) {
              materia.status = 'Risco';
            } else {
              materia.status = 'Aprovado';
            }

            // Salva a matéria atualizada
            return this.updateMateria(materia);
          })
        );
      }),
      catchError((error) =>
        of({
          success: false,
          status: 500,
          data: 'Erro ao atualizar status.',
        })
      )
    );
  }
}
