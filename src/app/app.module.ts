import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { RoutingModule } from './routing.module';
import { ShortenPipe } from './Pipes/shorten.pipe';
import { ManagerComponent } from './Components/manager/manager.component';
import { EmployeeComponent } from './Components/employee/employee.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertModule } from 'ngx-bootstrap/alert';
import { GroupComponent } from './Components/group/group.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GroupmodalComponent } from './Components/groupmodal/groupmodal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ShortenPipe,
    ManagerComponent,
    EmployeeComponent,
    GroupComponent,
    GroupmodalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    RoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    AlertModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
