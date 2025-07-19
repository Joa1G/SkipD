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
    return of();
  }

  override updateMateria(materia: Materia): Observable<OperationResult> {
    return of();
  }

  override deleteMateria(id: number): Observable<OperationResult> {
    return of();
  }

  override getInstituicaoByMateriaId(id: number): Observable<OperationResult> {
    return of();
  }

  override addFalta(id: number, falta: any): Observable<OperationResult> {
    return of();
  }
}
