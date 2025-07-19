import { Provider } from "@angular/core";
import { environment } from "../../../../../environments/environments";
import { MockedMateriaService } from "./mocked-materia.service";
import { MateriaService } from "./materia.service";
import { AbstractMateriaService } from "./abstract-materia.service";

export const materiaProvider: Provider = {
  provide: AbstractMateriaService,
  useClass: environment.useMockService ? MockedMateriaService : MateriaService
};
