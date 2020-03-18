import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import {RoutingModule} from './routing.module';
import { ShortenPipe } from './Pipes/shorten.pipe';
import { ManagerComponent } from './Components/manager/manager.component';
import { EmployeeComponent } from './Components/employee/employee.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ShortenPipe,
    ManagerComponent,
    EmployeeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    RoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
