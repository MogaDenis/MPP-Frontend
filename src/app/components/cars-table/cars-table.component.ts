import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import ICar from '../../models/car.model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CarService } from '../../services/car-service/car.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { AddCarDialogComponent } from '../cars-dialogs/add-car-dialog/add-car-dialog.component';
import { DeleteCarDialogComponent } from '../cars-dialogs/delete-car-dialog/delete-car-dialog.component';
import { EditCarDialogComponent } from '../cars-dialogs/edit-car-dialog/edit-car-dialog.component';
import { CarDetailsDialogComponent } from '../cars-dialogs/car-details-dialog/car-details-dialog.component';
import { OwnerService } from '../../services/owner-service/owner.service';

@Component({
  selector: 'app-cars-table',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatPaginator, MatFormFieldModule, MatLabel, MatOption,
    MatSortModule, MatButtonModule, MatSelect, MatIconModule],
  templateUrl: './cars-table.component.html',
  styleUrl: './cars-table.component.css'
})
export class CarsTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['make', 'model', 'colour', 'actions'];
  filteringOptions: string[] = ['make', 'model', 'colour'];
  chosenFilterOption: string = "";

  headerBgColor: string = "#028ffa";
  cars: ICar[] = [];
  dataSource: MatTableDataSource<ICar>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ICar>;

  constructor(private carService: CarService, private ownerService: OwnerService, private toastrService: ToastrService,
    private dialog: MatDialog) {

    this.dataSource = new MatTableDataSource<ICar>();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.carService.fetchCars()
      .subscribe({
        next: (cars) => {
          this.cars = cars;
          this.dataSource.data = this.cars;
        },
        error: () => {
          this.toastrService.error("Couldn't fetch the cars from the database", 'Network issue', {
            positionClass: 'toast-top-left'
          });
        }
      });

    this.carService.addedCar$.subscribe({
      next: () => {
        const carsList = this.carService.getCars();
        if (carsList) {
          this.dataSource.data = carsList;
        }
      }
    });

    this.carService.deletedCar$.subscribe({
      next: () => {
        const carsList = this.carService.getCars();
        if (carsList) {
          this.dataSource.data = carsList;
        }
      }
    });

    this.carService.updatedCar$.subscribe({
      next: () => {
        const carsList = this.carService.getCars();
        if (carsList) {
          this.dataSource.data = carsList;
        }
      }
    });

    this.ownerService.deletedOwner$.subscribe({
      next: () => {
        const carsList = this.carService.getCars();
        if (carsList) {
          this.dataSource.data = carsList;
        }
      }
    });
  }

  applyFilter(event: Event) {
    if (!this.chosenFilterOption || this.changeFilterOption.length === 0) {
      this.toastrService.clear();
      this.toastrService.error("Please choose a field first.", "", {
        positionClass: 'toast-top-left'
      });
      return;
    }

    this.toastrService.clear();
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase().trim();

    this.dataSource.filterPredicate = (car: any, filterValue: any) => {
      return car[this.chosenFilterOption].toLowerCase().includes(filterValue);
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortData(sort: Sort) {
    if (sort.active && sort.direction !== '') {
      const dataCopy = [...this.cars];
      this.dataSource.data = dataCopy.sort((a, b) => {

        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];

        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
    else {
      this.dataSource.data = this.cars;
    }
  }

  handleAdd() {
    this.dialog.open(AddCarDialogComponent);
  }

  public handleDelete(rowId: number): void {
    this.dialog.open(DeleteCarDialogComponent, {
      data: {
        carId: rowId,
      },
    });
  }

  public handleEdit(rowId: number): void {
    this.dialog.open(EditCarDialogComponent, {
      data: {
        carId: rowId,
      },
    });
  }

  public showDetails(rowId: number): void {
    this.dialog.open(CarDetailsDialogComponent, {
      data: {
        carId: rowId,
      }
    })
  }

  changeFilterOption(value: string): void {
    this.chosenFilterOption = value;
  }
}
