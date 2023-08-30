import { Component,OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { AbstractControl, FormControl, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormValidatorService } from '../../utils/form-validator.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit
{

  userNameError:string = '';
  passwordError:string = '';

  constructor(private authService:AuthServiceService,
    private router: Router,
    private formValidatorService:FormValidatorService,
    private cookieService: CookieService){}

  loginForm = new FormGroup({
    username :new FormControl('',Validators.required),
    password :new FormControl('',Validators.required),
  });

  ngOnInit(): void 
  {
    this.authService.ValidateUser().subscribe((res:any)=>{
      this.authService.SetUserId(res.userId); 
      this.router.navigate(['/profile']);
    },(error)=>{
    });
  }

  OnLoginSubmit()
  {
    this.userNameError = '';
    this.passwordError = '';
    if(this.loginForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.loginForm);
      if(this.loginForm.value.username === '') this.userNameError = 'Please Enter username';
      if(this.loginForm.value.password === '')  this.passwordError = 'Please Enter password';
      return;
    }
    const formData = this.loginForm.value;
    this.authService.UserLogin(formData).subscribe((res:any)=>{
      console.log(res);
      if(res.token)
      {
        this.cookieService.set("token",res.token);
        this.router.navigate(['/profile']);
      }
    },(error)=>{
      console.log(error.error);
      if(error.error.field === 'password')
      {
        this.passwordError = "Invalid password."
      }
      if(error.error.field === 'username')
      {
        this.userNameError = "Invalid username."
      }
    });    
  }

  isInvalidfield(control: AbstractControl | null, additionalCondition: boolean): boolean {
    return (control?.invalid && (control?.touched || control?.dirty)) || additionalCondition;
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }

}
