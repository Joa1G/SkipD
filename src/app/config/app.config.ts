import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { instituicaoProvider } from '../components/services/instituicao/instituicao.provider.service';
import { materiaProvider } from '../components/services/materia/materia.provider.service';
import { routes } from '../routes/app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    instituicaoProvider,
    materiaProvider
  ]
};
