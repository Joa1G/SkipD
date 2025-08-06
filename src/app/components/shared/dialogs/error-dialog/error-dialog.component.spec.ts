import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDialogComponent } from './error-dialog.component';

describe('ErrorDialogComponent', () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit tryAgain when onTryAgain is called', () => {
    spyOn(component.tryAgain, 'emit');
    component.onTryAgain();
    expect(component.tryAgain.emit).toHaveBeenCalled();
  });

  it('should return correct error icon for different error codes', () => {
    component.errorCode = 500;
    expect(component.getErrorIcon()).toBe('dns');

    component.errorCode = 404;
    expect(component.getErrorIcon()).toBe('search_off');

    component.errorCode = 401;
    expect(component.getErrorIcon()).toBe('lock');

    component.errorCode = 400;
    expect(component.getErrorIcon()).toBe('error_outline');
  });

  it('should return correct error title for different error codes', () => {
    component.errorCode = 400;
    expect(component.getErrorTitle()).toBe('Dados Inválidos');

    component.errorCode = 401;
    expect(component.getErrorTitle()).toBe('Não Autorizado');

    component.errorCode = 404;
    expect(component.getErrorTitle()).toBe('Não Encontrado');

    component.errorCode = 500;
    expect(component.getErrorTitle()).toBe('Erro do Servidor');
  });
});
