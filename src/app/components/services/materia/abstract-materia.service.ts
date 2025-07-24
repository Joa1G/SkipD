import { Signal } from '@angular/core'
import { Materia } from '../../models/materia/materia.model';
import { Observable } from 'rxjs';
import { OperationResult } from '../../models/operation-result.model';

export abstract class AbstractMateriaService {
  abstract materias: Signal<Materia[]>;
  abstract getMaterias(): Observable<OperationResult>;
  abstract getMateriaById(id: number): Observable<OperationResult>;
  abstract addMateria(materia: Omit<Materia, 'id'>): Observable<OperationResult>;
  abstract updateMateria(materia: Materia): Observable<OperationResult>;
  abstract deleteMateria(id: number): Observable<OperationResult>;
  abstract getInstituicaoByMateriaId(id: number): Observable<OperationResult>;
  abstract addFalta(id: number, falta: any): Observable<OperationResult>;
  abstract updateStatus(id: number): Observable<OperationResult>;
  abstract getDiasHorasComAula(id: number): Observable<OperationResult>;
}
