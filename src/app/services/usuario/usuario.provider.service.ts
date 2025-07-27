import { Provider } from "@angular/core";
import { environment } from "../../../../environments/environments";
import { MockedUsuarioService } from "./mocked-usuario.service";
import { UsuarioService } from "./usuario.service";
import { AbstractUsuarioService } from "./abstract-usuario.service";

export const usuarioProvider: Provider = {
  provide: AbstractUsuarioService,
  useClass: environment.useMockService ? MockedUsuarioService : UsuarioService
};
