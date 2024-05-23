import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatOption } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import IUser from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import IUserForLogin from '../../models/user-for-login.model';

export class LoginErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, FormsModule, MatFormField, MatInputModule,
    ReactiveFormsModule, MatSelect, MatOption, MatButtonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);

  matcher = new LoginErrorStateMatcher();

  constructor(private renderer: Renderer2, private router: Router, private toastrService: ToastrService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authenticationService.logout();
  }

  getUserDataFromForm(): IUserForLogin {
    const email = (<HTMLInputElement>this.renderer.selectRootElement("#login-email")).value;
    const password = (<HTMLInputElement>this.renderer.selectRootElement("#login-password")).value;

    return {
      email: email,
      password: password
    };
  }

  validateFormData(): boolean {
    const email = (<HTMLInputElement>this.renderer.selectRootElement("#login-email")).value;
    const password = (<HTMLInputElement>this.renderer.selectRootElement("#login-password")).value;

    if (email.length === 0 || password.length === 0) {
      return false;
    }

    return true;
  }

  login() {
    if (!this.validateFormData()) {
      this.toastrService.error("Invalid data provided!", '', {
        positionClass: 'toast-top-left'
      });

      return;
    }

    this.toastrService.clear();

    this.authenticationService.login(this.getUserDataFromForm()).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      }, 
      error: () => {
        this.toastrService.error("Invalid email or password.", "Login error", {
          positionClass: 'toast-top-left'
        })
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}