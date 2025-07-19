import { Provider } from "@angular/core";
import { environment } from "../../../../../environments/environments";
import { MockedMateriaService } from "./mocked-materia.service";
import { MateriaService } from "./materia.service";

export const materiaProvider: Provider = {
  provide: 'MateriaService',
  useClass: environment.useMockService ? MockedMateriaService : MateriaService
};
