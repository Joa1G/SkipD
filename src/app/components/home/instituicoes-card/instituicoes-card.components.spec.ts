import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituicoesCardComponents } from './instituicoes-card.components';

describe('InstituicoesCardComponents', () => {
  let component: InstituicoesCardComponents;
  let fixture: ComponentFixture<InstituicoesCardComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituicoesCardComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstituicoesCardComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
