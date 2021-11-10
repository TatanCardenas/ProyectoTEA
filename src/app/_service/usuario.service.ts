import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../_model/Usuario';
import { Subject } from 'rxjs';
import { UsuarioAcudiente } from '../_model/UsuarioAcudiente';
import { UsuarioDocente } from '../_model/UsuarioDocente';
import { UsuarioPaciente } from '../_model/UsuarioPaciente';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url : string = `${environment.HOST}users`;
  tipoU= new Subject<boolean>();

  constructor(private http: HttpClient) { }

  //Registro Acudiente, Docente y Niño
  public registrarAcudiente(user: UsuarioAcudiente){
    return this.http.post<any>(`${this.url}/PostAgregarAcudiente`,user);
  }
  public registrarDocente(user: UsuarioDocente){
    return this.http.post(`${this.url}/PostAgregarDocente`,user);
  }
  public registrarPaciente(user: UsuarioPaciente){
    return this.http.post(`${this.url}/PostAgregarPaciente`,user);
  }
  public datosDocente(documento: string){
    return this.http.get<UsuarioDocente>(`${this.url}/GetDatosDocente?cedulaE=${documento}`);
  }

}
