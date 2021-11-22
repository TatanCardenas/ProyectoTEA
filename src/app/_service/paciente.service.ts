import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UsuarioPaciente } from '../_model/UsuarioPaciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private url: string = `${environment.HOST}paciente`;

  constructor(private http: HttpClient,
    private router: Router) { }

    public getPacientesPorEnlazar(id:number){
      return this.http.get<UsuarioPaciente[]>(`${this.url}/obtenerEstudiantesPorEnlazar/`+id);
    }
    public getPacientesEnlazados(id:number){
      return this.http.get<UsuarioPaciente[]>(`${this.url}/obtenerPacientesEnlazados/`+id);
    }
    public enlazarPaciente(pacienteAEnlazar:UsuarioPaciente){
      return this.http.put<any>(`${this.url}/enlazarConEstudiante`,pacienteAEnlazar);
    }
}
