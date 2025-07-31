import { Signal } from "@angular/core";
import { Materia } from "../../models/materia/materia.model";

// A interface de dados que o serviço vai fornecer
export interface InsightData {
  materiasEmRisco: Materia[];
  materiasReprovadas: Materia[];
  horasPorDia: Record<string, number>;
  materiasPorDia: Record<string, Materia[]>;
  diaMaisCritico: string;
  diaMaisLeve: string;
}

// O "contrato" abstrato
export abstract class AbstractInsightsService {
  public abstract insights: Signal<InsightData>;
}
