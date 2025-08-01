import { Injectable, computed, inject } from '@angular/core';
import { AbstractMateriaService } from '../materia/abstract-materia.service';
import { AbstractInstituicaoService } from '../instituicao/abstract-instituicao.service';
import { MockedAuthService } from '../auth/mocked-auth.service';
import { Materia } from '../../models/materia/materia.model';
import { DiaSemana } from '../../models/materia/materia.model';
import { AbstractInsightsService, InsightData } from './abstract-insights.service';

@Injectable({ providedIn: 'root' })
export class InsightsService extends AbstractInsightsService {
  private materiaService = inject(AbstractMateriaService);
  private instituicaoService = inject(AbstractInstituicaoService);
  private authService = inject(MockedAuthService);

  private materias = this.materiaService.materias;
  private instituicoes = this.instituicaoService.instituicoes;
  private currentUser = this.authService.currentUser;

  diasSemana = ['domingo','segunda','terca','quarta','quinta','sexta','sabado'];

  public override insights = computed<InsightData>(() => {
    const user = this.currentUser();
    if (!user) {
      return {
        materiasEmRisco: [],
        materiasReprovadas: [],
        horasPorDia: {},
        materiasPorDia: {},
        diaMaisCritico: '',
        diaMaisLeve: ''
      };
    }

    const materias = this.materias();
    const instituicoes = this.instituicoes();
    const minhasInstituicoes = instituicoes.filter(i => i.id_usuario === user.id);
    const materiasDoUsuario = materias.filter(m => minhasInstituicoes.some(i => i.id === m.idInstituicao));

    const horasPorDia: Record<string, number> = {};
    const materiasPorDia: Record<string, Materia[]> = {};

    const materiasEmRisco = materiasDoUsuario.filter(m => m.status === 'Risco');
    const materiasReprovadas = materiasDoUsuario.filter(m => m.status === 'Reprovado');

    for (const materia of materiasDoUsuario) {
      const inst = minhasInstituicoes.find(i => i.id === materia.idInstituicao);
      const limiteFaltas = inst ? inst.percentual_limite_faltas : 0;
      const maxFaltas = materia.cargaHorariaTotal * limiteFaltas;

      if (materia.faltas >= maxFaltas) {
        materia.status = 'Reprovado';
        materiasReprovadas.push(materia);
      } else if (materia.faltas >= maxFaltas * 0.8) {
        materia.status = 'Risco';
        materiasEmRisco.push(materia);
      } else {
        materia.status = 'Aprovado';
      }

      for (const dia of this.diasSemana as DiaSemana[]) {
        const horas = materia.aulasDaSemana[dia] || 0;
        if (horas > 0) {
            horasPorDia[dia] = (horasPorDia[dia] || 0) + horas;
            if (!materiasPorDia[dia]) materiasPorDia[dia] = [];
            materiasPorDia[dia].push(materia);
        }
      }
    }

    const diaMaisCritico = Object.entries(horasPorDia).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    const horasDosDiasComAula = Object.values(horasPorDia).filter(h => h > 0);
    let diaMaisLeve = '';
    if (horasDosDiasComAula.length > 0) {
        const minHoras = Math.min(...horasDosDiasComAula);
        diaMaisLeve = Object.entries(horasPorDia)
            .filter(([, horas]) => horas === minHoras)
            .map(([dia]) => dia.charAt(0).toUpperCase() + dia.slice(1))
            .join(', ');
    }

    return {
      materiasEmRisco,
      materiasReprovadas,
      horasPorDia,
      materiasPorDia,
      diaMaisCritico,
      diaMaisLeve
    };
  });
}
