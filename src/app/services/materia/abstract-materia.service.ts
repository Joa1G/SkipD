import { Signal } from '@angular/core';
import { Materia } from '../../models/materia/materia.model';
import {
  MateriaCreateAPI,
  MateriaAPI,
} from '../../models/materia/materia-api.model';
import { Observable } from 'rxjs';
import { OperationResult } from '../../models/operation-result.model';

export abstract class AbstractMateriaService {
  abstract materias: Signal<Materia[]>;
  abstract getMateriaById(id: number): Observable<OperationResult>;
  abstract addMateria(materia: MateriaCreateAPI): Observable<OperationResult>;
  abstract updateMateria(materia: MateriaAPI): Observable<OperationResult>;
  abstract deleteMateria(id: number): Observable<OperationResult>;
  abstract getMateriasByInstituicaoId(
    idInstituicao: number
  ): Observable<OperationResult>;
  abstract addFalta(
    id: number,
    falta: { quantidade: number }
  ): Observable<OperationResult>;
  abstract updateStatus(id: number): Observable<OperationResult>;
  abstract refresh(): Promise<void>;
}
