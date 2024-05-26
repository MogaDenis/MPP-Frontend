import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { ConnectionService } from '../services/connection-service/connection.service';
import { isProduction } from '../../main';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  const connectionService = inject(ConnectionService);
  const toastrService: ToastrService = inject(ToastrService); 

  if (!isProduction) {
    return true;
  }

  if (!authenticationService.getJwtToken()) {
    toastrService.warning("You must log in first.", "Nice try", {
      positionClass: 'toast-top-left'
    });

    router.navigate(['/']);

    return false;
  }

  connectionService.checkIfSessionExpired().subscribe({
    error: () => {
      toastrService.warning("You must log in first.", "Nice try", {
        positionClass: 'toast-top-left'
      });

      router.navigate(['/']);

      return false;
    }
  });

  return true;
};
