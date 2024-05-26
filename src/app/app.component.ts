import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from './services/connection-service/connection.service';
import { AuthenticationService } from './services/authentication-service/authentication.service';
import { isProduction } from '../main';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend-angular';

  constructor(private connectionService: ConnectionService, private toastrService: ToastrService,
    private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    if (isProduction) {
      this.startServerConnectionCheck();
    }
  }

  startServerConnectionCheck(): void {
    this.connectionService.checkServerConnection().subscribe({
      next: () => {
        let forceReload = false;
        if (this.connectionService.isClientOffline) {
          this.connectionService.retryPendingRequests();
          forceReload = true;
        }

        this.connectionService.clientOfflineSubject.next(false);

        if (this.authenticationService.getJwtToken()) {
          this.connectionService.checkIfSessionExpired().subscribe({
            error: () => {
              this.toastrService.warning("Your session has expired.", "Sorry", {
                positionClass: 'toast-top-left'
              });

              this.router.navigate(['/']);
            }
          });
        }

        if (forceReload) {
          window.location.reload();
        }
      },
      error: () => {
        this.connectionService.clientOfflineSubject.next(true);

        this.toastrService.warning("You are offline.", "Network issue", {
          positionClass: 'toast-bottom-left'
        })
      }
    });

    setTimeout(() => {
      this.startServerConnectionCheck()
    }, 10000);
  }
}
