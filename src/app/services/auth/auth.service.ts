import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { Usuario } from '../../models/usuario/usuario.model';
import { UsuarioLogin } from '../../models/usuario/usuario.model';
import { OperationResult } from '../../models/operation-result.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();
  private _currentUser = signal<Usuario | null>(null);
  currentUser = computed(() => this._currentUser());

  constructor() {
    // Carregar dados do localStorage ao inicializar
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      const savedToken = localStorage.getItem('token');

      if (savedUser && savedToken) {
        const user = JSON.parse(savedUser);

        // Mapear campos da API se necessário
        if (user.is_premium !== undefined) {
          user.isPremium = user.is_premium;
        }

        this._currentUser.set(user);
        this.currentUserSubject.next(user);
        this.tokenSubject.next(savedToken);
      }
    }
  }

  login(credentials: UsuarioLogin): Observable<OperationResult> {
    const formData = new FormData();
    formData.append('username', credentials.email); // API usa 'username' para email
    formData.append('password', credentials.senha);

    return this.http.post<any>(`${environment.apiUrl}/token`, formData).pipe(
      map((response) => {
        if (response.access_token && response.usuario) {
          // Mapear campos da API se necessário
          if (response.usuario.is_premium !== undefined) {
            response.usuario.isPremium = response.usuario.is_premium;
          }

          // Salvar token e usuário
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));

          this._currentUser.set(response.usuario);
          this.currentUserSubject.next(response.usuario);
          this.tokenSubject.next(response.access_token);

          return {
            success: true,
            status: 200,
            data: response,
          };
        }
        return {
          success: false,
          status: 401,
          message: 'Credenciais inválidas',
        };
      }),
      catchError((error: HttpErrorResponse) =>
        of({
          success: false,
          status: error.status || 500,
          message: error.error?.detail || 'Erro ao fazer login',
        })
      )
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  getCurrentUser(): Usuario | null {
    return this._currentUser();
  }

  setCurrentUser(user: Usuario): void {
    // Mapear campos da API se necessário
    if (user && (user as any).is_premium !== undefined) {
      (user as any).isPremium = (user as any).is_premium;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    this._currentUser.set(user);
    this.currentUserSubject.next(user);
  }

  updateCurrentUser(user: Usuario): void {
    console.log(
      'AuthService - Updating current user:',
      JSON.stringify(user, null, 2)
    );

    // Mapear campos da API se necessário
    if (user && (user as any).is_premium !== undefined) {
      (user as any).isPremium = (user as any).is_premium;
      console.log(
        'AuthService - Mapped is_premium to isPremium:',
        (user as any).isPremium
      );
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
      console.log(
        'AuthService - User saved to localStorage:',
        JSON.stringify(user, null, 2)
      );
    }

    this._currentUser.set(user);
    this.currentUserSubject.next(user);

    // Verificar imediatamente após a atualização
    console.log(
      'AuthService - Signal value after update:',
      JSON.stringify(this._currentUser(), null, 2)
    );
  }

  getUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  getToken(): string | null {
    return this.tokenSubject.value || localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.getToken() !== null;
  }

  // Método para verificar senha (usado no oldPasswordMatchValidator)
  verifyPassword(password: string): Observable<boolean> {
    return this.http
      .post<{ is_valid: boolean }>(
        `${environment.apiUrl}/user/verify-password`,
        { password }
      )
      .pipe(
        map((response) => response.is_valid),
        catchError(() => of(false))
      );
  }

  refreshUserData(): Observable<OperationResult> {
    const userId = this.getUserId();
    if (!userId) {
      return of({
        success: false,
        status: 401,
        message: 'Usuário não autenticado',
      });
    }

    return this.http.get<Usuario>(`${environment.apiUrl}/user/${userId}`).pipe(
      map((updatedUser) => {
        // Atualizar localStorage e signals
        this.setCurrentUser(updatedUser);

        return {
          success: true,
          status: 200,
          data: updatedUser,
        };
      }),
      catchError((error: HttpErrorResponse) =>
        of({
          success: false,
          status: error.status || 500,
          message: error.error?.detail || 'Erro ao atualizar dados do usuário',
        })
      )
    );
  }
}
