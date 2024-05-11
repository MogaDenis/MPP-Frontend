import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import IUser from '../../models/user.model';
import { configuration } from '../../../main';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) { }

  login(user: IUser): Observable<any> {
    return this.httpClient.post(configuration.apiBaseUrl + configuration.routes.login, user, {
      responseType: "text"
    });
  }

  register(user: IUser): Observable<any> {
    return this.httpClient.post(configuration.apiBaseUrl + configuration.routes.register, user);
  }
}
