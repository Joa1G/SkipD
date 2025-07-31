import { Injectable, signal, computed, inject, PLATFORM_ID } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { Usuario } from "../../models/usuario/usuario.model";
import { OperationResult } from "../../models/operation-result.model";
import { AbstractUsuarioService } from "../usuario/abstract-usuario.service";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class MockedAuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private usuarioService = inject(AbstractUsuarioService);
  private platformId = inject(PLATFORM_ID);

  currentUser$ = this.currentUserSubject.asObservable();
  token$ = this.tokenSubject.asObservable();

  private _isAuthenticated = signal<boolean>(false);
  private _currentUser = signal<Usuario | null>(null);

  isAuthenticated = computed(() => this._isAuthenticated());
  currentUser = computed(() => this._currentUser());

  constructor(){
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('currentUser');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (this.isTokenValid(token)){
          this.setAuthData(user, token);
        } else {
          this.logout();
        }
      } catch {
        this.logout();
      }
    }
  }

  login(email: string, senha: string): Observable<OperationResult>{
    return this.usuarioService.login(email, senha).pipe(
      map(result => {
        if (result.success && result.data) {
          const user = result.data as Usuario;
          const mockToken = this.generateMockJWT(user);
          this.setAuthData(user, mockToken);
          return {success: true, status: 200, data: {user, token: mockToken}};
        } else {
          return result;
        }
      })
    )
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.removeStorageItem('authToken');
      this.removeStorageItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
  }

  private generateMockJWT(user: Usuario): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.nome,
      isPremium: user.isPremium,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30) // 30 seconds for mock purposes
    }));
    const signature = btoa('mockSignature');

    return `${header}.${payload}.${signature}`;
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  private setAuthData(user: Usuario, token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setStorageItem('authToken', token);
      this.setStorageItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
    this.tokenSubject.next(token);
    this._isAuthenticated.set(true);
    this._currentUser.set(user);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return this.getStorageItem('authToken');
    }
    return null;
  }

  private setStorageItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  private getStorageItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private removeStorageItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  updateCurrentUser(user: Usuario): void {
      // Atualiza o signal
    this._currentUser.set(user);

    // Também atualiza o BehaviorSubject para manter consistência
    this.currentUserSubject.next(user);

    // Atualiza o localStorage se estiver no browser
    if (isPlatformBrowser(this.platformId)) {
      this.setStorageItem('currentUser', JSON.stringify(user));
    }
  }

  refreshToken(): Observable<OperationResult> {
    return of({ success: false, status: 501, message: 'Método não implementado' });
  }

  verifyPassword(password: string): Observable<boolean> {
    const currentUser = this._currentUser();
    // Supondo que a senha do usuário está armazenada em currentUser.senha
    if (!currentUser || !currentUser.senha) {
      return of(false);
    }
    // Comparação simples (em produção, nunca armazene senha em texto puro!)
    return of(currentUser.senha === password);
  }

}
