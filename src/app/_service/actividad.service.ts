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
import { ResultadoEvaluacionInicial } from 'src/app/_model/ResultadoEvaluacionInicial';
import { ActividadPECS_Categorias } from '../_model/ActividadPECS_Categorias';
import { ActividadPECS_Imagenes } from '../_model/ActividadPECS_Imagenes';

@Injectable({
  providedIn: 'root',
})
export class ActividadService {
  paginaReactiva = new Subject<boolean>();
  private url: string = `${environment.HOST}actividades`;
  header: any;
  //http://localhost:60602/api/actividades

  constructor(private http: HttpClient, private router: Router) {}

  getListaActividades(id_rol: number, id_card: string) {
    return this.http.get<Actividad[]>(
      `${this.url}/GetListaActividades/${id_rol}/${id_card}`
    );
  }

  //ejemplo lista
  getEvaluacionInicialCiencias() {
    return this.http.get<EvaluacionInicial[]>(
      `${this.url}/GetEvaluacionInicialCiencias/`
    );
  }

  //ejemplo lista
  getEvaluacionInicialMatematicas() {
    return this.http.get<EvaluacionInicial[]>(
      `${this.url}/GetEvaluacionInicialMatematicas/`
    );
  }

  //ejemplo lista
  getEvaluacionInicialComunicacion() {
    return this.http.get<EvaluacionInicial[]>(
      `${this.url}/GetEvaluacionInicialComunicacion/`
    );
  }

  //ejemplo lista
  getEvaluacionInicialHabilidadesSociales() {
    return this.http.get<EvaluacionInicial[]>(
      `${this.url}/GetEvaluacionInicialHabilidadesSociales/`
    );
  }

  postAgregarActividad(actividadNueva: Actividad) {
    return this.http.post<any>(
      `${this.url}/PostAgregarActividad`,
      actividadNueva
    );
  }

  putActividad(id_actividad: string) {
    return this.http.delete<any>(
      `${this.url}/PutActividadDesActivar/` + id_actividad
    );
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
  getGetAcivitysMakedByPatientForTeacher(id_activity, id_card_teacher) {
    return this.http.get<UsuarioPaciente[]>(
      `${this.url}/GetAcivitysMakedByPatientForTeacher/${id_activity}/${id_card_teacher}`
    );
  }
  getGetAcivitysMakedByPatientForAttendant(id_activity, id_card_attendant) {
    return this.http.get<UsuarioPaciente[]>(
      `${this.url}/GetAcivitysMakedByPatientForAttendant/${id_activity}/${id_card_attendant}`
    );
  }

  getResulActivity(id_activity, id_card_patient) {
    return this.http.get<Array<PacienteScoreJSon>>(
      `${this.url}/GetResulActivity/${id_activity}/${id_card_patient}`
    );
  }

  getScoreImitationActivity(phrase_base: String, phrase_said: String) {
    phrase_base = phrase_base
      .replace(/[`~!@#$%^&*()_|+\-=?¡¿;:'",.<>\{\}\[\]\\\/]/gi, '')
      .replace(/ /g, '')
      .toLowerCase();
    phrase_said = phrase_said
      .replace(/[`~!@#$%^&*()_|+\-=?¡¿;:'",.<>\{\}\[\]\\\/]/gi, '')
      .replace(/ /g, '')
      .toLowerCase();
    return this.http.get<any>(
      `${this.url}/GetScoreImitationActivity/${phrase_base}/${phrase_said}`
    );
  }

  //guardar resultados actividad evaluacion inicial
  public postEnvioResultadosEvaluacionInicial(
    resultados: ResultadoEvaluacionInicial[]
  ) {
    return this.http.post<any>(
      `${this.url}/PostGuardarResultadosEvaluacionInicial`,
      resultados
    );
  }

  //PECS
  //obtener categorias segun estudiante-docente
  getCategoriasPECS(Id_docente: String, Id_estudiante: String) {
    return this.http.get<ActividadPECS_Categorias>(
      `${this.url}/GetCategoriaPECS/${Id_docente}/${Id_estudiante}`
    );
  }

  //obtener cantidad categorias segun estudiante-docente
  getCantidadCategoriasPECS(Id_docente: String, Id_estudiante: String) {
    return this.http.get<number>(
      `${this.url}/GetCantidadCategoriaPECS/${Id_docente}/${Id_estudiante}`
    );
  }

  //obtener imagenes segun estudiante-docente-actividadActual
  getImagenesPECS(
    Id_docente: String,
    Id_estudiante: String,
    actividadActual: number
  ) {
    return this.http.get<ActividadPECS_Imagenes>(
      `${this.url}/GetImagenesPECS/${Id_docente}/${Id_estudiante}/${actividadActual}`
    );
  }

  //actividades pecs activas
  getListaCategorias(id_docente: string) {
    return this.http.get<ActividadPECS_Categorias[]>(
      `${this.url}/GetCategoriaActivaPECS/${id_docente}`
    );
  }

  putCategoriaEstado(id_actividad: string) {
    return this.http.delete<any>(
      `${this.url}/PutCategoriaDesActivar/` + id_actividad
    );
  }

  postAgregarCategoria(categoriaNueva: ActividadPECS_Categorias) {
    return this.http.post<any>(
      `${this.url}/PostAgregarCategoria`,
      categoriaNueva
    );
  }

  postAgregarActividadPECS(actividadNueva: ActividadPECS_Imagenes) {
    return this.http.post<any>(
      `${this.url}/PostAgregarActividadImagenPECS`,
      actividadNueva
    );
  }

  //Obtener estudiantes que hicieron evaluuacion inicial
  getlistStudenEvaluation() {
    return this.http.get<any>(`${this.url}/GetListStudentEvaluation`);
  }
  //Obtener estudiantes que hicieron evaluuacion inicial
  getScoreStudenEvaluation(id_card_patient) {
    return this.http.get<ResultadoEvaluacionInicial[]>(
      `${this.url}/GetScoreStudenEvaluation/${id_card_patient}`
    );
  }
}
