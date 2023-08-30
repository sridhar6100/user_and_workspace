import { Component,OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { AbstractControl, FormControl, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormValidatorService } from '../../utils/form-validator.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit
{
  userNameError:string = '';
  passwordError:string = '';

  constructor(private authServiceService:AuthServiceService,
    private router: Router,
    private formValidatorService:FormValidatorService,
    private cookieService: CookieService){}

  loginForm = new FormGroup({
    username :new FormControl('',Validators.required),
    password :new FormControl('',Validators.required),
  });

  ngOnInit(): void 
  {
    this.authServiceService.ValidateUser().subscribe((res:any)=>{
      this.authServiceService.SetUserId(res.userId); 
      this.router.navigate(['/admin','dashboard']);
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
    this.authServiceService.AdminLogin(formData).subscribe((res:any)=>{
      console.log(res);
      if(res.token)
      {
        this.cookieService.set("admintoken",res.token);
        this.router.navigate(['/admin','dashboard']);
      }
    },(error)=>{
      console.log(error);
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
