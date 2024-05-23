import { Injectable } from '@angular/core';
import IUser from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable, of, map } from 'rxjs';
import { configuration } from '../../../main';
import IUserForAddUpdate from '../../models/user-for-add-update.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersList: IUser[] | undefined;

  private addedUserSubject = new Subject<IUser>();
  private updatedUserSubject = new Subject<IUser>();
  private deletedUserSubject = new Subject<number>();

  public addedUser$ = this.addedUserSubject.asObservable();
  public updatedUser$ = this.updatedUserSubject.asObservable();
  public deletedUser$ = this.deletedUserSubject.asObservable();

  constructor(private httpClient: HttpClient, private toastrService: ToastrService) { }

  getUsers(): IUser[] | undefined {
    return this.usersList;
  }

  getUserById(id: number): IUser | undefined {
    return this.usersList?.find(User => User.id === id);
  }

  fetchUsers(): Observable<IUser[]> {
    if (this.usersList) {
      return of(this.usersList);
    }

    return this.httpClient.get<IUser[]>(configuration.apiBaseUrl + configuration.routes.users)
      .pipe(
        map(Users => {
          this.usersList = Users;
          return this.usersList;
        })
      );
  }

  addUser(newUser: IUserForAddUpdate): Observable<IUser> {
    return this.httpClient.post<IUser>(configuration.apiBaseUrl + configuration.routes.users, newUser)
      .pipe(
        map(User => {
          this.usersList?.unshift(User);

          this.addedUserSubject.next(User);

          this.toastrService.success("The User was added!", "", {
            positionClass: 'toast-top-left'
          });

          return User;
        })
      )
  }

  updateUser(userToUpdateId: number, newUserData: IUserForAddUpdate): Observable<IUser> {
    return this.httpClient.put<IUser>(configuration.apiBaseUrl + configuration.routes.Users + "/" + userToUpdateId, newUserData)
      .pipe(
        map(() => {
          const updatedUser: IUser = {
            id: userToUpdateId,
            ...newUserData
          }

          const index = this.usersList?.findIndex(user => user.id === userToUpdateId);
          if (index !== undefined && index !== -1 && this.usersList) {
            this.usersList[index] = updatedUser;
          }

          this.updatedUserSubject.next(updatedUser);

          this.toastrService.success("The User was updated!", "", {
            positionClass: 'toast-top-left'
          });

          return updatedUser;
        })
      )
  }

  deleteUser(userId: number): Observable<any> {
    return this.httpClient.delete(configuration.apiBaseUrl + configuration.routes.Users + "/" + userId)
      .pipe(
        map(() => {
          this.usersList = this.usersList?.filter(User => User.id !== userId);

          this.deletedUserSubject.next(userId);

          this.toastrService.success("The User was deleted!", "", {
            positionClass: 'toast-top-left'
          });
        })
      )
  }
}
