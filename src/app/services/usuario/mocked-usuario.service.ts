import {
  Injectable,
  signal,
  computed,
  Signal,
  WritableSignal,
} from '@angular/core';
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
      isPremium: false,
    },
    {
      id: 2,
      nome: 'João Gomes',
      email: 'joao.gomes@lgepartner.com',
      senha: 'senha123',
      urlFoto:
        'data:image/jpeg;base64,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',
      isPremium: false,
    },
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
      return of({
        success: false,
        status: 500,
        message: 'Erro ao buscar usuários.',
      });
    }
  }

  override getUsuarioById(id: number): Observable<OperationResult> {
    try {
      const usuario = this._usuarios().find((u) => u.id === id);
      if (usuario) {
        return of({ success: true, status: 200, data: usuario });
      } else {
        return of({
          success: false,
          status: 404,
          message: 'Usuário não encontrado.',
        });
      }
    } catch {
      return of({
        success: false,
        status: 500,
        message: 'Erro ao buscar usuário.',
      });
    }
  }

  override addUsuario(
    usuario: Omit<Usuario, 'id' | 'isPremium' | 'urlFoto'>
  ): Observable<OperationResult> {
    try {
      const newId =
        this._usuarios().length > 0
          ? Math.max(...this._usuarios().map((u) => u.id)) + 1
          : 1;
      const newUsuario: Usuario = {
        id: newId,
        isPremium: false,
        urlFoto: '',
        ...usuario,
      };
      this._usuarios.update((usuarios) => [...usuarios, newUsuario]);
      return of({ success: true, status: 201, data: newUsuario });
    } catch {
      return of({
        success: false,
        status: 500,
        message: 'Erro ao adicionar usuário.',
      });
    }
  }

  override updateUsuario(usuario: Usuario): Observable<OperationResult> {
    try {
      this._usuarios.update((usuarios) => {
        const index = usuarios.findIndex((u) => u.id === usuario.id);
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
      const index = this._usuarios().findIndex((u) => u.id === id);
      if (index === -1) {
        return of({
          success: false,
          status: 404,
          message: 'Usuário não encontrado.',
        });
      }
      this._usuarios.update((usuarios) => {
        const updatedUsuarios = [...usuarios];
        updatedUsuarios.splice(index, 1);
        return updatedUsuarios;
      });
      return of({
        success: true,
        status: 200,
        message: 'Usuário deletado com sucesso.',
      });
    } catch {
      return of({
        success: false,
        status: 500,
        message: 'Erro ao deletar usuário.',
      });
    }
  }

  override getInstituicoesByUsuarioId(id: number): Observable<OperationResult> {
    try {
      return new Observable<OperationResult>((observer) => {
        this._instituicaoService.getInstituicoesByUsuarioId(id).subscribe({
          next: (instituicoes) => {
            if (instituicoes.success && instituicoes.data) {
              observer.next({
                success: true,
                status: 200,
                data: instituicoes.data,
              });
            } else {
              observer.next({
                success: false,
                status: 404,
                message: 'Instituições não encontradas.',
              });
            }
            observer.complete();
          },
          error: () => {
            observer.next({
              success: false,
              status: 500,
              message: 'Erro ao buscar instituições.',
            });
            observer.complete();
          },
        });
      });
    } catch {
      return of({
        success: false,
        status: 500,
        message: 'Erro ao buscar instituições.',
      });
    }
  }

  override login(email: string, senha: string): Observable<OperationResult> {
    try {
      const usuario = this._usuarios().find(
        (u) => u.email === email && u.senha === senha
      );
      if (usuario) {
        return of({ success: true, status: 200, data: usuario });
      } else {
        return of({
          success: false,
          status: 401,
          message: 'E-mail ou senha incorretos.',
        });
      }
    } catch {
      return of({
        success: false,
        status: 500,
        message: 'Erro ao realizar login.',
      });
    }
  }

  override changePremiumState(id: number): Observable<OperationResult> {
    try {
      let usuarioAlterado: Usuario | undefined;
      this._usuarios.update((usuarios) => {
        const usuario = usuarios.find((u) => u.id === id);
        if (usuario) {
          usuario.isPremium = !usuario.isPremium;
          usuarioAlterado = { ...usuario };
          return [...usuarios];
        } else {
          throw new Error('Usuário não encontrado.');
        }
      });
      return of({
        success: true,
        status: 200,
        message: 'Status de premium alterado com sucesso.',
        data: usuarioAlterado,
      });
    } catch (error) {
      return of({ success: false, status: 500, data: error });
    }
  }

  override getUrlFotoById(id: number): Observable<OperationResult> {
    try {
      const usuario = this._usuarios().find((u) => u.id === id);
      if (usuario) {
        const urlFoto = usuario.urlFoto || '';
        return of({
          success: true,
          status: 200,
          data: urlFoto.trim(),
          message: urlFoto.trim() === '' ? 'URL da foto está vazia' : undefined,
        });
      } else {
        return of({
          success: false,
          status: 404,
          data: '',
          message: 'Usuário não encontrado.',
        });
      }
    } catch {
      return of({
        success: false,
        status: 500,
        message: 'Erro ao buscar URL da foto.',
      });
    }
  }

  override updateUrlFoto(
    id: number,
    urlFoto: string
  ): Observable<OperationResult> {
    try {
      this._usuarios.update((usuarios) => {
        const index = usuarios.findIndex((u) => u.id === id);
        if (index !== -1) {
          usuarios[index].urlFoto = urlFoto;
          return [...usuarios];
        } else {
          throw new Error('Usuário não encontrado.');
        }
      });
      return of({
        success: true,
        status: 200,
        message: 'URL da foto atualizada com sucesso.',
      });
    } catch (error) {
      return of({ success: false, status: 500, data: error });
    }
  }

  override isEmailInUse(email: string): Observable<OperationResult> {
    try {
      const isInUse = this._usuarios().some((u) => u.email === email);
      return of({
        success: true,
        status: 200,
        data: isInUse,
        message: isInUse ? 'E-mail já está em uso.' : 'E-mail disponível.',
      });
    } catch {
      return of({
        success: false,
        status: 500,
        message: 'Erro ao verificar e-mail.',
      });
    }
  }
}
