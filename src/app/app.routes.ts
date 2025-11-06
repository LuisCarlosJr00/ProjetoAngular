import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { ListUserComponent } from './components/list-user/list-user.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'list', component: ListUserComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'register/:id', component: RegisterComponent },
    { path: '**', redirectTo: '' }
];
