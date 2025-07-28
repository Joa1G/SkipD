import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client
  },
  {
    path: 'detalhes-materia/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'edit-materia/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '',
    renderMode: RenderMode.Prerender
  }

];
