import { Signal } from '@angular/core'
import { Materia } from '../../models/materia/materia.model';
import { Observable } from 'rxjs';
import { OperationResult } from '../../models/operation-result.model';

export abstract class AbstractMateriaService {
  abstract getMateriaById(id: number): Observable<OperationResult>;
  abstract addMateria(materia: Omit<Materia, 'id'>): Observable<OperationResult>;
  abstract updateMateria(materia: Materia): Observable<OperationResult>;
  abstract deleteMateria(id: number): Observable<OperationResult>;
  abstract getMateriasByInstituicaoId(idInstituicao: number): Observable<OperationResult>;
  abstract addFalta(id: number, falta: any): void;
  abstract updateStatus(id: number): Observable<OperationResult>;
}
