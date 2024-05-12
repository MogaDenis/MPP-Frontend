import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDetailsDialogComponent } from './car-details-dialog.component';

describe('CarDetailsDialogComponent', () => {
  let component: CarDetailsDialogComponent;
  let fixture: ComponentFixture<CarDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
