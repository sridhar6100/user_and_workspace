import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService 
{

  userId:any = null;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient,private cookieService: CookieService) {
  }

  UserLogin(formData: any) {
    return this.http.post(environment.apiUrl + "auth/user/login", formData, {
      headers: this.headers,
      withCredentials: true
    });
  }


  UserProfile(_id:any)
  {
    return this.http.get(environment.apiUrl+"auth/user/profile/"+_id, {
      headers: this.headers,
      withCredentials: true
    });
  }


  AdminLogin(formData: any) {
    return this.http.post(environment.apiUrl + "auth/admin/login", formData, {
      headers: this.headers,
      withCredentials: true
    });
  }

  AdminLogout()
  {
    return this.http.post(environment.apiUrl+"auth/admin/logout",{}, {
      withCredentials: true
    })
  }

  AdminProfile(_id:any)
  {
    return this.http.get(environment.apiUrl+"auth/admin/profile/"+_id, {
      headers: this.headers,
      withCredentials: true
    });
  }

  GetUserId()
  {
    return this.userId;
  }

  SetUserId(userId:any)
  {
    this.userId = userId;
  }

  ValidateUser()
  {
    const token = this.cookieService.get("token");
    return this.http.get(environment.apiUrl+"validatetoken/"+token);
  }
  ValidateAdminUser()
  {
    const token = this.cookieService.get("admintoken");
    return this.http.get(environment.apiUrl+"validatetoken/"+token);
  }


  isUserAuthenticated(): boolean {
    
    return this.cookieService.check('token');
  }
  isAdminAuthenticated(): boolean {
    
    return this.cookieService.check('admintoken');
  }
}
