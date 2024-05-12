import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OwnerService } from '../../../services/owner-service/owner.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-owner-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-owner-dialog.component.html',
  styleUrl: './delete-owner-dialog.component.css'
})
export class DeleteOwnerDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private ownerData: any, private ownerService: OwnerService,
    private toastrService: ToastrService, private dialogReference: MatDialogRef<DeleteOwnerDialogComponent>) { }

  deleteOwner(): void {
    this.ownerService.deleteOwner(this.ownerData.ownerId).subscribe({
      next: () => {
        this.toastrService.warning("The cars of that owner were also deleted.", "Warning", {
          positionClass: 'toast-top-left'
        })
      }
    });
    this.dialogReference.close();
  }
}
