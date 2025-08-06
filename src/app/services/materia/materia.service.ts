import { Materia } from '../../models/materia/materia.model';
import {
  MateriaCreateAPI,
  MateriaAPI,
} from '../../models/materia/materia-api.model';
import { AbstractMateriaService } from './abstract-materia.service';
import { OperationResult } from '../../models/operation-result.model';
import {
  Injectable,
  signal,
  computed,
  Signal,
  WritableSignal,
  inject,
} from '@angular/core';
import {
  catchError,
  map,
  Observable,
  of,
  switchMap,
  firstValueFrom,
} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { AbstractInstituicaoService } from '../instituicao/abstract-instituicao.service';
import { ErrorDialogService } from '../error-dialog.service';

@Injectable()
export class MateriaService extends AbstractMateriaService {
  private errorDialogService = inject(ErrorDialogService);

  constructor(
    private http: HttpClient,
    private serviceInstituicoes: AbstractInstituicaoService
  ) {
    super();
  }

  private _materias: WritableSignal<Materia[]> = signal<Materia[]>([]);
  materias: Signal<Materia[]> = computed(() => this._materias());

  // Função para converter de MateriaAPI para Materia (formato interno)
  private convertFromAPI(materiaAPI: MateriaAPI): Materia {
    return {
      id: materiaAPI.id!,
      nome: materiaAPI.nome,
      cargaHorariaTotal: materiaAPI.carga_horaria,
      faltas: materiaAPI.faltas,
      status: materiaAPI.status as 'Aprovado' | 'Risco' | 'Reprovado',
      aulasDaSemana: {
        domingo: materiaAPI.aulas_domingo,
        segunda: materiaAPI.aulas_segunda,
        terca: materiaAPI.aulas_terca,
        quarta: materiaAPI.aulas_quarta,
        quinta: materiaAPI.aulas_quinta,
        sexta: materiaAPI.aulas_sexta,
        sabado: materiaAPI.aulas_sabado,
      },
      idInstituicao: materiaAPI.instituicao_id,
    };
  }

  // Função para converter de Materia (formato interno) para MateriaAPI
  private convertToAPI(materia: Materia): MateriaAPI {
    return {
      id: materia.id,
      nome: materia.nome,
      carga_horaria: materia.cargaHorariaTotal,
      faltas: materia.faltas,
      status: materia.status,
      aulas_domingo: materia.aulasDaSemana.domingo,
      aulas_segunda: materia.aulasDaSemana.segunda,
      aulas_terca: materia.aulasDaSemana.terca,
      aulas_quarta: materia.aulasDaSemana.quarta,
      aulas_quinta: materia.aulasDaSemana.quinta,
      aulas_sexta: materia.aulasDaSemana.sexta,
      aulas_sabado: materia.aulasDaSemana.sabado,
      instituicao_id: materia.idInstituicao,
    };
  }

  override getMateriaById(id: number): Observable<OperationResult> {
    return this.http
      .get(`${environment.apiUrl}/subject/${id}`, { observe: 'response' })
      .pipe(
        map((response) => {
          if (
            response.status >= 200 &&
            response.status < 300 &&
            response.body
          ) {
            // Converter de MateriaAPI para Materia (formato interno)
            const materiaAPI = response.body as MateriaAPI;
            const materia = this.convertFromAPI(materiaAPI);
            return {
              success: true,
              data: materia,
              status: response.status,
            };
          }
          return {
            success: false,
            data: response.body,
            status: response.status,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          // Exibir diálogo de erro específico para busca de matéria por ID
          this.errorDialogService.handleHttpError(error, () =>
            this.getMateriaById(id).subscribe()
          );

          return of({
            success: false,
            data: error.message,
            status: error.status,
          });
        })
      );
  }

  override addMateria(materia: MateriaCreateAPI): Observable<OperationResult> {
    // Extrair o instituicao_id do corpo da requisição para usar na URL
    const instituicaoId = materia.instituicao_id;

    // Criar o objeto sem o instituicao_id para enviar no corpo
    const { instituicao_id, ...materiaBody } = materia;

    return this.http
      .post(`${environment.apiUrl}/subject/${instituicaoId}`, materiaBody, {
        observe: 'response',
      })
      .pipe(
        map((response) => ({
          success: response.status >= 200 && response.status < 300,
          data: response.body,
          status: response.status,
        })),
        catchError((error: HttpErrorResponse) => {
          // Exibir diálogo de erro específico para adicionar matéria
          this.errorDialogService.handleHttpError(error, () =>
            this.addMateria(materia).subscribe()
          );

          return of({
            success: false,
            data: error.message,
            status: error.status,
          });
        })
      );
  }

  override updateMateria(materia: MateriaAPI): Observable<OperationResult> {
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
        catchError((error: HttpErrorResponse) => {
          // Exibir diálogo de erro específico para atualizar matéria
          this.errorDialogService.handleHttpError(error, () =>
            this.updateMateria(materia).subscribe()
          );

          return of({
            success: false,
            data: error.message,
            status: error.status,
          });
        })
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
        catchError((error: HttpErrorResponse) => {
          // Exibir diálogo de erro específico para deletar matéria
          this.errorDialogService.handleHttpError(error, () =>
            this.deleteMateria(id).subscribe()
          );

          return of({
            success: false,
            data: error.message,
            status: error.status,
          });
        })
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
        map((response) => {
          if (
            response.status >= 200 &&
            response.status < 300 &&
            response.body
          ) {
            // Converter array de MateriaAPI para array de Materia (formato interno)
            const materiasAPI = response.body as MateriaAPI[];
            const materias = materiasAPI.map((materiaAPI) =>
              this.convertFromAPI(materiaAPI)
            );
            return {
              success: true,
              data: materias,
              status: response.status,
            };
          }
          return {
            success: false,
            data: response.body,
            status: response.status,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          // Exibir diálogo de erro específico para buscar matérias por instituição
          this.errorDialogService.handleHttpError(error, () =>
            this.getMateriasByInstituicaoId(idInstituicao).subscribe()
          );

          return of({
            success: false,
            data: error.message,
            status: error.status,
          });
        })
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

          // Converte para o formato da API antes de enviar
          const materiaAPI = this.convertToAPI(materia);
          return this.updateMateria(materiaAPI);
        } else {
          return of({
            success: false,
            data: 'Matéria não encontrada',
            status: 404,
          });
        }
      }),
      switchMap((updateResult) => {
        if (updateResult.success) {
          // Após atualizar as faltas com sucesso, atualiza o status
          return this.updateStatus(id);
        } else {
          return of(updateResult);
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
        return this.serviceInstituicoes
          .getInstituicaoById(materia.idInstituicao)
          .pipe(
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

              // Converte para o formato da API antes de salvar
              const materiaAPI = this.convertToAPI(materia);
              return this.updateMateria(materiaAPI);
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

  override refresh(): Promise<void> {
    // Carrega todas as matérias de todas as instituições do usuário
    const instituicoes = this.serviceInstituicoes.instituicoes();

    // Se não há instituições carregadas ainda, não tenta carregar matérias
    if (instituicoes.length === 0) {
      console.log(
        'Nenhuma instituição carregada ainda, pulando refresh das matérias'
      );
      return Promise.resolve();
    }

    const materiaPromises = instituicoes.map((instituicao) =>
      firstValueFrom(this.getMateriasByInstituicaoId(instituicao.id))
    );

    return Promise.all(materiaPromises)
      .then((results) => {
        const todasMaterias: Materia[] = [];
        results.forEach((result: OperationResult) => {
          if (result?.success && result.data) {
            todasMaterias.push(...result.data);
          }
        });
        this._materias.set(todasMaterias);
        console.log(
          `Carregadas ${todasMaterias.length} matérias de ${instituicoes.length} instituições`
        );
      })
      .catch((error) => {
        console.error('Erro ao carregar matérias:', error);
      });
  }
}
