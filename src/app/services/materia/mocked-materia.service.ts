import { Materia } from '../../models/materia/materia.model';
import {
  MateriaCreateAPI,
  MateriaAPI,
} from '../../models/materia/materia-api.model';
import { AbstractMateriaService } from './abstract-materia.service';
import { OperationResult } from '../../models/operation-result.model';
import {
  Injectable,
  signal,
  computed,
  Signal,
  WritableSignal,
  inject,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { AbstractInstituicaoService } from '../instituicao/abstract-instituicao.service';
import { mockedMateria } from './mocked-materia';

@Injectable()
export class MockedMateriaService extends AbstractMateriaService {
  private _materias: WritableSignal<Materia[]> =
    signal<Materia[]>(mockedMateria);

  private serviceInstituicoes = inject(AbstractInstituicaoService);
  private instituicoes = this.serviceInstituicoes.instituicoes;

  materias = computed(() =>
    this._materias().sort((a, b) => a.nome.localeCompare(b.nome))
  );

  override getMateriaById(id: number): Observable<OperationResult> {
    try {
      const materia = this.materias().find((m) => m.id === id);
      if (!materia) {
        return of({
          success: false,
          status: 404,
          data: 'Matéria não encontrada.',
        });
      }
      return of({ success: true, status: 200, data: materia });
    } catch (error) {
      return of({
        success: false,
        status: 500,
        data: 'Erro ao buscar matéria.',
      });
    }
  }

  override addMateria(
    materiaAPI: MateriaCreateAPI
  ): Observable<OperationResult> {
    try {
      // Converter do formato da API para o formato interno
      const materia: Omit<Materia, 'id'> = {
        nome: materiaAPI.nome,
        cargaHorariaTotal: materiaAPI.carga_horaria,
        faltas: materiaAPI.faltas,
        status: materiaAPI.status as 'Aprovado' | 'Risco' | 'Reprovado',
        aulasDaSemana: {
          domingo: materiaAPI.aulas_domingo,
          segunda: materiaAPI.aulas_segunda,
          terca: materiaAPI.aulas_terca,
          quarta: materiaAPI.aulas_quarta,
          quinta: materiaAPI.aulas_quinta,
          sexta: materiaAPI.aulas_sexta,
          sabado: materiaAPI.aulas_sabado,
        },
        idInstituicao: materiaAPI.instituicao_id,
      };

      const newId =
        this._materias().length > 0
          ? Math.max(...this._materias().map((m) => m.id)) + 1
          : 1;
      const newMateria: Materia = {
        id: newId,
        ...materia,
      };
      this._materias.update((materias) => [...materias, newMateria]);

      // Retornar no formato da API
      const materiaAPIResponse: MateriaAPI = {
        id: newId,
        nome: materiaAPI.nome,
        carga_horaria: materiaAPI.carga_horaria,
        faltas: materiaAPI.faltas,
        status: materiaAPI.status,
        aulas_domingo: materiaAPI.aulas_domingo,
        aulas_segunda: materiaAPI.aulas_segunda,
        aulas_terca: materiaAPI.aulas_terca,
        aulas_quarta: materiaAPI.aulas_quarta,
        aulas_quinta: materiaAPI.aulas_quinta,
        aulas_sexta: materiaAPI.aulas_sexta,
        aulas_sabado: materiaAPI.aulas_sabado,
        instituicao_id: materiaAPI.instituicao_id,
      };

      return of({ success: true, status: 201, data: materiaAPIResponse });
    } catch (error) {
      return of({
        success: false,
        status: 500,
        data: 'Erro ao adicionar matéria.',
      });
    }
  }

  override updateMateria(materiaAPI: MateriaAPI): Observable<OperationResult> {
    try {
      // Converter do formato da API para o formato interno
      const materia: Materia = {
        id: materiaAPI.id!,
        nome: materiaAPI.nome,
        cargaHorariaTotal: materiaAPI.carga_horaria,
        faltas: materiaAPI.faltas,
        status: materiaAPI.status as 'Aprovado' | 'Risco' | 'Reprovado',
        aulasDaSemana: {
          domingo: materiaAPI.aulas_domingo,
          segunda: materiaAPI.aulas_segunda,
          terca: materiaAPI.aulas_terca,
          quarta: materiaAPI.aulas_quarta,
          quinta: materiaAPI.aulas_quinta,
          sexta: materiaAPI.aulas_sexta,
          sabado: materiaAPI.aulas_sabado,
        },
        idInstituicao: materiaAPI.instituicao_id,
      };

      let updated = false;
      this._materias.update((list) =>
        list.map((m) => {
          if (m.id === materia.id) {
            updated = true;
            return materia;
          }
          return m;
        })
      );

      if (!updated) {
        return of({
          success: false,
          status: 404,
          data: 'Matéria não encontrada.',
        });
      }

      return of({ success: true, status: 200, data: materiaAPI });
    } catch (error) {
      return of({
        success: false,
        status: 500,
        data: 'Erro ao atualizar matéria.',
      });
    }
  }

  override deleteMateria(id: number): Observable<OperationResult> {
    try {
      const index = this._materias().findIndex((m) => m.id === id);
      if (index === -1) {
        return of({
          success: false,
          status: 404,
          data: 'Matéria não encontrada.',
        });
      }
      this._materias.update((materias) => {
        const updatedMaterias = [...materias];
        updatedMaterias.splice(index, 1);
        return updatedMaterias;
      });
      return of({
        success: true,
        status: 200,
        message: 'Matéria deletada com sucesso.',
      });
    } catch (error) {
      return of({
        success: false,
        status: 500,
        data: 'Erro ao deletar matéria.',
      });
    }
  }

  override getMateriasByInstituicaoId(
    idInstituicao: number
  ): Observable<OperationResult> {
    try {
      const materias = this._materias().filter(
        (m) => m.idInstituicao === idInstituicao
      );
      if (materias.length === 0) {
        return of({
          success: false,
          status: 404,
          data: 'Nenhuma materia encontrada.',
        });
      }
      return of({ success: true, status: 200, data: materias });
    } catch (error) {
      return of({
        success: false,
        status: 500,
        data: 'Erro ao buscar matérias por instituição.',
      });
    }
  }

  override addFalta(
    id: number,
    falta: { quantidade: number }
  ): Observable<OperationResult> {
    try {
      const materia = this._materias().find((m) => m.id === id);
      if (!materia) {
        return of({
          success: false,
          status: 404,
          data: 'Matéria não encontrada.',
        });
      }
      materia.faltas += falta.quantidade || 1;
      this.updateStatus(id);
      this._materias.update((materias) => {
        const updatedMaterias = [...materias];
        const index = updatedMaterias.findIndex((m) => m.id === id);
        updatedMaterias[index] = materia;
        return updatedMaterias;
      });
      return of({ success: true, status: 200, data: materia });
    } catch (error) {
      return of({
        success: false,
        status: 500,
        data: 'Erro ao adicionar falta.',
      });
    }
  }

  override updateStatus(id: number): Observable<OperationResult> {
    try {
      const materia = this._materias().find((m) => m.id === id);
      const limiteFaltasInsituicional =
        this.instituicoes().find((i) => i.id === materia!.idInstituicao)
          ?.percentual_limite_faltas || 0.25;
      const faltasPermitidas =
        materia!.cargaHorariaTotal * limiteFaltasInsituicional;
      if (!materia) {
        return of({
          success: false,
          status: 404,
          data: 'Matéria não encontrada.',
        });
      }
      if (materia.faltas >= faltasPermitidas) {
        materia.status = 'Reprovado';
      } else if (materia.faltas >= faltasPermitidas * 0.75) {
        materia.status = 'Risco';
      } else {
        materia.status = 'Aprovado';
      }
      return of({ success: true, status: 200, data: materia });
    } catch (error) {
      return of({
        success: false,
        status: 500,
        data: 'Erro ao atualizar status.',
      });
    }
  }

  override refresh(): Promise<void> {
    // Para o mock, não precisamos fazer nada, pois os dados já estão no signal
    console.log('Refresh chamado no MockedMateriaService');
    return Promise.resolve();
  }
}
