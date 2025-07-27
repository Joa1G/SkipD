import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroComponents } from './cadastro.component';

describe('CadastroComponents', () => {
  let component: CadastroComponents;
  let fixture: ComponentFixture<CadastroComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
