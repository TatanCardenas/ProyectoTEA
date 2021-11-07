import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../_model/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url : string = `${environment.HOST}/users`;

  constructor(private http: HttpClient) { }

  //PostUserAcudiente
  public registrarUser(user: Usuario){
    return this.http.post(`${this.url}/PostUserAcudiente`,user);
  }
}
