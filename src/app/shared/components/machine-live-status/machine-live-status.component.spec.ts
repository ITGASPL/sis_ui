import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineLiveStatusComponent } from './machine-live-status.component';

describe('MachineLiveStatusComponent', () => {
  let component: MachineLiveStatusComponent;
  let fixture: ComponentFixture<MachineLiveStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineLiveStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MachineLiveStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
