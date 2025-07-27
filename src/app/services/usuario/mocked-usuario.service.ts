import { Injectable, signal, computed, Signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AbstractUsuarioService } from './abstract-usuario.service';
import { Usuario } from '../../models/usuario/usuario.model';
import { OperationResult } from '../../models/operation-result.model';
import { AbstractInstituicaoService } from '../instituicao/abstract-instituicao.service';

@Injectable()
export class MockedUsuarioService extends AbstractUsuarioService {
  private _usuarios: WritableSignal<Usuario[]> = signal<Usuario[]>([
    {
      id: 1,
      nome: 'Thayná Beatriz',
      email: 'thayna.vidal@lgepartner.com',
      senha: '123456',
      urlFoto: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      isPremium: false
    },
    {
      id: 2,
      nome: 'João Gomes',
      email: 'joao.gomes@lgepartner.com',
      senha: 'senha123',
      urlFoto: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      isPremium: true
    }
  ]);

  usuarios: Signal<Usuario[]> = computed(() => this._usuarios());
  private _instituicaoService: AbstractInstituicaoService;

  constructor(instituicaoService: AbstractInstituicaoService) {
    super();
    this._instituicaoService = instituicaoService;
  }

  override getUsuarios(): Observable<OperationResult> {
    try {
      const usuarios = this._usuarios();
      return of({ success: true, status: 200, data: usuarios });
    } catch {
      return of({ success: false, status: 500, message: 'Erro ao buscar usuários.' });
    }
  }

  override getUsuarioById(id: number): Observable<OperationResult> {
    try {
      const usuario = this._usuarios().find(u => u.id === id);
      if (usuario) {
        return of({ success: true, status: 200, data: usuario });
      } else {
        return of({ success: false, status: 404, message: 'Usuário não encontrado.' });
      }
    } catch {
      return of({ success: false, status: 500, message: 'Erro ao buscar usuário.' });
    }
  }

  override addUsuario(usuario: Omit<Usuario, 'id' | 'isPremium' | 'urlFoto'>): Observable<OperationResult> {
    try {
      const newId = this._usuarios().length > 0 ? Math.max(...this._usuarios().map(u => u.id)) + 1 : 1;
      const newUsuario: Usuario = { id: newId, isPremium: false, urlFoto: '', ...usuario };
      this._usuarios.update(usuarios => [...usuarios, newUsuario]);
      return of({ success: true, status: 201, data: newUsuario });
    } catch {
      return of({ success: false, status: 500, message: 'Erro ao adicionar usuário.' });
    }
  }

  override updateUsuario(usuario: Usuario): Observable<OperationResult> {
    try {
      this._usuarios.update(usuarios => {
        const index = usuarios.findIndex(u => u.id === usuario.id);
        if (index !== -1) {
          usuarios[index] = usuario;
          return [...usuarios];
        } else {
          throw new Error('Usuário não encontrado.');
        }
      });
      return of({ success: true, status: 200, data: usuario });
    } catch (error) {
      return of({ success: false, status: 500, data: error });
    }
  }

  override deleteUsuario(id: number): Observable<OperationResult> {
    try {
      const index = this._usuarios().findIndex(u => u.id === id);
      if (index === -1) {
        return of({ success: false, status: 404, message: 'Usuário não encontrado.' });
      }
      this._usuarios.update(usuarios => {
        const updatedUsuarios = [...usuarios];
        updatedUsuarios.splice(index, 1);
        return updatedUsuarios;
      });
      return of({ success: true, status: 200, message: 'Usuário deletado com sucesso.' });
    } catch {
      return of({ success: false, status: 500, message: 'Erro ao deletar usuário.' });
    }
  }

  override getInstituicoesByUsuarioId(id: number): Observable<OperationResult> {
    try {
      return new Observable<OperationResult>(observer => {
        this._instituicaoService.getInstituicaoByUsuarioId(id).subscribe({
          next: instituicoes => {
            if (instituicoes.success && instituicoes.data) {
              observer.next({ success: true, status: 200, data: instituicoes.data });
            } else {
              observer.next({ success: false, status: 404, message: 'Instituições não encontradas.' });
            }
            observer.complete();
          },
          error: () => {
            observer.next({ success: false, status: 500, message: 'Erro ao buscar instituições.' });
            observer.complete();
          }
        });
      });
    } catch {
      return of({ success: false, status: 500, message: 'Erro ao buscar instituições.' });
    }
  }

  override login(email: string, senha: string): Observable<OperationResult> {
    try {
      const usuario = this._usuarios().find(u => u.email === email && u.senha === senha);
      if (usuario) {
        return of({ success: true, status: 200, data: usuario });
      } else {
        return of({ success: false, status: 401, message: 'E-mail ou senha incorretos.' });
      }
    } catch {
      return of({ success: false, status: 500, message: 'Erro ao realizar login.' });
    }
  }

  override changePremium(id: number): Observable<OperationResult> {
    try {
      this._usuarios.update(usuarios => {
        const usuario = usuarios.find(u => u.id === id);
        if (usuario) {
          usuario.isPremium = !usuario.isPremium;
          return [...usuarios];
        } else {
          throw new Error('Usuário não encontrado.');
        }
      });
      return of({ success: true, status: 200, message: 'Status de premium alterado com sucesso.' });
    } catch (error) {
      return of({ success: false, status: 500, data: error });
    }
  }

}
