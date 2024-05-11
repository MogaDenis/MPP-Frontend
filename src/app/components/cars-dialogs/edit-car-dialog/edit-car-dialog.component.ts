import { ChangeDetectorRef, Component, Inject, OnInit, Renderer2 } from '@angular/core';
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

export class EditErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-car-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule, MatFormField, MatInputModule,
    ReactiveFormsModule, MatSelect, MatOption, MatButtonModule],
  templateUrl: './edit-car-dialog.component.html',
  styleUrl: './edit-car-dialog.component.css'
})
export class EditCarDialogComponent {
  makeFormControl = new FormControl('', [Validators.required]);
  modelFormControl = new FormControl('', [Validators.required]);
  colourFormControl = new FormControl('', [Validators.required]);
  imageUrlFormControl = new FormControl('', [Validators.required]);
  ownerFormControl = new FormControl('', [Validators.required]);

  matcher = new EditErrorStateMatcher();

  public owners!: IOwner[];
  public selectedOwnerId!: number | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) private carData: any, private carService: CarService, private renderer: Renderer2, private toastrService: ToastrService,
    private ownerService: OwnerService, private dialogReference: MatDialogRef<EditCarDialogComponent>, 
    private changeDetectorRef: ChangeDetectorRef) {

  }

  ngAfterViewInit(): void {
    this.populateFormWithCarData();
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

  private populateFormWithCarData(): void {
    const car = this.carService.getCarById(this.carData.carId);

    if (!car) {
      return;
    }

    (<HTMLInputElement>this.renderer.selectRootElement("#edit-make")).value = car.make;
    (<HTMLInputElement>this.renderer.selectRootElement("#edit-model")).value = car.model;
    (<HTMLInputElement>this.renderer.selectRootElement("#edit-colour")).value = car.colour;
    (<HTMLInputElement>this.renderer.selectRootElement("#edit-image-url")).value = car.imageUrl;
    this.selectedOwnerId = car.ownerId;

    this.changeDetectorRef.detectChanges();
  }

  private getCarDataFromForm(): ICarForAddUpdate {
    const make = (<HTMLInputElement>this.renderer.selectRootElement("#edit-make")).value;
    const model = (<HTMLInputElement>this.renderer.selectRootElement("#edit-model")).value;
    const colour = (<HTMLInputElement>this.renderer.selectRootElement("#edit-colour")).value;
    const imageUrl = (<HTMLInputElement>this.renderer.selectRootElement("#edit-image-url")).value;
    const ownerId = this.selectedOwnerId;

    return {
      make: make,
      model: model,
      colour: colour,
      imageUrl: imageUrl,
      ownerId: Number(ownerId)
    };
  }

  validateFormData(): boolean {
    const make = (<HTMLInputElement>this.renderer.selectRootElement("#edit-make")).value;
    const model = (<HTMLInputElement>this.renderer.selectRootElement("#edit-model")).value;
    const colour = (<HTMLInputElement>this.renderer.selectRootElement("#edit-colour")).value;
    const imageUrl = (<HTMLInputElement>this.renderer.selectRootElement("#edit-image-url")).value;

    if (make.length === 0 || model.length === 0 || colour.length === 0 || imageUrl.length === 0) {
      return false;
    }

    return true;
  }

  editCar(): void {
    if (!this.validateFormData()) {
      this.toastrService.error("Invalid data provided", '', {
        positionClass: 'toast-top-left'
      });
      return;
    }

    this.carService.updateCar(this.carData.carId, this.getCarDataFromForm()).subscribe();
    this.dialogReference.close();
  }
}
