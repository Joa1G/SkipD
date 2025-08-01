import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarInstituicoesComponent } from './gerenciar-instituicoes.component';

describe('GerenciarInstituicoesComponent', () => {
  let component: GerenciarInstituicoesComponent;
  let fixture: ComponentFixture<GerenciarInstituicoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarInstituicoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarInstituicoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
