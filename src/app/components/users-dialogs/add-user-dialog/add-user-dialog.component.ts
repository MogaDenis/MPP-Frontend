import { Component, Renderer2 } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatOption } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddOwnerDialogComponent } from '../../owners-dialogs/add-owner-dialog/add-owner-dialog.component';
import IUserForRegister from '../../../models/user-for-register.model';
import { UserService } from '../../../services/user-service/user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';

export class AddErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule, MatFormField, MatInputModule,
    ReactiveFormsModule, MatSelect, MatOption, MatButtonModule],
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.css'
})
export class AddUserDialogComponent {
  roles = [
    { value: 0, label: "Regular" },
    { value: 1, label: "Manager" },
    { value: 2, label: "Admin" }
  ];

  public selectedRole: number = 0;

  emailFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  roleFormControl = new FormControl('', [Validators.required]);

  matcher = new AddErrorStateMatcher();

  constructor(private renderer: Renderer2, private userService: UserService, private toastrService: ToastrService,
    private dialogReference: MatDialogRef<AddOwnerDialogComponent>) { }

  clearDataFromForm(): void {
    (<HTMLInputElement>this.renderer.selectRootElement("#add-email")).value = "";
    (<HTMLInputElement>this.renderer.selectRootElement("#add-password")).value = "";
  }

  getUserDataFromForm(): IUserForRegister {
    const email = (<HTMLInputElement>this.renderer.selectRootElement("#add-email")).value;
    const password = (<HTMLInputElement>this.renderer.selectRootElement("#add-password")).value;
    const role = this.selectedRole;

    return {
      email: email,
      password: password,
      role: role
    };
  }

  validateFormData(): boolean {
    const email = (<HTMLInputElement>this.renderer.selectRootElement("#add-email")).value;
    const password = (<HTMLInputElement>this.renderer.selectRootElement("#add-password")).value;

    if (email.length === 0 || password.length === 0) {
      return false;
    }

    return true;
  }

  addUser(): void {
    if (!this.validateFormData()) {
      this.toastrService.error("Invalid data provided!", '', {
        positionClass: 'toast-top-left'
      });

      return;
    }

    this.userService.addUser(this.getUserDataFromForm()).subscribe();
    this.dialogReference.close();
  }
}
