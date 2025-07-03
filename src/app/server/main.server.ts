import { bootstrapApplication } from '@angular/platform-browser';
import { App } from '../components/app.components';
import { config } from '../config/app.config.server';

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;
