import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers:[UserService]
})
export class SignUpComponent implements OnInit {

  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean;
  serverErrorMessage: String;

  constructor(private userService:UserService) { }
  // private gender: string[]=['Male','Female','Others'];

  ngOnInit() {
  }
  onSubmit(form: NgForm) {
   // console.log(form.value);
    
    this.userService.postUser(form.value).subscribe(
      res => {
        this.showSucessMessage = true;
        setTimeout(() => this.showSucessMessage = false,4000)
        this.resetForm(form)
      },
      err => {
        if(err.status === 422){
          this.serverErrorMessage = err.error.join('<br/>');  
        } 
        else 
          this.serverErrorMessage = 'Something went wrong.Please contact admin'
      }
    );
  }
  
  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      fullName:'',
      lastName:'',
      email:'',
      password:'',
      // gender:this.gender[0]
    };
    //console.log(this.userService.selectedUser);
    
    form.resetForm();
    this.serverErrorMessage = '';
  }


}
