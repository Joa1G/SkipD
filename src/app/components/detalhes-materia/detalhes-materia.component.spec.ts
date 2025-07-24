import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesMateriaComponent } from './detalhes-materia.component';

describe('DetalhesMateriaComponent', () => {
  let component: DetalhesMateriaComponent;
  let fixture: ComponentFixture<DetalhesMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesMateriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
