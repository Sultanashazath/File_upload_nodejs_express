import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserProfileComponent } from './user-profile/user-profile/user-profile.component';

import { AuthGuard } from './auth/auth.guard'
import { UserService } from './shared/user.service';
import { AuthInterceptor } from './auth/auth.interceptor'
const routes: Routes =[
  {
    path:'signup', component: UserComponent,
    children: [{path:'', component: SignUpComponent}]
  }, 
  {
    path:'login', component: UserComponent,
    children: [{path:'', component: SignInComponent}]
  },
  {
    path:'userprofile', component: UserProfileComponent,canActivate:[AuthGuard]
  },
  {
    path: '',redirectTo:'/login', pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SignUpComponent,
    SignInComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },AuthGuard,UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
