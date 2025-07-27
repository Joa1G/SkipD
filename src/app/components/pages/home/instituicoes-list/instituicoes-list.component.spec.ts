import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituicoesListComponents } from './instituicoes-list.component';

describe('InstituicoesListComponents', () => {
  let component: InstituicoesListComponents;
  let fixture: ComponentFixture<InstituicoesListComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituicoesListComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(InstituicoesListComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
