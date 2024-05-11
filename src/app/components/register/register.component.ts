import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { LoginErrorStateMatcher } from '../login/login.component';
import IUser from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule, MatFormField, MatInputModule,
    ReactiveFormsModule, MatSelect, MatOption, MatButtonModule, MatCardModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  emailFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  repeatPasswordFormControl = new FormControl('', [Validators.required]);

  matcher = new LoginErrorStateMatcher();

  constructor(private renderer: Renderer2, private router: Router, private toastrService: ToastrService,
    private authenticationService: AuthenticationService
  ) { }

  getUserDataFromForm(): IUser {
    const email = (<HTMLInputElement>this.renderer.selectRootElement("#register-email")).value;
    const password = (<HTMLInputElement>this.renderer.selectRootElement("#register-password")).value;

    return {
      email: email,
      password: password
    };
  }

  validateFormData(): boolean {
    const email = (<HTMLInputElement>this.renderer.selectRootElement("#register-email")).value;
    const password = (<HTMLInputElement>this.renderer.selectRootElement("#register-password")).value;
    const repeatPassword = (<HTMLInputElement>this.renderer.selectRootElement("#register-repeat-password")).value;

    if (email.length === 0 || password.length === 0) {
      this.toastrService.error("Invalid data provided!", '', {
        positionClass: 'toast-top-left'
      });

      return false;
    }

    if (!email.includes("@")) {
      this.toastrService.error("Invalid email provided!", '', {
        positionClass: 'toast-top-left'
      });

      return false;
    }

    if (password !== repeatPassword) {
      this.toastrService.error("The two passwords must match!", '', {
        positionClass: 'toast-top-left'
      });

      return false;
    }

    return true;
  }

  register() {
    if (!this.validateFormData()) {
      return;
    }

    this.toastrService.clear();

    this.authenticationService.register(this.getUserDataFromForm()).subscribe({
      next: () => {
        this.toastrService.success("Successfully signed up", "", {
          positionClass: 'toast-top-left'
        });
        this.router.navigate(['']);
      },
      error: () => {
        this.toastrService.error("Couldn't register as a new user.", "Sign up error", {
          positionClass: 'toast-top-left'
        });
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['']);
  }
}
