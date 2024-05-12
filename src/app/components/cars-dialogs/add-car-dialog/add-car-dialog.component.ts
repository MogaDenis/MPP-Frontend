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
import IOwner from '../../../models/owner.model';
import { CarService } from '../../../services/car-service/car.service';
import { OwnerService } from '../../../services/owner-service/owner.service';
import ICarForAddUpdate from '../../../models/car-add-update.model';

export class AddErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-car-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule, MatFormField, MatInputModule,
    ReactiveFormsModule, MatSelect, MatOption],
  templateUrl: './add-car-dialog.component.html',
  styleUrl: './add-car-dialog.component.css'
})
export class AddCarDialogComponent implements OnInit {
  makeFormControl = new FormControl('', [Validators.required]);
  modelFormControl = new FormControl('', [Validators.required]);
  colourFormControl = new FormControl('', [Validators.required]);
  imageUrlFormControl = new FormControl('', [Validators.required]);
  ownerFormControl = new FormControl('', [Validators.required]);

  matcher = new AddErrorStateMatcher();

  public owners!: IOwner[];
  public selectedOwnerId: number = 0;

  constructor(private carService: CarService, private renderer: Renderer2, private ownerService: OwnerService,
    private toastrService: ToastrService, private dialogReference: MatDialogRef<AddCarDialogComponent>) { }

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

  clearDataFromForm(): void {
    (<HTMLInputElement>this.renderer.selectRootElement("#add-make")).value = "";
    (<HTMLInputElement>this.renderer.selectRootElement("#add-model")).value = "";
    (<HTMLInputElement>this.renderer.selectRootElement("#add-colour")).value = "";
    (<HTMLInputElement>this.renderer.selectRootElement("#add-image-url")).value = "";
    this.selectedOwnerId = 0;
  }

  getCarDataFromForm(): ICarForAddUpdate {
    const make = (<HTMLInputElement>this.renderer.selectRootElement("#add-make")).value;
    const model = (<HTMLInputElement>this.renderer.selectRootElement("#add-model")).value;
    const colour = (<HTMLInputElement>this.renderer.selectRootElement("#add-colour")).value;
    const imageUrl = (<HTMLInputElement>this.renderer.selectRootElement("#add-image-url")).value;
    const ownerId = this.selectedOwnerId;

    return {
      make: make,
      model: model,
      colour: colour,
      imageUrl: imageUrl,
      ownerId: ownerId
    };
  }

  validateFormData(): boolean {
    const make = (<HTMLInputElement>this.renderer.selectRootElement("#add-make")).value;
    const model = (<HTMLInputElement>this.renderer.selectRootElement("#add-model")).value;
    const colour = (<HTMLInputElement>this.renderer.selectRootElement("#add-colour")).value;
    const imageUrl = (<HTMLInputElement>this.renderer.selectRootElement("#add-image-url")).value;

    if (make.length === 0 || model.length === 0 || colour.length === 0 || imageUrl.length === 0) {
      return false;
    }

    return true;
  }

  addCar(): void {
    if (!this.validateFormData()) {
      this.toastrService.error("Invalid data provided!", '', {
        positionClass: 'toast-top-left'
      });

      return;
    }

    this.carService.addCar(this.getCarDataFromForm()).subscribe();
    this.dialogReference.close();
  }
}
