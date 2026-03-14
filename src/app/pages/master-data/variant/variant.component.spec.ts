import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantComponent } from './variant.component';

describe('VariantComponent', () => {
  let component: VariantComponent;
  let fixture: ComponentFixture<VariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
