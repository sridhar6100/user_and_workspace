import { Component,OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit
{

  userProfile:any;

  constructor(
    private authServiceService:AuthServiceService,
    private router:Router,
    private cookieService: CookieService,
    private location: Location,
    ){}

  ngOnInit(): void 
  {
    this.authServiceService.ValidateUser().subscribe((res:any)=>{
      this.authServiceService.SetUserId(res.userId);  
      this.GetProfile(res.userId);
    },(error)=>{
      console.log(error);
    });
  }

  GetProfile(userId:string)
  {
    this.authServiceService.UserProfile(userId).subscribe((res:any)=>{
      this.userProfile = res;
    },(error)=>{
      console.log(error);
    });   
  }

  OnLogout()
  {
    this.cookieService.delete('token');
    if(!this.cookieService.check('toke'))
    {
      this.authServiceService.SetUserId(null);
      this.router.navigate(['']);
      this.location.replaceState('');
    }
  }
}
