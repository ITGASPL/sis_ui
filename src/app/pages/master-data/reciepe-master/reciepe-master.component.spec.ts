import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciepeMasterComponent } from './reciepe-master.component';

describe('ReciepeMasterComponent', () => {
  let component: ReciepeMasterComponent;
  let fixture: ComponentFixture<ReciepeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReciepeMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReciepeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
