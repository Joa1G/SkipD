import { Observable } from 'rxjs';
import { OperationResult } from '../../models/operation-result.model';
import { Usuario } from '../../models/usuario/usuario.model';

export abstract class AbstractUsuarioService {
  abstract login(email: string, senha: string): Observable<OperationResult>;
  abstract cadastrar(usuario: Omit<Usuario, 'id'>): Observable<OperationResult>;
}
