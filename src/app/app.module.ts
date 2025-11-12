import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NewsBenefitsComponent } from './components/news-benefits/news-benefits.component';
import { ExploreBrechoComponent } from './components/explore-brecho/explore-brecho.component';
import { CommunityTestimonialsComponent } from './components/community-testimonials/community-testimonials.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewsBenefitsComponent,
    ExploreBrechoComponent,
    CommunityTestimonialsComponent
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
