import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMateriaComponents } from './add-materia.component';

describe('AddMateriaComponents', () => {
  let component: AddMateriaComponents;
  let fixture: ComponentFixture<AddMateriaComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMateriaComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(AddMateriaComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
