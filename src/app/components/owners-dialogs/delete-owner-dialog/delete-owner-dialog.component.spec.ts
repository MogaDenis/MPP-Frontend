import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOwnerDialogComponent } from './delete-owner-dialog.component';

describe('DeleteOwnerDialogComponent', () => {
  let component: DeleteOwnerDialogComponent;
  let fixture: ComponentFixture<DeleteOwnerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteOwnerDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteOwnerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
