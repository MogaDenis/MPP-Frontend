import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsListDialogComponent } from './cars-list-dialog.component';

describe('CarsListDialogComponent', () => {
  let component: CarsListDialogComponent;
  let fixture: ComponentFixture<CarsListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarsListDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarsListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
