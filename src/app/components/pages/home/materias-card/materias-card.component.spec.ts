import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriasCardComponents } from './materias-card.component';

describe('MateriasCardComponents', () => {
  let component: MateriasCardComponents;
  let fixture: ComponentFixture<MateriasCardComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriasCardComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(MateriasCardComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
