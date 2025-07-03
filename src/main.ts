import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/config/app.config';
import { App } from './app/components/app.components';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
