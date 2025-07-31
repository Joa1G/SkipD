import { Injectable, computed, inject } from '@angular/core';
import { AbstractMateriaService } from '../materia/abstract-materia.service';
import { AbstractInstituicaoService } from '../instituicao/abstract-instituicao.service';
import { MockedAuthService } from '../auth/mocked-auth.service';
import { Materia } from '../../models/materia/materia.model';
import { DiaSemana } from '../../models/materia/materia.model';

export interface InsightData {
  materiasCriticas: Materia[];
  faltasPorDia: Record<string, number>;
  materiasPorDia: Record<string, string[]>;
  diaMaisCritico: string;
  diaMaisLeve: string;
}

@Injectable({ providedIn: 'root' })
export class InsightsService {
  private materiaService = inject(AbstractMateriaService);
  private instituicaoService = inject(AbstractInstituicaoService);
  private authService = inject(MockedAuthService);

  private materias = this.materiaService.materias;
  private instituicoes = this.instituicaoService.instituicoes;
  private currentUser = this.authService.currentUser;

  diasSemana = ['domingo','segunda','terca','quarta','quinta','sexta','sabado'];

  insights = computed<InsightData>(() => {
    const user = this.currentUser();
    if (!user) {
      return {
        materiasCriticas: [],
        faltasPorDia: {},
        materiasPorDia: {},
        diaMaisCritico: '',
        diaMaisLeve: ''
      };
    }

    const materias = this.materias();
    const instituicoes = this.instituicoes();

    const minhasInstituicoes = instituicoes.filter(i => i.id_usuario === user.id);
    const materiasDoUsuario = materias.filter(m => minhasInstituicoes.some(i => i.id === m.idInstituicao));

    const faltasPorDia: Record<string, number> = {};
    const materiasPorDia: Record<string, string[]> = {};
    const materiasCriticas: Materia[] = [];

    for (const materia of materiasDoUsuario) {
      const inst = minhasInstituicoes.find(i => i.id === materia.idInstituicao);
      const limiteFaltas = inst ? inst.percentual_limite_faltas : 0;
      const maxFaltas = materia.cargaHorariaTotal * limiteFaltas;

      if (materia.faltas >= maxFaltas * 0.8) {
        materiasCriticas.push(materia);
      }

      for (const dia of this.diasSemana as DiaSemana[]) {
        const horas = materia.aulasDaSemana[dia] || 0;
        if (horas > 0) {
            faltasPorDia[dia] = (faltasPorDia[dia] || 0) + horas;
            if (!materiasPorDia[dia]) materiasPorDia[dia] = [];
            materiasPorDia[dia].push(materia.nome);
        }
      }
    }

    const diaMaisCritico = Object.entries(faltasPorDia).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    const diaMaisLeve = Object.entries(faltasPorDia).sort((a, b) => a[1] - b[1])[0]?.[0] || '';

    return {
      materiasCriticas,
      faltasPorDia,
      materiasPorDia,
      diaMaisCritico,
      diaMaisLeve
    };
  });
}
