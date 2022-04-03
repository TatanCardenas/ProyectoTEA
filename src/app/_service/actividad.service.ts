import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Actividad } from '../_model/Actividad';
import { TypeActivity } from '../_model/TypeActivity';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  paginaReactiva = new Subject<boolean>();
  private url: string = `${environment.HOST}actividades`;
  header: any;
  //http://localhost:60602/api/actividades

  constructor(private http: HttpClient,
    private router: Router) { }

    getListaActividades(id_docente:string){
      return this.http.get<Actividad[]>(`${this.url}/GetListaActividades/`+id_docente);
    }

    postAgregarActividad(actividadNueva:Actividad){
      return this.http.post<any>(`${this.url}/PostAgregarActividad`, actividadNueva);
    }

    deleteElminarActividad(id_actividad:string){
      console.log("id service "+id_actividad)
      return this.http.delete<any>(`${this.url}/DeleteActividad/`+id_actividad);
    }

    getActivityId(activity_Id:number){
      return this.http.get<any>(`${this.url}/GetActivityPerId/`+activity_Id);
    }

    getTypeActivity(){
      return this.http.get<TypeActivity[]>(`${this.url}/GetTypeActivity`);
    }
    putActividadRealizada(actividadActualizar:Actividad){
      return this.http.put<TypeActivity[]>(`${this.url}/PutActividadEstudiante`,actividadActualizar);
    }
}
