import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import IOwner from '../../models/owner.model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { OwnerService } from '../../services/owner-service/owner.service';
import { AddOwnerDialogComponent } from '../owners-dialogs/add-owner-dialog/add-owner-dialog.component';
import { DeleteOwnerDialogComponent } from '../owners-dialogs/delete-owner-dialog/delete-owner-dialog.component';
import { EditOwnerDialogComponent } from '../owners-dialogs/edit-owner-dialog/edit-owner-dialog.component';
import { CarsListDialogComponent } from '../owners-dialogs/cars-list-dialog/cars-list-dialog.component';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';

@Component({
  selector: 'app-owners-table',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatPaginator, MatFormFieldModule, MatLabel, MatOption,
    MatSortModule, MatButtonModule, MatSelect, MatIconModule],
  templateUrl: './owners-table.component.html',
  styleUrl: './owners-table.component.css'
})
export class OwnersTableComponent implements OnInit, AfterViewInit {
  canModifyData!: boolean;

  displayedColumns: string[] = ['firstName', 'lastName', 'actions'];
  filteringOptions: string[] = ['firstName', 'lastName'];
  chosenFilterOption: string = "";

  headerBgColor: string = "#028ffa";
  owners: IOwner[] = [];
  dataSource: MatTableDataSource<IOwner>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<IOwner>;

  constructor(private ownerService: OwnerService, private toastrService: ToastrService, private dialog: MatDialog, 
    private authenticationService: AuthenticationService, private changeDetectorRef: ChangeDetectorRef) {

    this.dataSource = new MatTableDataSource<IOwner>();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.ownerService.fetchOwners()
      .subscribe({
        next: (owners) => {
          this.owners = owners;
          this.dataSource.data = this.owners;
        },
        error: () => {
          this.toastrService.error("Couldn't fetch the owners from the database", 'Network issue', {
            positionClass: 'toast-top-left'
          });
        }
      });

    this.ownerService.addedOwner$.subscribe({
      next: () => {
        const ownersList = this.ownerService.getOwners();
        if (ownersList) {
          this.dataSource.data = ownersList;
        }
      }
    });

    this.ownerService.deletedOwner$.subscribe({
      next: () => {
        const ownersList = this.ownerService.getOwners();
        if (ownersList) {
          this.dataSource.data = ownersList;
        }
      }
    });

    this.ownerService.updatedOwner$.subscribe({
      next: () => {
        const ownersList = this.ownerService.getOwners();
        if (ownersList) {
          this.dataSource.data = ownersList;
        }
      }
    });

    if (this.authenticationService.getRoleFromToken() === "REGULAR") {
      this.canModifyData = false;
    }
    else {
      this.canModifyData = true;
    }

    this.changeDetectorRef.detectChanges();
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
      const dataCopy = [...this.owners];
      this.dataSource.data = dataCopy.sort((a, b) => {

        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];

        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
    else {
      this.dataSource.data = this.owners;
    }
  }

  handleAdd() {
    this.dialog.open(AddOwnerDialogComponent);
  }

  public handleDelete(rowId: number): void {
    this.dialog.open(DeleteOwnerDialogComponent, {
      data: {
        ownerId: rowId,
      },
    });
  }

  public handleEdit(rowId: number): void {
    this.dialog.open(EditOwnerDialogComponent, {
      data: {
        ownerId: rowId,
      },
    });
  }

  public showCarsOfOwner(rowId: number): void {
    this.dialog.open(CarsListDialogComponent, {
      data: {
        ownerId: rowId
      }
    })
  }

  changeFilterOption(value: string): void {
    this.chosenFilterOption = value;
  }
}
