import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { RegisterComponent } from './register/register';
import { LoginComponent } from './login/login';
import { CalendarioComponent } from './calendario/calendario';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'calendario', component: CalendarioComponent }
];

