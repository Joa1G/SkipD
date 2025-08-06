import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaltaSelectorDialogComponent } from './falta-selector-dialog.component';

describe('FaltaSelectorDialogComponent', () => {
  let component: FaltaSelectorDialogComponent;
  let fixture: ComponentFixture<FaltaSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaltaSelectorDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FaltaSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
