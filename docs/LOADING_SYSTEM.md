# Sistema de Loading - SkipD

Este sistema de loading foi implementado para melhorar a experiência do usuário durante requisições HTTP que podem demorar.

## Componentes

### 1. LoadingComponent

Componente visual que exibe um spinner animado com mensagem personalizada.

### 2. LoadingService

Serviço que gerencia o estado global do loading, incluindo contagem de requisições ativas.

### 3. LoadingInterceptor

Interceptor HTTP que automaticamente mostra/esconde o loading durante requisições.

## Funcionalidades

### Uso Automático

O loading é exibido automaticamente para todas as requisições HTTP, com mensagens específicas baseadas no método:

- **GET**: "Carregando..."
- **POST**: "Salvando..."
- **PUT/PATCH**: "Atualizando..."
- **DELETE**: "Excluindo..."

### Uso Manual

Para casos específicos onde você precisa controlar o loading manualmente:

```typescript
import { LoadingService } from "../services/loading.service";

export class MeuComponent {
  private loadingService = inject(LoadingService);

  async minhaOperacao() {
    // Mostrar loading manualmente
    this.loadingService.show("Processando dados...");

    try {
      // Sua operação
      await algumProcessamento();
    } finally {
      // Esconder loading
      this.loadingService.hide();
    }
  }

  // Ou usando o método utilitário
  async operacaoComLoading() {
    const resultado = await this.loadingService.withLoading(() => algumProcessamento(), "Mensagem personalizada...");
  }
}
```

### Verificar Estado do Loading

```typescript
// No template
@if (loadingService.isLoading()) {
  <p>Carregando: {{ loadingService.loadingMessage() }}</p>
}

// No componente
if (this.loadingService.isLoading()) {
  // Loading está ativo
}
```

## Personalização

### Excluir URLs do Loading Automático

No arquivo `loading.interceptor.ts`, você pode adicionar URLs que não devem exibir loading:

```typescript
const excludedUrls: string[] = ["/api/frequent-endpoint", "/api/real-time-updates"];
```

### Customizar Estilos

O arquivo `loading.component.scss` contém todos os estilos do loading. Você pode:

- Alterar cores (atualmente usa `#6C63FF` para o spinner)
- Modificar o tamanho do spinner
- Ajustar a transparência do overlay
- Personalizar animações

### Forçar Esconder Loading

Em casos de erro ou necessidade específica:

```typescript
this.loadingService.forceHide();
```

## Design

O loading foi projetado para seguir o design system do SkipD:

- **Cor de fundo**: `#1A1A26` (mesmo do body) com transparência
- **Cor do spinner**: `#6C63FF` (roxo do tema)
- **Container**: `#2A2A38` com bordas arredondadas e sombra
- **Fonte**: `Segoe UI` (mesma do projeto)
- **Blur effect**: Aplicado ao fundo para melhor foco

## Responsividade

O componente é totalmente responsivo, ajustando automaticamente:

- Tamanho do spinner em telas menores
- Padding do container
- Tamanho da fonte
- Margens laterais em mobile
