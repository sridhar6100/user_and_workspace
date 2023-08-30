import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {}

  GetWorkspaces(query:string="") {
    return this.http.get(environment.apiUrl + "workspace?"+query, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  GetWorkspace(_id:any) {
    return this.http.get(environment.apiUrl + "workspace/"+_id, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  CreateWorkspace(formData:any) {
    return this.http.post(environment.apiUrl + "workspace",formData, {
      withCredentials: true,
    });
  }

  UpdateWorkspace(_id:any,formData:any) {
    return this.http.put(environment.apiUrl + "workspace/"+_id,formData, {
      withCredentials: true,
    });
  }

  DeleteWorkspace(_id:any) {
    return this.http.delete(environment.apiUrl + "workspace/"+_id, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
