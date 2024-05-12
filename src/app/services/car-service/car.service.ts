import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map, of } from 'rxjs';
import ICar from '../../models/car.model';
import { configuration } from '../../../main';
import ICarForAddUpdate from '../../models/car-add-update.model';
import { ToastrService } from 'ngx-toastr';
import { OwnerService } from '../owner-service/owner.service';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private carsList: ICar[] | undefined;

  private addedCarSubject = new Subject<ICar>();
  private updatedCarSubject = new Subject<ICar>();
  private deletedCarSubject = new Subject<number>();

  public addedCar$ = this.addedCarSubject.asObservable();
  public updatedCar$ = this.updatedCarSubject.asObservable();
  public deletedCar$ = this.deletedCarSubject.asObservable();

  constructor(private httpClient: HttpClient, private toastrService: ToastrService, private ownerService: OwnerService) {
    this.ownerService.deletedOwner$.subscribe({
      next: (ownerId) => {
        this.carsList = this.carsList?.filter(car => car.ownerId !== ownerId);
      }
    });
  }

  getCars(): ICar[] | undefined {
    return this.carsList;
  }

  getCarById(id: number): ICar | undefined {
    return this.carsList?.find(car => car.id === id);
  }

  fetchCars(): Observable<ICar[]> {
    if (this.carsList) {
      return of(this.carsList);
    }

    return this.httpClient.get<ICar[]>(configuration.apiBaseUrl + configuration.routes.cars)
      .pipe(
        map(cars => {
          this.carsList = cars;
          return this.carsList;
        })
      );
  }

  addCar(newCar: ICarForAddUpdate): Observable<ICar> {
    return this.httpClient.post<ICar>(configuration.apiBaseUrl + configuration.routes.cars, newCar)
      .pipe(
        map(car => {
          this.carsList?.unshift(car);

          this.addedCarSubject.next(car);

          this.toastrService.success("The car was added!", "", {
            positionClass: 'toast-top-left'
          });

          return car;
        })
      )
  }

  updateCar(carToUpdateId: number, newCarData: ICarForAddUpdate): Observable<ICar> {
    return this.httpClient.put<ICar>(configuration.apiBaseUrl + configuration.routes.cars + "/" + carToUpdateId, newCarData)
      .pipe(
        map(() => {
          const updatedCar: ICar = {
            id: carToUpdateId,
            ...newCarData
          }

          const index = this.carsList?.findIndex(car => car.id === carToUpdateId);
          if (index !== undefined && index !== -1 && this.carsList) {
            this.carsList[index] = updatedCar;
          }

          this.updatedCarSubject.next(updatedCar);

          this.toastrService.success("The car was updated!", "", {
            positionClass: 'toast-top-left'
          });

          return updatedCar;
        })
      )
  }

  deleteCar(carId: number): Observable<any> {
    return this.httpClient.delete(configuration.apiBaseUrl + configuration.routes.cars + "/" + carId)
      .pipe(
        map(() => {
          this.carsList = this.carsList?.filter(car => car.id !== carId);

          this.deletedCarSubject.next(carId);

          this.toastrService.success("The car was deleted!", "", {
            positionClass: 'toast-top-left'
          });
        })
      )
  }
}
