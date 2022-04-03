import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SpeechService } from 'src/app/_service/speech.service.service';
import CryptoJS from "crypto-js";
import { ActividadService } from 'src/app/_service/actividad.service';
import { Actividad } from 'src/app/_model/Actividad';
import { PacienteScoreJSon } from 'src/app/_model/PacienteScoreJSon';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/app/_model/Usuario';
@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})
export class ActividadComponent implements OnInit {

  private id_activityencrypt:string;
  private id_decrypted:number;
  public id_tp_activity:number;
  public actividad: Actividad;
  private actividadRelizada:Actividad;
  private estudianteRealizador:PacienteScoreJSon;
  public usuario= new Usuario();

  public fraseADecir: String;
  constructor(public speech: SpeechService,
    private actividadRouter:ActivatedRoute,
    private serviceActivity:ActividadService) {
    this.speech.init();
  }

  async ngOnInit(): Promise<void> {
    this.datos();
    await this.delay(1000);
    this.actividadRouter.params.subscribe((parametros:Params) =>{
      this.id_activityencrypt = parametros['idActividad'];
    })
    this.id_decrypted=CryptoJS.AES.decrypt(this.id_activityencrypt,'secret key');
    this.id_decrypted=JSON.parse(this.id_decrypted.toString(CryptoJS.enc.Utf8));
    console.log("Este es el id de la actividad "+this.id_decrypted);
    this.serviceActivity.getActivityId(this.id_decrypted).subscribe(data=>{
      this.actividad = data;
      this.fraseADecir = this.actividad.Contenido_actividad;
      this.id_tp_activity = this.actividad.Tipo_actividad; 
    });
    await this.delay(1500);
    console.log("actividad ",this.actividad.Tipo_actividad)
  }


  enviarDatos(){
    this.actividadRelizada= new Actividad();
    this.estudianteRealizador = new PacienteScoreJSon();
    this.actividadRelizada.Id_actividad=this.actividad.Id_actividad;
    this.estudianteRealizador.DocumentoPaciente=this.usuario.numero_documento;
    this.estudianteRealizador.Score=this.speech.score.toString();
    this.estudianteRealizador.fechaRealizacion = new Date();
    this.actividadRelizada.NuevoEstudiante = this.estudianteRealizador;
    console.log(this.actividadRelizada);
    this.serviceActivity.putActividadRealizada(this.actividadRelizada).subscribe(data=>{
      console.log("service",data)
    })
  }

  startService(): void {
    this.speech.text = '';
    this.speech.start(this.fraseADecir)
    this.speech.error = false;
  }

  private delay(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  datos(){
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    this.usuario.numero_documento = decodedToken.Usuario;
    this.usuario.tipo_usuario_id= decodedToken.Rol;
  }
}
