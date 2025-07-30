import { Observable } from 'rxjs';
import { OperationResult } from '../../models/operation-result.model';
import { Usuario } from '../../models/usuario/usuario.model';
import { Signal } from '@angular/core';

export abstract class AbstractUsuarioService {
  abstract usuarios:  Signal<Usuario[]>;
  abstract getUsuarios(): Observable<OperationResult>;
  abstract getUsuarioById(id: number): Observable<OperationResult>;
  abstract addUsuario(usuario: Omit<Usuario, 'id' | 'isPremium' | 'urlFoto'>): Observable<OperationResult>;
  abstract updateUsuario(usuario: Usuario): Observable<OperationResult>;
  abstract deleteUsuario(id: number): Observable<OperationResult>;
  abstract getInstituicoesByUsuarioId(id: number): Observable<OperationResult>;
  abstract login(email: string, senha: string): Observable<OperationResult>;
  abstract changePremiumState(id: number): Observable<OperationResult>;
  abstract getUrlFotoById(id: number): Observable<OperationResult>;
  abstract updateUrlFoto(id: number, urlFoto: string): Observable<OperationResult>;
}
