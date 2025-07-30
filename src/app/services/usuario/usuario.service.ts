import { Usuario } from "../../models/usuario/usuario.model";
import { AbstractUsuarioService } from "./abstract-usuario.service";
import { OperationResult } from "../../models/operation-result.model";
import { Injectable, signal, computed, Signal, WritableSignal } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class UsuarioService extends AbstractUsuarioService {
  private _usuarios: WritableSignal<Usuario[]> = signal<Usuario[]>([]);

  override usuarios: Signal<Usuario[]> = computed(() => this._usuarios());

  constructor (private http: HttpClient) {
    super();
  }

  override getUsuarios(): Observable<OperationResult> {
    return of();
  }

  override getUsuarioById(id: number): Observable<OperationResult> {
    return of();
  }

  override addUsuario(usuario: Omit<Usuario, 'id' | 'isPremium' | 'urlFoto'>): Observable<OperationResult> {
    return of();
  }

  override updateUsuario(usuario: Usuario): Observable<OperationResult> {
    return of();
  }

  override deleteUsuario(id: number): Observable<OperationResult> {
    return of();
  }

  override getInstituicoesByUsuarioId(id: number): Observable<OperationResult> {
    return of();
  }

  override login(email: string, senha: string): Observable<OperationResult> {
    return of();
  }

  override changePremiumState(id: number): Observable<OperationResult> {
    return of();
  }
  
  override getUrlFotoById(id: number): Observable<OperationResult> {
    return of();
  }
}
