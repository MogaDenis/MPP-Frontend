import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

export const configuration: any = {
  apiBaseUrl: "https://localhost:7013/api/",
  routes: {
    cars: "Cars",
    owners: "Owners",
    login: "Login",
    register: "Register"
  }
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
