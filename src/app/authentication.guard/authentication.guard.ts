import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication-service/authentication.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  const toastrService: ToastrService = inject(ToastrService); 

  if (!authenticationService.getJwtToken()) {
    toastrService.warning("You must log in first.", "Nice try", {
      positionClass: 'toast-top-left'
    });

    router.navigate(['/']);

    return false;
  }

  authenticationService.checkIfSessionExpired().subscribe({
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
