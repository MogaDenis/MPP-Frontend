import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
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
import IOwner from '../../../models/owner.model';
import { CarService } from '../../../services/car-service/car.service';
import { OwnerService } from '../../../services/owner-service/owner.service';
import ICarForAddUpdate from '../../../models/car-add-update.model';
import IOwnerForAddUpdate from '../../../models/owner-add-update.model';

export class EditErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-owner-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule, MatFormField, MatInputModule,
    ReactiveFormsModule, MatSelect, MatOption, MatButtonModule],
  templateUrl: './edit-owner-dialog.component.html',
  styleUrl: './edit-owner-dialog.component.css'
})
export class EditOwnerDialogComponent implements AfterViewInit {
  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);

  matcher = new EditErrorStateMatcher();

  public owners!: IOwner[];
  public selectedOwnerId!: number | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) private ownerData: any, private renderer: Renderer2, private toastrService: ToastrService,
    private ownerService: OwnerService, private dialogReference: MatDialogRef<EditOwnerDialogComponent>, 
    private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.populateFormWithOwnerData();
  }

  ngOnInit(): void { 
    this.ownerService.fetchOwners().subscribe({
      next: (owners) => {
        this.owners = owners;
      },
      error: () => {
        this.toastrService.error("Couldn't fetch the owners from the database", 'Network issue', {
          positionClass: 'toast-top-left'
        });
      }
    });
  }

  private populateFormWithOwnerData(): void {
    const owner = this.ownerService.getOwnerById(this.ownerData.ownerId);

    if (!owner) {
      return;
    }

    (<HTMLInputElement>this.renderer.selectRootElement("#edit-first-name")).value = owner.firstName;
    (<HTMLInputElement>this.renderer.selectRootElement("#edit-last-name")).value = owner.lastName;

    this.changeDetectorRef.detectChanges();
  }

  private getOwnerDataFromForm(): IOwnerForAddUpdate {
    const firstName = (<HTMLInputElement>this.renderer.selectRootElement("#edit-first-name")).value;
    const lastName = (<HTMLInputElement>this.renderer.selectRootElement("#edit-last-name")).value;

    return {
      firstName: firstName,
      lastName: lastName
    };
  }

  validateFormData(): boolean {
    const firstName = (<HTMLInputElement>this.renderer.selectRootElement("#edit-first-name")).value;
    const lastName = (<HTMLInputElement>this.renderer.selectRootElement("#edit-last-name")).value;

    if (firstName.length === 0 || lastName.length === 0) {
      return false;
    }

    return true;
  }

  editOwner(): void {
    if (!this.validateFormData()) {
      this.toastrService.error("Invalid data provided", '', {
        positionClass: 'toast-top-left'
      });
      return;
    }

    this.ownerService.updateOwner(this.ownerData.ownerId, this.getOwnerDataFromForm()).subscribe();
    this.dialogReference.close();
  }
}
