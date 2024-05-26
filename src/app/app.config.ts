import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { jwtInterceptor } from './interceptors/jwt-interceptor/jwt.interceptor';
import { offlineInterceptor } from './interceptors/offline-interceptor/offline.interceptor';
import { MockAuthenticationService } from './services/mock-authentication-service/mock-authentication.service';
import { AuthenticationService } from './services/authentication-service/authentication.service';
import { isProduction } from '../main';

export const appConfig: ApplicationConfig = {

  providers: [provideRouter(routes),
  provideAnimationsAsync(),
  provideHttpClient(withInterceptors([jwtInterceptor, offlineInterceptor])),
  provideToastr(),
  isProduction
    ? AuthenticationService
    : MockAuthenticationService ]
};
