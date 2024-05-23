import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CarsTableComponent } from '../cars-table/cars-table.component';
import { OwnersTableComponent } from '../owners-table/owners-table.component';
import { Router } from '@angular/router';
import { CarService } from '../../services/car-service/car.service';
import { OwnerService } from '../../services/owner-service/owner.service';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { UsersTableComponent } from '../users-table/users-table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  userRole: string | null = null;
  tableOptions: any = [
    { label: 'Cars', value: 'cars', component: CarsTableComponent },
    { label: 'Owners', value: 'owners', component: OwnersTableComponent },
  ];

  selectedTableComponent: any = this.tableOptions[0].component; // Default table

  constructor (private router: Router, private carService: CarService, private ownerService: OwnerService, 
    private authenticationService: AuthenticationService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.carService.fetchCars().subscribe();
    this.ownerService.fetchOwners().subscribe();

    this.userRole = this.authenticationService.getRoleFromToken();
    if (this.userRole === "ADMIN") {


      this.tableOptions.push({
        label: 'Users', value: 'users', component: UsersTableComponent
      });

      this.changeDetectorRef.detectChanges();
    }
  }

  selectTable(tableValue: string): void {
    const tableOption = this.tableOptions.find((option: { value: string; }) => option.value === tableValue);
    this.selectedTableComponent = tableOption ? tableOption.component : null;
  }

  logout(): void {
    this.router.navigate(['']);
  }
}
