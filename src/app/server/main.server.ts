import { bootstrapApplication } from '@angular/platform-browser';
import { App } from '../components/app.component';
import { config } from '../config/app.config.server';

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;
