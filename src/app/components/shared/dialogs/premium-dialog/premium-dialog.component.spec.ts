import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumDialogComponent } from './premium-dialog.component';

describe('PremiumDialogComponent', () => {
  let component: PremiumDialogComponent;
  let fixture: ComponentFixture<PremiumDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiumDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
