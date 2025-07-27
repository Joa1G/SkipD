import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { instituicaoProvider } from '../services/instituicao/instituicao.provider.service';
import { materiaProvider } from '../services/materia/materia.provider.service';
import { routes } from '../routes/app.routes';
// import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { usuarioProvider } from '../services/usuario/usuario.provider.service';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // provideClientHydration(withEventReplay()), desnecessario para desenvolvimento
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    instituicaoProvider,
    materiaProvider,
    usuarioProvider
  ]
};
