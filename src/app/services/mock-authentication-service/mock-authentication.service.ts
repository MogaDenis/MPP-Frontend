import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import IUserForRegister from '../../models/user-for-register.model';
import IUserForLogin from '../../models/user-for-login.model';

@Injectable({
  providedIn: 'root'
})
export class MockAuthenticationService {
  private mockJwtToken = 'mock.jwt.token';

  login(user: IUserForLogin): Observable<any> {
    sessionStorage.setItem("jwtToken", this.mockJwtToken);
    return of(this.mockJwtToken);
  }

  logout() {
    sessionStorage.removeItem("jwtToken");
  }

  register(user: IUserForRegister): Observable<any> {
    return of({ success: true });
  }

  getRoleFromToken(): string | null {
    return 'ADMIN'; // Return the role you want to test with
  }

  getJwtToken(): string | null {
    return this.mockJwtToken;
  }
}
