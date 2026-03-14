import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreaksComponent } from './breaks.component';

describe('BreaksComponent', () => {
  let component: BreaksComponent;
  let fixture: ComponentFixture<BreaksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreaksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreaksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
