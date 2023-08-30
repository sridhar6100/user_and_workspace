import { Component,OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent implements OnInit
{
  adminProfile:any;


  constructor(
    private authService:AuthServiceService,
    private router:Router,
    private cookieService: CookieService,
    private location: Location,
    )
  {
  }
  
  ngOnInit(): void 
  {
    this.authService.ValidateAdminUser().subscribe((res:any)=>{
      this.GetProfile(res.userId);
    },(error)=>{
    });
  }

  GetProfile(userId:string)
  {
    this.authService.AdminProfile(userId).subscribe((res:any)=>{
      this.adminProfile = res;
    },(error)=>{
      console.log(error);
    });   
  }

  OnLogout()
  {
    this.cookieService.delete('admintoken');
    if(!this.cookieService.check('admintoken'))
    {
      this.authService.SetUserId(null);
      this.router.navigate(['/admin','login']);
      this.location.replaceState('/admin');
    }
  }
}
