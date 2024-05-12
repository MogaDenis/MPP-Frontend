import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OwnerService } from '../../../services/owner-service/owner.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CarDetailsDialogComponent } from '../../cars-dialogs/car-details-dialog/car-details-dialog.component';
import ICar from '../../../models/car.model';
import { CarService } from '../../../services/car-service/car.service';

@Component({
  selector: 'app-cars-list-dialog',
  standalone: true,
  imports: [MatDialogModule, MatInputModule, MatTableModule, MatPaginator, MatFormFieldModule, MatLabel, MatOption,
    MatSortModule, MatButtonModule, MatSelect, MatIconModule],
  templateUrl: './cars-list-dialog.component.html',
  styleUrl: './cars-list-dialog.component.css'
})
export class CarsListDialogComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['make', 'model', 'colour', 'actions'];
  headerBgColor: string = "#028ffa";
  dataSource: MatTableDataSource<ICar>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) private ownerData: any, private renderer: Renderer2, private toastrService: ToastrService,
    private ownerService: OwnerService, private dialogReference: MatDialogRef<CarsListDialogComponent>,
    private changeDetectorRef: ChangeDetectorRef, private dialog: MatDialog, private carService: CarService) {

    this.dataSource = new MatTableDataSource<ICar>();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carService.fetchCars()
      .subscribe({
        next: (cars) => {
          this.dataSource.data = cars.filter(car => car.ownerId === this.ownerData.ownerId);
        },
        error: () => {
          this.toastrService.error("Couldn't fetch the cars from the database", 'Network issue', {
            positionClass: 'toast-top-left'
          });
        }
      });
  }

  public showDetails(rowId: number): void {
    this.dialog.open(CarDetailsDialogComponent, {
      data: {
        carId: rowId,
      }
    })
  }
}
