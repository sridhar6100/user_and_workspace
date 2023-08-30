import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {}

  GetUsers() {
    return this.http.get(environment.apiUrl + "users", {
      headers: this.headers,
      withCredentials: true,
    });
  }

  GetUser(_id:any) {
    return this.http.get(environment.apiUrl + "users/"+_id, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  CreateUser(formData:any) {
    return this.http.post(environment.apiUrl + "users",formData, {
      withCredentials: true,
    });
  }

  UpdateUser(_id:any,formData:any) {
    return this.http.put(environment.apiUrl + "users/"+_id,formData, {
      withCredentials: true,
    });
  }

  DeleteUser(_id:any) {
    return this.http.delete(environment.apiUrl + "users/"+_id, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
