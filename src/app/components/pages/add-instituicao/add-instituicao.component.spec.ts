import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInstituicaoComponent } from './add-instituicao.component';

describe('AddInstituicaoComponent', () => {
  let component: AddInstituicaoComponent;
  let fixture: ComponentFixture<AddInstituicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInstituicaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInstituicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
