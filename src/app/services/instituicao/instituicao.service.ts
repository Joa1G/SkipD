import { Instituicao } from '../../models/instituicao/instituicao.model';
import { AbstractInstituicaoService } from './abstract-instituicao.service';
import { OperationResult } from '../../models/operation-result.model';
import {
  Injectable,
  signal,
  computed,
  Signal,
  WritableSignal,
} from '@angular/core';
import { map, Observable, of, catchError, firstValueFrom } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environments/environments';

@Injectable()
export class InstituicaoService extends AbstractInstituicaoService {
  private _instituicoes: WritableSignal<Instituicao[]> = signal<Instituicao[]>(
    []
  );
  instituicoes: Signal<Instituicao[]> = computed(() => this._instituicoes());

  constructor(private http: HttpClient, private authService: AuthService) {
    super();
    console.log('InstituicaoService constructor - iniciando');
    // Aguardar o usuário estar carregado antes de chamar refresh
    setTimeout(() => {
      if (this.authService.getCurrentUser()) {
        console.log('Chamando refresh no constructor');
        this.refresh();
      } else {
        console.log('Usuário não carregado ainda no constructor');
      }
    }, 100);
  }

  override refresh(): Promise<void> {
    const userId = this.authService.getUserId();
    console.log('Refresh instituições - userId:', userId);

    if (!userId) {
      console.error('Refresh instituições - usuário não logado');
      return Promise.resolve();
    }

    return firstValueFrom(this.getInstituicoesByUsuarioId(userId))
      .then((result: OperationResult) => {
        console.log('Resultado refresh instituições:', result);
        if (result.success) {
          console.log('Instituições carregadas:', result.data);
          this._instituicoes.set(result.data as Instituicao[]);
        } else {
          console.error('Erro ao carregar instituições:', result);
        }
      })
      .catch((error: any) => {
        console.error('Erro ao carregar instituições:', error);
      });
  }

  override getInstituicaoById(id: number): Observable<OperationResult> {
    return this.http
      .get(`${environment.apiUrl}/instituition/${id}`, { observe: 'response' })
      .pipe(
        map((response) => {
          console.log('Resposta getInstituicaoById:', response);

          // Mapear os dados da API para o modelo frontend
          let mappedData = response.body;
          if (mappedData && typeof mappedData === 'object') {
            mappedData = {
              ...mappedData,
              percentual_limite_faltas: (mappedData as any).limite_faltas,
              id_usuario: (mappedData as any).usuario_id,
            };
          }

          return {
            success: response.status >= 200 && response.status < 300,
            data: mappedData,
            status: response.status,
          };
        }),
        catchError((error: HttpErrorResponse) =>
          of({
            success: false,
            data: error.message,
            status: error.status,
          })
        )
      );
  }

  override addInstituicao(
    instituicao: Omit<Instituicao, 'id'>
  ): Observable<OperationResult> {
    // Usar o id_usuario fornecido na instituição ou o usuário logado
    const userId = instituicao.id_usuario || this.authService.getUserId();

    if (!userId) {
      console.error(
        'Usuário não identificado - não é possível adicionar instituição'
      );
      return of({
        success: false,
        status: 401,
        data: null,
        message: 'Usuário não identificado',
      });
    }

    // Mapear os campos para o formato esperado pela API
    const dataToSend = {
      nome: instituicao.nome,
      limite_faltas: instituicao.percentual_limite_faltas, // API espera 'limite_faltas'
    };

    console.log('Enviando requisição para API:', {
      url: `${environment.apiUrl}/instituition/${userId}`,
      data: dataToSend,
    });

    return this.http
      .post(`${environment.apiUrl}/instituition/${userId}`, dataToSend, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          console.log('Resposta da API (sucesso):', response);

          // Mapear os dados da resposta para o modelo frontend
          let mappedData = response.body;
          if (mappedData && typeof mappedData === 'object') {
            mappedData = {
              ...mappedData,
              percentual_limite_faltas: (mappedData as any).limite_faltas,
              id_usuario: (mappedData as any).usuario_id,
            };
          }

          return {
            success: response.status >= 200 && response.status < 300,
            data: mappedData,
            status: response.status,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Erro da API:', {
            status: error.status,
            message: error.message,
            error: error.error,
            url: error.url,
          });
          return of({
            success: false,
            data: error.error,
            message: error.error?.message || error.message,
            status: error.status,
          });
        })
      );
  }

  override updateInstituicao(
    instituicao: Instituicao
  ): Observable<OperationResult> {
    // Mapear os dados para o formato esperado pela API
    const dataToSend = {
      nome: instituicao.nome,
      limite_faltas: instituicao.percentual_limite_faltas,
    };

    return this.http
      .put(`${environment.apiUrl}/instituition/${instituicao.id}`, dataToSend, {
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

  override deleteInstituicao(id: number): Observable<OperationResult> {
    return this.http
      .delete(`${environment.apiUrl}/instituition/${id}`, {
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
  override getInstituicoesByUsuarioId(
    userId: number
  ): Observable<OperationResult> {
    console.log('Buscando instituições para userId:', userId);
    return this.http
      .get(`${environment.apiUrl}/instituition/all/${userId}`, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          console.log('Resposta getInstituicoesByUsuarioId:', response);

          // Mapear os dados da API para o modelo frontend
          let mappedData = response.body;
          if (Array.isArray(mappedData)) {
            mappedData = mappedData.map((instituicao: any) => ({
              ...instituicao,
              percentual_limite_faltas: instituicao.limite_faltas, // Mapear para o nome esperado no frontend
              id_usuario: instituicao.usuario_id, // Mapear também este campo
            }));
          }

          return {
            success: response.status >= 200 && response.status < 300,
            data: mappedData,
            status: response.status,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Erro getInstituicoesByUsuarioId:', error);
          return of({
            success: false,
            data: error.error,
            message: error.error?.message || error.message,
            status: error.status,
          });
        })
      );
  }
}
