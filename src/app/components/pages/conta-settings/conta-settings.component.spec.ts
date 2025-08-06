import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaSettingsComponent } from './conta-settings.component';

describe('ContaSettingsComponent', () => {
  let component: ContaSettingsComponent;
  let fixture: ComponentFixture<ContaSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContaSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContaSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
