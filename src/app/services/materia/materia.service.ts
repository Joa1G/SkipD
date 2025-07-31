import { Materia } from '../../models/materia/materia.model';
import { AbstractMateriaService } from './abstract-materia.service';
import { OperationResult } from '../../models/operation-result.model';
import { Injectable, signal, computed, Signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MateriaService extends AbstractMateriaService {
  private _materias: WritableSignal<Materia[]> = signal<Materia[]>([]);

  materias: Signal<Materia[]> = computed(() => this._materias());

  constructor(private http: HttpClient) {
    super();
  }

  override getMaterias(): Observable<OperationResult> {
    return of();
  }

  override getMateriaById(id: number): Observable<OperationResult> {
    return of();
  }

  override addMateria(materia: Omit<Materia, 'id'>): Observable<OperationResult> {
    const novaMateria: Materia = { id: Date.now(), ...materia };
    this._materias.update(atuais => [...atuais, novaMateria]);
    return of();
  }

  override updateMateria(materia: Materia): Observable<OperationResult> {
    this._materias.update(atuais => atuais.map(m => m.id === materia.id ? materia : m));
    return of();
  }

  override deleteMateria(id: number): Observable<OperationResult> {
    this._materias.update(atuais => atuais.filter(m => m.id !== id));
    return of();
  }

  override getMateriasByInstituicaoId(idInstituicao: number): Observable<OperationResult> {
    return of();
  }

  override addFalta(idMateria: number, quantidade: number): Observable<OperationResult> {
    this._materias.update(atuais =>
      atuais.map(m =>
        m.id === idMateria ? { ...m, faltas: m.faltas + quantidade } : m
      )
    );
    return of();
  }

  override updateStatus(id: number): Observable<OperationResult> {
    return of();
  }

  override getDiasHorasComAula(id: number): Observable<OperationResult> {
    return of();
  }
}
