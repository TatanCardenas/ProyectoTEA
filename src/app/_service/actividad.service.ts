import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Actividad } from '../_model/Actividad';
import { PacienteScoreJSon } from '../_model/PacienteScoreJSon';
import { EvaluacionInicial } from '../_model/EvaluacionInicial';
import { TypeActivity } from '../_model/TypeActivity';
import { UsuarioPaciente } from '../_model/UsuarioPaciente';

@Injectable({
  providedIn: 'root',
})
export class ActividadService {
  paginaReactiva = new Subject<boolean>();
  private url: string = `${environment.HOST}actividades`;
  header: any;
  //http://localhost:60602/api/actividades

  constructor(private http: HttpClient, private router: Router) {}

    getListaActividades(id_rol:number,id_card:string){
      return this.http.get<Actividad[]>(`${this.url}/GetListaActividades/${id_rol}/${id_card}`);
    }

  //ejemplo lista
  getEvaluacionInicialCiencias() {
    return this.http.get<EvaluacionInicial[]>(`${this.url}/GetEvaluacionInicialCiencias/`);
  }

  //ejemplo lista
  getEvaluacionInicialMatematicas() {
    return this.http.get<EvaluacionInicial[]>(`${this.url}/GetEvaluacionInicialMatematicas/`);
  }

  //ejemplo lista
  getEvaluacionInicialComunicacion() {
    return this.http.get<EvaluacionInicial[]>(`${this.url}/GetEvaluacionInicialComunicacion/`);
  }

  //ejemplo lista
  /*getEvaluacionInicialHabilidadesCiudadanas() {
    return this.http.get<EvaluacionInicial[]>(`${this.url}/GetEjemploLista/`);
  }*/

  //ejemplo lista
  /*getEvaluacionInicialHabilidadesSociales() {
    return this.http.get<EvaluacionInicial[]>(`${this.url}/GetEjemploLista/`);
  }*/

  postAgregarActividad(actividadNueva: Actividad) {
    return this.http.post<any>(
      `${this.url}/PostAgregarActividad`,
      actividadNueva
    );
  }

  deleteElminarActividad(id_actividad: string) {
    console.log('id service ' + id_actividad);
    return this.http.delete<any>(`${this.url}/DeleteActividad/` + id_actividad);
  }

  getActivityId(activity_Id: number) {
    return this.http.get<any>(`${this.url}/GetActivityPerId/` + activity_Id);
  }

  getTypeActivity() {
    return this.http.get<TypeActivity[]>(`${this.url}/GetTypeActivity`);
  }
  putActividadRealizada(actividadActualizar: Actividad) {
    return this.http.put<TypeActivity[]>(
      `${this.url}/PutActividadEstudiante`,
      actividadActualizar
    );
  }
  getGetAcivitysMakedByPatientForTeacher(id_activity,id_card_teacher){
    return this.http.get<UsuarioPaciente[]>(`${this.url}/GetAcivitysMakedByPatientForTeacher/${id_activity}/${id_card_teacher}`);
  }
  getGetAcivitysMakedByPatientForAttendant(id_activity,id_card_attendant){
    return this.http.get<UsuarioPaciente[]>(`${this.url}/GetAcivitysMakedByPatientForAttendant/${id_activity}/${id_card_attendant}`);
  }
}
