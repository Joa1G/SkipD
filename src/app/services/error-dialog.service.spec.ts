import { TestBed } from '@angular/core/testing';

import { ErrorDialogService } from './error-dialog.service';

describe('ErrorDialogService', () => {
  let service: ErrorDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show error with config', () => {
    const config = {
      title: 'Test Error',
      message: 'Test message',
      errorCode: 400,
    };

    service.showError(config);

    service.errorDialog$.subscribe((error) => {
      expect(error).toEqual(config);
    });
  });

  it('should hide error', () => {
    service.hideError();

    service.errorDialog$.subscribe((error) => {
      expect(error).toBeNull();
    });
  });

  it('should handle network error', () => {
    const onRetry = jasmine.createSpy('onRetry');
    service.showNetworkError(onRetry);

    service.errorDialog$.subscribe((error) => {
      expect(error?.title).toBe('Erro de Conexão');
      expect(error?.showTryAgain).toBe(true);
      expect(error?.onRetry).toBe(onRetry);
    });
  });

  it('should handle HTTP errors correctly', () => {
    const mockError = { status: 404, message: 'Not found' };
    service.handleHttpError(mockError);

    service.errorDialog$.subscribe((error) => {
      expect(error?.title).toBe('Não Encontrado');
      expect(error?.errorCode).toBe(404);
    });
  });
});
