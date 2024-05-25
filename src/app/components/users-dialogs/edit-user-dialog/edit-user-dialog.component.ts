import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { EditOwnerDialogComponent } from '../../owners-dialogs/edit-owner-dialog/edit-owner-dialog.component';
import { UserService } from '../../../services/user-service/user.service';
import IUserForRegister from '../../../models/user-for-register.model';

export class EditErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule, MatFormField, MatInputModule,
    ReactiveFormsModule, MatSelect, MatOption, MatButtonModule],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css'
})
export class EditUserDialogComponent implements AfterViewInit {
  roles = [
    { value: 0, label: "Regular" },
    { value: 1, label: "Manager" },
    { value: 2, label: "Admin" }
  ];

  public selectedRole: number = 0;

  emailFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  roleFormControl = new FormControl('', [Validators.required]);

  matcher = new EditErrorStateMatcher();

  public selectedUserId!: number | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) private userData: any, private renderer: Renderer2, private toastrService: ToastrService,
    private userService: UserService, private dialogReference: MatDialogRef<EditOwnerDialogComponent>,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.populateFormWithUserData();
  }

  private populateFormWithUserData(): void {
    const user = this.userService.getUserById(this.userData.userId);
    if (!user) {
      return;
    }

    (<HTMLInputElement>this.renderer.selectRootElement("#edit-email")).value = user.email;
    this.selectedRole = user.role;

    this.changeDetectorRef.detectChanges();
  }

  private getUserDataFromForm(): IUserForRegister {
    const email = (<HTMLInputElement>this.renderer.selectRootElement("#edit-email")).value;
    const password = (<HTMLInputElement>this.renderer.selectRootElement("#edit-password")).value;
    const role = this.selectedRole;

    return {
      email: email,
      password: password,
      role: role
    };
  }

  validateFormData(): boolean {
    const email = (<HTMLInputElement>this.renderer.selectRootElement("#edit-email")).value;
    const password = (<HTMLInputElement>this.renderer.selectRootElement("#edit-password")).value;

    if (email.length === 0 || password.length === 0) {
      return false;
    }

    return true;
  }

  editUser(): void {
    if (!this.validateFormData()) {
      this.toastrService.error("Invalid data provided", '', {
        positionClass: 'toast-top-left'
      });
      return;
    }

    this.userService.updateUser(this.userData.userId, this.getUserDataFromForm()).subscribe();
    this.dialogReference.close();
  }
}
