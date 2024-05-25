import { Component, ViewChild } from '@angular/core';
import IUser from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTable, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import IOwner from '../../models/owner.model';
import { UserService } from '../../services/user-service/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { AddUserDialogComponent } from '../users-dialogs/add-user-dialog/add-user-dialog.component';
import { DeleteUserDialogComponent } from '../users-dialogs/delete-user-dialog/delete-user-dialog.component';
import { EditUserDialogComponent } from '../users-dialogs/edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatPaginator, MatFormFieldModule, MatLabel, MatOption,
    MatSortModule, MatButtonModule, MatSelect, MatIconModule],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})
export class UsersTableComponent {
  displayedColumns: string[] = ['email', 'role', 'actions'];
  filteringOptions: string[] = ['email', 'role'];
  chosenFilterOption: string = "";

  headerBgColor: string = "#028ffa";
  users: IUser[] = [];
  dataSource: MatTableDataSource<IUser>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<IOwner>;

  constructor(private userService: UserService, private toastrService: ToastrService, private dialog: MatDialog) {

    this.dataSource = new MatTableDataSource<IUser>();
  }

  getRoleToString(userRole: number) {
    switch (userRole) {

      case 0: {
        return "Regular";
      }

      case 1: {
        return "Manager";
      }

      case 2: {
        return "Admin";
      }

      default: {
        return "Unknown";
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.userService.fetchUsers()
      .subscribe({
        next: (users) => {
          this.users = users;
          this.dataSource.data = this.users;
        },
        error: () => {
          this.toastrService.error("Couldn't fetch the owners from the database", 'Network issue', {
            positionClass: 'toast-top-left'
          });
        }
      });

    this.userService.addedUser$.subscribe({
      next: () => {
        const ownersList = this.userService.getUsers();
        if (ownersList) {
          this.dataSource.data = ownersList;
        }
      }
    });

    this.userService.deletedUser$.subscribe({
      next: () => {
        const ownersList = this.userService.getUsers();
        if (ownersList) {
          this.dataSource.data = ownersList;
        }
      }
    });

    this.userService.updatedUser$.subscribe({
      next: () => {
        const ownersList = this.userService.getUsers();
        if (ownersList) {
          this.dataSource.data = ownersList;
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

    this.dataSource.filterPredicate = (user: any, filterValue: any) => {
      if (this.chosenFilterOption === "role") {
        return this.getRoleToString(user[this.chosenFilterOption]).toLowerCase().includes(filterValue);
      }

      return user[this.chosenFilterOption].toLowerCase().includes(filterValue);
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortData(sort: Sort) {
    if (sort.active && sort.direction !== '') {
      const dataCopy = [...this.users];
      this.dataSource.data = dataCopy.sort((a, b) => {

        let aValue, bValue;

        if (sort.active === "role") {
          aValue = this.getRoleToString((a as any)[sort.active]);
          bValue = this.getRoleToString((b as any)[sort.active]);
        }
        else {
          aValue = (a as any)[sort.active];
          bValue = (b as any)[sort.active];
        }

        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
    else {
      this.dataSource.data = this.users;
    }
  }

  handleAdd() {
    this.dialog.open(AddUserDialogComponent);
  }

  public handleDelete(rowId: number): void {
    this.dialog.open(DeleteUserDialogComponent, {
      data: {
        userId: rowId,
      },
    });
  }

  public handleEdit(rowId: number): void {
    this.dialog.open(EditUserDialogComponent, {
      data: {
        userId: rowId,
      },
    });
  }

  changeFilterOption(value: string): void {
    this.chosenFilterOption = value;
  }
}
