import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponents } from './footer.component';

describe('FooterComponents', () => {
  let component: FooterComponents;
  let fixture: ComponentFixture<FooterComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
