import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NewsBenefitsComponent } from './components/news-benefits/news-benefits.component';
import { ExploreBrechoComponent } from './components/explore-brecho/explore-brecho.component';
import { CommunityTestimonialsComponent } from './components/community-testimonials/community-testimonials.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { ListUserComponent } from './components/list-user/list-user.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  declarations: [
     
  ],
  imports: [
    BrowserModule,
    //RouterModule.forRoot(routes),

    AppComponent,
    HomeComponent,
    RegisterComponent,
    ListUserComponent,
    NewsBenefitsComponent,
    ExploreBrechoComponent,
    CommunityTestimonialsComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {}