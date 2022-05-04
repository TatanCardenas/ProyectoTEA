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

  public datosAcudiente(documento: string){
    return this.http.get<UsuarioAcudiente>(`${this.url}/GetDatosAcudiente?cedulaE=${documento}`);
  }

  public datosPaciente(documento: string){
    return this.http.get<UsuarioPaciente>(`${this.url}/datosPaciente/${documento}`);
  }

  //    Se invocan los servicios de actualizar
  //Actualizar Docente 
  public putActulizarDocente(docenteNuevo:UsuarioDocente){
    return this.http.put<any>(`${this.url}/PutActualizarDatosDocente`,docenteNuevo);
  }

  //Actualizar Acudiente
  public putActulizarAcudiente(acudienteNuevo:UsuarioAcudiente){
    return this.http.put<any>(`${this.url}/PutActualizarDatosAcudiente`,acudienteNuevo);
  }

  //Actualizar Paciente
  public putActulizarpaciente(pacienteNuevo:UsuarioPaciente){
    return this.http.put<any>(`${this.url}/PutActualizarDatosPaciente`,pacienteNuevo);
  }
}
