import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { configuration } from '../../../main';
import { jwtDecode } from 'jwt-decode';
import IUserForRegister from '../../models/user-for-register.model';
import IUserForLogin from '../../models/user-for-login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private roleClaimURI = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

  constructor(private httpClient: HttpClient) { }

  login(user: IUserForLogin): Observable<any> {
    return this.httpClient.post(configuration.apiBaseUrl + configuration.routes.login, user, {
      responseType: "text"
    }).pipe(
      map((jwtToken) => {
        sessionStorage.setItem("jwtToken", jwtToken);
      })
    );
  }

  logout() {
    sessionStorage.removeItem("jwtToken");
  }

  register(user: IUserForRegister): Observable<any> {
    return this.httpClient.post(configuration.apiBaseUrl + configuration.routes.register, user);
  }

  getRoleFromToken(): string | null {
    const jwtToken = this.getJwtToken();
    if (jwtToken === null) {
      return null;
    }

    const decodedToken: any = jwtDecode(jwtToken);
    if (decodedToken && decodedToken[this.roleClaimURI]) {
      return decodedToken[this.roleClaimURI];
    }

    return null;
  }

  getJwtToken(): string | null {
    return sessionStorage.getItem("jwtToken");
  }

  checkIfSessionExpired(): Observable<any> {
    return this.httpClient.get(configuration.apiBaseUrl + configuration.routes.checkIfTokenExpired);
  }
}
