import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CarsTableComponent } from '../cars-table/cars-table.component';
import { OwnersTableComponent } from '../owners-table/owners-table.component';
import { Router } from '@angular/router';
import { CarService } from '../../services/car-service/car.service';
import { OwnerService } from '../../services/owner-service/owner.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  tableOptions = [
    { label: 'Cars', value: 'cars', component: CarsTableComponent },
    { label: 'Owners', value: 'owners', component: OwnersTableComponent },
  ];

  selectedTableComponent: any = this.tableOptions[0].component; // Default table

  constructor (private router: Router, private carService: CarService, private ownerService: OwnerService) { }

  ngOnInit(): void {
    this.carService.fetchCars().subscribe();
    this.ownerService.fetchOwners().subscribe();
  }

  selectTable(tableValue: string): void {
    const tableOption = this.tableOptions.find(option => option.value === tableValue);
    this.selectedTableComponent = tableOption ? tableOption.component : null;
  }

  logout(): void {
    this.router.navigate(['']);
  }
}
