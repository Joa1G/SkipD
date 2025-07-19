import { Provider } from "@angular/core";
import { environment } from "../../../../../environments/environments";
import { MockedInstituicaoService } from "./mocked-instituicao.service";
import { InstituicaoService } from "./instituicao.service";
import { AbstractInstituicaoService } from "./abstract-instituicao.service";

export const instituicaoProvider: Provider = {
  provide: AbstractInstituicaoService,
  useClass: environment.useMockService ? MockedInstituicaoService : InstituicaoService
};
