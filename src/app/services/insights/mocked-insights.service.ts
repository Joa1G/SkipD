import { Injectable, signal } from "@angular/core";
import { AbstractInsightsService, InsightData } from "./abstract-insights.service";
import { Materia } from "../../models/materia/materia.model";

@Injectable({ providedIn: 'root' })
export class MockedInsightsService extends AbstractInsightsService {
    // Sinal com dados fixos para teste
    public override insights = signal<InsightData>({
        materiasEmRisco: [{ id: 2, nome: 'Programação (Mocked)', status: 'Risco', faltas: 15, cargaHorariaTotal: 60, idInstituicao: 1, aulasDaSemana: {} } as Materia],
        materiasReprovadas: [{ id: 3, nome: 'Engenharia (Mocked)', status: 'Reprovado', faltas: 24, cargaHorariaTotal: 60, idInstituicao: 1, aulasDaSemana: {} } as Materia],
        horasPorDia: { terca: 2, quarta: 4 },
        materiasPorDia: {},
        diaMaisCritico: 'Quarta',
        diaMaisLeve: 'Terça'
    });
}
