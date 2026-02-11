import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

// 1. Importe as funções necessárias
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  // O array 'providers' é onde você registra as funcionalidades globais
  providers: [
    provideRouter(routes),

    // 2. Adicione os providers aqui
    provideHttpClient(), // Habilita o HttpClient em toda a aplicação
    provideAnimations()  // Habilita as animações para o Angular Material
  ]
};
