import { Usuario } from '../../models/usuario/usuario.model';
import { UsuarioAPI } from '../../models/usuario/usuario-api.model';
import { AbstractUsuarioService } from './abstract-usuario.service';
import { OperationResult } from '../../models/operation-result.model';
import {
  Injectable,
  signal,
  computed,
  Signal,
  WritableSignal,
  inject,
} from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { ErrorDialogService } from '../error-dialog.service';

@Injectable()
export class UsuarioService extends AbstractUsuarioService {
  private _usuarios: WritableSignal<Usuario[]> = signal<Usuario[]>([]);
  private errorDialogService = inject(ErrorDialogService);

  override usuarios: Signal<Usuario[]> = computed(() => this._usuarios());

  constructor(private http: HttpClient) {
    super();
  }

  // Converte de UsuarioAPI (snake_case) para Usuario (camelCase)
  private convertFromAPI(usuarioAPI: UsuarioAPI): Usuario {
    return {
      id: usuarioAPI.id,
      nome: usuarioAPI.nome,
      email: usuarioAPI.email,
      senha: usuarioAPI.senha,
      isPremium: usuarioAPI.is_premium,
      urlFoto: usuarioAPI.url_foto || '',
    };
  }

  // Converte de Usuario (camelCase) para UsuarioAPI (snake_case)
  private convertToAPI(usuario: Usuario): UsuarioAPI {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
      is_premium: usuario.isPremium,
      url_foto: usuario.urlFoto || '',
    };
  }

  override getUsuarios(): Observable<OperationResult> {
    return this.http
      .get<UsuarioAPI[]>(`${environment.apiUrl}/user`, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          const usuariosAPI = response.body || [];
          const usuarios = usuariosAPI.map((usuarioAPI) =>
            this.convertFromAPI(usuarioAPI)
          );

          return {
            success: response.status >= 200 && response.status < 300,
            data: usuarios,
            status: response.status,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          // Exibir diálogo de erro específico para buscar usuários
          this.errorDialogService.handleHttpError(error, () =>
            this.getUsuarios().subscribe()
          );

          return of({
            success: false,
            data: error.message,
            status: error.status,
          });
        })
      );
  }

  override getUsuarioById(id: number): Observable<OperationResult> {
    return this.http
      .get<UsuarioAPI>(`${environment.apiUrl}/user/${id}`, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.body) {
            const usuario = this.convertFromAPI(response.body);
            return {
              success: response.status >= 200 && response.status < 300,
              data: usuario,
              status: response.status,
            };
          }
          return {
            success: false,
            data: null,
            status: response.status,
            message: 'Usuário não encontrado',
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

  override addUsuario(
    usuario: Omit<Usuario, 'id' | 'isPremium' | 'urlFoto'>
  ): Observable<OperationResult> {
    return this.http
      .post<UsuarioAPI>(`${environment.apiUrl}/user`, usuario, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.body) {
            const usuarioConvertido = this.convertFromAPI(response.body);
            return {
              success: response.status >= 200 && response.status < 300,
              data: usuarioConvertido,
              status: response.status,
            };
          }
          return {
            success: false,
            data: null,
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

  override updateUsuario(usuario: Usuario): Observable<OperationResult> {
    const { id, ...updateData } = usuario;
    const updateDataAPI = this.convertToAPI({ id, ...updateData } as Usuario);
    const { id: _, ...dataToSend } = updateDataAPI; // Remove id do payload

    return this.http
      .put<UsuarioAPI>(`${environment.apiUrl}/user/${id}`, dataToSend, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.body) {
            const usuarioConvertido = this.convertFromAPI(response.body);
            return {
              success: response.status >= 200 && response.status < 300,
              data: usuarioConvertido,
              status: response.status,
            };
          }
          return {
            success: false,
            data: null,
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

  override deleteUsuario(id: number): Observable<OperationResult> {
    return this.http
      .delete(`${environment.apiUrl}/user/${id}`, {
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

  override getInstituicoesByUsuarioId(id: number): Observable<OperationResult> {
    return this.http
      .get(`${environment.apiUrl}/instituition/all/${id}`, {
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

  override login(email: string, senha: string): Observable<OperationResult> {
    const formData = new FormData();
    formData.append('username', email); // API usa 'username' para email
    formData.append('password', senha);

    return this.http
      .post(`${environment.apiUrl}/token`, formData, {
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

  override changePremiumState(id: number): Observable<OperationResult> {
    return this.http
      .put<UsuarioAPI>(
        `${environment.apiUrl}/user/${id}/premium`,
        {},
        {
          observe: 'response',
        }
      )
      .pipe(
        map((response) => {
          if (response.body) {
            const usuarioConvertido = this.convertFromAPI(response.body);
            return {
              success: response.status >= 200 && response.status < 300,
              data: usuarioConvertido,
              status: response.status,
            };
          }
          return {
            success: false,
            data: null,
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

  override getUrlFotoById(id: number): Observable<OperationResult> {
    return this.getUsuarioById(id).pipe(
      map((result) => {
        if (result.success && result.data) {
          const usuario = result.data as Usuario;
          const urlFoto = usuario.urlFoto || '';
          return {
            success: true,
            status: 200,
            data: urlFoto.trim(),
            message:
              urlFoto.trim() === '' ? 'URL da foto está vazia' : undefined,
          };
        }
        return {
          success: false,
          status: result.status || 404,
          data: '',
          message: result.message || 'Usuário não encontrado',
        };
      })
    );
  }

  override updateUrlFoto(
    id: number,
    urlFoto: string
  ): Observable<OperationResult> {
    return this.http
      .put<UsuarioAPI>(
        `${environment.apiUrl}/user/${id}`,
        { url_foto: urlFoto },
        {
          observe: 'response',
        }
      )
      .pipe(
        map((response) => {
          if (response.body) {
            const usuario = this.convertFromAPI(response.body);
            return {
              success: response.status >= 200 && response.status < 300,
              data: usuario,
              status: response.status,
            };
          }
          return {
            success: false,
            data: null,
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

  override isEmailInUse(email: string): Observable<OperationResult> {
    return this.http
      .post<{ email_in_use: boolean }>(
        `${environment.apiUrl}/user/check-email`,
        { email },
        {
          observe: 'response',
        }
      )
      .pipe(
        map((response) => ({
          success: response.status >= 200 && response.status < 300,
          data: response.body?.email_in_use || false,
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

  // Método adicional para alterar senha
  changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Observable<OperationResult> {
    const passwordData = {
      old_senha: oldPassword,
      new_senha: newPassword,
    };

    return this.http
      .put(
        `${environment.apiUrl}/user/${userId}/change-password`,
        passwordData,
        {
          observe: 'response',
        }
      )
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
}
