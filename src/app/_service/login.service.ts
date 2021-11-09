import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserLogin } from '../_model/UserLogin';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

 public paginaReactiva: Subject<boolean>;
 private Usuario = new UserLogin;
 private url: string = `${environment.HOST}login`;
 //http://localhost:60602/api/login/PostIngresoLogin
  constructor(private http: HttpClient,
    private router: Router) { }

  public login(user: UserLogin) {
    //const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(password)}`;
    return this.http.post<any>(`${this.url}/PostIngresoLogin`, user);

  }
}
