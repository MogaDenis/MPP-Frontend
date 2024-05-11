import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OwnerService } from '../../../services/owner-service/owner.service';

@Component({
  selector: 'app-delete-owner-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-owner-dialog.component.html',
  styleUrl: './delete-owner-dialog.component.css'
})
export class DeleteOwnerDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private ownerData: any, private ownerService: OwnerService,
    private dialogReference: MatDialogRef<DeleteOwnerDialogComponent>) { }

  deleteOwner(): void {
    this.ownerService.deleteOwner(this.ownerData.ownerId).subscribe();
    this.dialogReference.close();
  }
}
