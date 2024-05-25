import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './services/authentication-service/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend-angular';

  constructor(private authenticationService: AuthenticationService, private toastrService: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.startServerConnectionCheck();
  }

  startServerConnectionCheck(): void {
    this.authenticationService.checkServerConnection().subscribe({
      next: () => {
        this.authenticationService.checkIfSessionExpired().subscribe({
          error: () => {
            this.toastrService.warning("Your session has expired.", "Sorry", {
              positionClass: 'toast-top-left'
            });

            this.router.navigate(['/']);
          }
        });
      },
      error: () => {
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
