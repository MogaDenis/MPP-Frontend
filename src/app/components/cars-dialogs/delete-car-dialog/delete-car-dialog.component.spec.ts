import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCarDialogComponent } from './delete-car-dialog.component';

describe('DeleteCarDialogComponent', () => {
  let component: DeleteCarDialogComponent;
  let fixture: ComponentFixture<DeleteCarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCarDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteCarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
