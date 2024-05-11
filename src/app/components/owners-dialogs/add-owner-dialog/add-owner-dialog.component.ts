import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher, MatOption } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { OwnerService } from '../../../services/owner-service/owner.service';
import ICarForAddUpdate from '../../../models/car-add-update.model';
import IOwnerForAddUpdate from '../../../models/owner-add-update.model';

export class AddErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-owner-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule, MatFormField, MatInputModule,
    ReactiveFormsModule, MatSelect, MatOption, MatButtonModule],
  templateUrl: './add-owner-dialog.component.html',
  styleUrl: './add-owner-dialog.component.css'
})
export class AddOwnerDialogComponent {
  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);

  matcher = new AddErrorStateMatcher();

  constructor(private renderer: Renderer2, private ownerService: OwnerService, private toastrService: ToastrService,
    private dialogReference: MatDialogRef<AddOwnerDialogComponent>) { }

  clearDataFromForm(): void {
    (<HTMLInputElement>this.renderer.selectRootElement("#add-first-name")).value = "";
    (<HTMLInputElement>this.renderer.selectRootElement("#add-last-name")).value = "";
  }

  getOwnerDataFromForm(): IOwnerForAddUpdate {
    const firstName = (<HTMLInputElement>this.renderer.selectRootElement("#add-first-name")).value;
    const lastName = (<HTMLInputElement>this.renderer.selectRootElement("#add-last-name")).value;

    return {
      firstName: firstName,
      lastName: lastName
    };
  }

  validateFormData(): boolean {
    const firstName = (<HTMLInputElement>this.renderer.selectRootElement("#add-first-name")).value;
    const lastName = (<HTMLInputElement>this.renderer.selectRootElement("#add-last-name")).value;

    if (firstName.length === 0 || lastName.length === 0) {
      return false;
    }

    return true;
  }

  addOwner(): void {
    if (!this.validateFormData()) {
      this.toastrService.error("Invalid data provided!", '', {
        positionClass: 'toast-top-left'
      });

      return;
    }

    this.ownerService.addOwner(this.getOwnerDataFromForm()).subscribe();
    this.dialogReference.close();
  }
}
