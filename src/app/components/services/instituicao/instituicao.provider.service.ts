import { Provider } from "@angular/core";
import { environment } from "../../../../../environments/environments";
import { MockedInstituicaoService } from "./mocked-instituicao.service";
import { InstituicaoService } from "./instituicao.service";

export const instituicaoProvider: Provider = {
  provide: 'InstituicaoService',
  useClass: environment.useMockService ? MockedInstituicaoService : InstituicaoService
};
