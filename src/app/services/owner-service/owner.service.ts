import { Injectable } from '@angular/core';
import IOwner from '../../models/owner.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable, of, map } from 'rxjs';
import { configuration } from '../../../main';
import IOwnerForAddUpdate from '../../models/owner-add-update.model';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private ownersList: IOwner[] | undefined;

  private addedOwnerSubject = new Subject<IOwner>();
  private updatedOwnerSubject = new Subject<IOwner>();
  private deletedOwnerSubject = new Subject<number>();

  public addedOwner$ = this.addedOwnerSubject.asObservable();
  public updatedOwner$ = this.updatedOwnerSubject.asObservable();
  public deletedOwner$ = this.deletedOwnerSubject.asObservable();

  constructor(private httpClient: HttpClient, private toastrService: ToastrService) { }

  getOwners(): IOwner[] | undefined {
    return this.ownersList;
  }

  getOwnerById(id: number): IOwner | undefined {
    return this.ownersList?.find(owner => owner.id === id);
  }

  fetchOwners(): Observable<IOwner[]> {
    if (this.ownersList) {
      return of(this.ownersList);
    }

    return this.httpClient.get<IOwner[]>(configuration.apiBaseUrl + configuration.routes.owners)
      .pipe(
        map(owners => {
          this.ownersList = owners;
          return this.ownersList;
        })
      );
  }

  addOwner(newOwner: IOwnerForAddUpdate): Observable<IOwner> {
    return this.httpClient.post<IOwner>(configuration.apiBaseUrl + configuration.routes.owners, newOwner)
      .pipe(
        map(owner => {
          this.ownersList?.unshift(owner);

          this.addedOwnerSubject.next(owner);

          this.toastrService.success("The owner was added!", "", {
            positionClass: 'toast-top-left'
          });

          return owner;
        })
      )
  }

  updateOwner(ownerToUpdateId: number, newOwnerData: IOwnerForAddUpdate): Observable<IOwner> {
    return this.httpClient.put<IOwner>(configuration.apiBaseUrl + configuration.routes.owners + "/" + ownerToUpdateId, newOwnerData)
      .pipe(
        map(() => {
          const updatedOwner: IOwner = {
            id: ownerToUpdateId,
            ...newOwnerData
          }

          const index = this.ownersList?.findIndex(owner => owner.id === ownerToUpdateId);
          if (index !== undefined && index !== -1 && this.ownersList) {
            this.ownersList[index] = updatedOwner;
          }

          this.updatedOwnerSubject.next(updatedOwner);

          this.toastrService.success("The owner was updated!", "", {
            positionClass: 'toast-top-left'
          });

          return updatedOwner;
        })
      )
  }

  deleteOwner(ownerId: number): Observable<any> {
    return this.httpClient.delete(configuration.apiBaseUrl + configuration.routes.owners + "/" + ownerId)
      .pipe(
        map(() => {
          this.ownersList = this.ownersList?.filter(owner => owner.id !== ownerId);

          this.deletedOwnerSubject.next(ownerId);

          this.toastrService.success("The owner was deleted!", "", {
            positionClass: 'toast-top-left'
          });
        })
      )
  }
}
