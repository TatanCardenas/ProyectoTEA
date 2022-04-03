import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserLogin } from '../_model/UserLogin';
import { User } from '../_model/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  paginaReactiva = new Subject<boolean>();
  private Usuario = new UserLogin;
  private url: string = `${environment.HOST}login`;
  //http://localhost:60602/api/login/PostIngresoLogin
  constructor(private http: HttpClient,
    private router: Router) { }

  public login(user: UserLogin) {
    //const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(password)}`;
    return this.http.post<any>(`${this.url}/PostIngresoLogin`, user);

  }

  public cerrarSesion(user: User) {
    const tk = sessionStorage.getItem(environment.TOKEN);
    sessionStorage.removeItem(environment.TOKEN);
    this.http.post<any>(`${this.url}/PostCerrarSesion`,user).subscribe(data => {
      sessionStorage.clear();
      this.paginaReactiva.next(true);
      console.log("Sesion cerrada correctamente.")
      this.router.navigate(['login']);
    });
  }

  public estaLogueado(): boolean {
    const tk = sessionStorage.getItem(environment.TOKEN);
    return tk != null;
  }
}
