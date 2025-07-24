// src/services/usuario/mocked-usuario.service.ts
import { Injectable, signal, computed, Signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AbstractUsuarioService } from './abstract-usuario.service';
import { Usuario } from '../../models/usuario/usuario.model';
import { OperationResult } from '../../models/operation-result.model';

@Injectable()
export class MockedUsuarioService extends AbstractUsuarioService {
  private _usuarios: WritableSignal<Usuario[]> = signal<Usuario[]>([
    {
      id: 1,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      senha: '123456'
    },
    {
      id: 2,
      nome: 'João Souza',
      email: 'joao@email.com',
      senha: 'senha123'
    }
  ]);

  usuarios: Signal<Usuario[]> = computed(() => this._usuarios());

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

  override cadastrar(usuario: Omit<Usuario, 'id'>): Observable<OperationResult> {
    try {
      const existe = this._usuarios().some(u => u.email === usuario.email);
      if (existe) {
        return of({ success: false, status: 400, message: 'E-mail já cadastrado.' });
      }

      const novoId = Math.max(...this._usuarios().map(u => u.id)) + 1;
      const novoUsuario: Usuario = { id: novoId, ...usuario };
      this._usuarios.set([...this._usuarios(), novoUsuario]);

      return of({ success: true, status: 201, data: novoUsuario });
    } catch {
      return of({ success: false, status: 500, message: 'Erro ao cadastrar usuário.' });
    }
  }
}
