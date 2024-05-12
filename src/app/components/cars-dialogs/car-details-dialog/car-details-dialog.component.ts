import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { CarService } from '../../../services/car-service/car.service';
import { OwnerService } from '../../../services/owner-service/owner.service';
import IOwner from '../../../models/owner.model';

@Component({
  selector: 'app-car-details-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule, MatFormField, MatInputModule],
  templateUrl: './car-details-dialog.component.html',
  styleUrl: './car-details-dialog.component.css'
})
export class CarDetailsDialogComponent implements OnInit {
  private owners!: IOwner[];

  constructor(@Inject(MAT_DIALOG_DATA) private carData: any, private carService: CarService,
    private renderer: Renderer2, private ownerService: OwnerService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.populateFormWithCarData();
  }

  private populateFormWithCarData(): void {
    const car = this.carService.getCarById(this.carData.carId);
    if (!car) {
      this.toastrService.error("The car with the given id was not found", 'Ooops', {
        positionClass: 'toast-top-left'
      });

      return;
    }

    const owner = this.ownerService.getOwnerById(car.ownerId);
    let ownerName;
    if (!owner) {
      this.toastrService.error("The owner of this car was not found", 'Ooops', {
        positionClass: 'toast-top-left'
      });

      ownerName = "Unknown";
    }
    else {
      ownerName = owner.firstName + " " + owner.lastName;
    }

    (<HTMLInputElement>this.renderer.selectRootElement("#details-make")).value = car.make;
    (<HTMLInputElement>this.renderer.selectRootElement("#details-model")).value = car.model;
    (<HTMLInputElement>this.renderer.selectRootElement("#details-colour")).value = car.colour;
    (<HTMLInputElement>this.renderer.selectRootElement("#details-owner")).value = ownerName;
    (<HTMLImageElement>this.renderer.selectRootElement("#details-image")).src = car.imageUrl;
  }
}
