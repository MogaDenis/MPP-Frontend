import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CarService } from '../../../services/car-service/car.service';

@Component({
  selector: 'app-delete-car-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-car-dialog.component.html',
  styleUrl: './delete-car-dialog.component.css'
})
export class DeleteCarDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private carData: any, private carService: CarService,
    private dialogReference: MatDialogRef<DeleteCarDialogComponent>) { }

  deleteCar(): void {
    this.carService.deleteCar(this.carData.carId).subscribe();
    this.dialogReference.close();
  }
}
