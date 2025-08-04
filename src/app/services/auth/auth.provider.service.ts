import { Provider } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { MockedAuthService } from './mocked-auth.service';
import { AuthService } from './auth.service';

export const authProvider: Provider = {
  provide: AuthService,
  useClass: environment.useMockService ? MockedAuthService : AuthService,
};
