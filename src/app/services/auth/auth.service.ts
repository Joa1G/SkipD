import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { environment } from "../../../../environments/environments";
import { Usuario } from "../../models/usuario/usuario.model";
import { UsuarioLogin } from "../../models/usuario/usuario.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  login(credentials: UsuarioLogin): Observable<any> {
    const formData = new FormData();
    formData.append("email", credentials.email);
    formData.append("password", credentials.senha);
    return this.http.post(`${environment.apiUrl}/token`, formData);
  }

  logout(): void {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: Usuario): void {
    localStorage.setItem("currentUser", JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

}
