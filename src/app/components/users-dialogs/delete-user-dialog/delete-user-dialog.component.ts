import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user-service/user.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteOwnerDialogComponent } from '../../owners-dialogs/delete-owner-dialog/delete-owner-dialog.component';

@Component({
  selector: 'app-delete-user-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.css'
})
export class DeleteUserDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private userData: any, private userService: UserService,
    private dialogReference: MatDialogRef<DeleteOwnerDialogComponent>) { }

  deleteUser(): void {
    this.userService.deleteUser(this.userData.userId).subscribe();
    this.dialogReference.close();
  }
}
