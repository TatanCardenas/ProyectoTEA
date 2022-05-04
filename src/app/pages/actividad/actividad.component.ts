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
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})
export class ActividadComponent implements OnInit {

  private id_activityencrypt: string;
  private id_decrypted: number;
  public id_tp_activity: number;
  public actividad: Actividad;
  private actividadRelizada: Actividad;
  private estudianteRealizador: PacienteScoreJSon;
  public usuario = new Usuario();

  public fraseADecir: String;
  constructor(public speech: SpeechService,
    private actividadRouter: ActivatedRoute,
    private serviceActivity: ActividadService,
    private snackBar: MatSnackBar,
    private router: Router) {
    this.speech.init();
  }

  async ngOnInit(): Promise<void> {
    this.datos();
    await this.delay(1000);
    this.actividadRouter.params.subscribe((parametros: Params) => {
      this.id_activityencrypt = parametros['idActividad'];
    })
    this.id_decrypted = CryptoJS.AES.decrypt(this.id_activityencrypt, 'secret key');
    this.id_decrypted = JSON.parse(this.id_decrypted.toString(CryptoJS.enc.Utf8));
    if (this.id_decrypted != 0) {
      this.serviceActivity.getActivityId(this.id_decrypted).subscribe(data => {
        this.actividad = data;
        this.fraseADecir = this.actividad.Contenido_actividad;
        this.id_tp_activity = this.actividad.Tipo_actividad;
      });
    } else {
      this.actividad = new Actividad();
      this.actividad.Tipo_actividad = 2;
    }
    await this.delay(1500);
    console.log("actividad ", this.actividad.Tipo_actividad)
  }


  enviarDatos() {
    console.log("aca esta", this.speech.text)
    console.log("aca esta2", typeof(this.speech.text))
    if (this.speech.text != "" && this.speech.text !== undefined &&this.speech.text != "undefined" &&this.speech.text != " ") {
      this.actividadRelizada = new Actividad();
      this.estudianteRealizador = new PacienteScoreJSon();
      this.serviceActivity.getScoreImitationActivity(this.fraseADecir, this.speech.text).subscribe(data => {
        this.actividadRelizada.Id_actividad = this.actividad.Id_actividad;
        this.estudianteRealizador.DocumentoPaciente = this.usuario.numero_documento;
        this.estudianteRealizador.Score = data;
        this.estudianteRealizador.FechaRealizacion = new Date();
        this.actividadRelizada.NuevoEstudiante = this.estudianteRealizador;
        console.log(this.actividadRelizada);
        console.log(data);
        this.serviceActivity.putActividadRealizada(this.actividadRelizada).subscribe(data => {
          this.openSnackBar("Hiciste la actividad con exito")
          this.router.navigate(['panelActividadesDeImitacion'])
        }, err => {
          console.log("", err)
        })
      })
    } else {
      this.openSnackBar("Primero realiza la actividad")
    }
  }
  reproducirPalabra(){
    //pone en pausa el video para que no exista interferencia de audios
    //carga libreria para reconocer textos
    var synth = window.speechSynthesis;
    //utiliza el texto para reproducirlo en voz
    var utterance = new SpeechSynthesisUtterance(this.fraseADecir.toString());
    synth.speak(utterance);
  }
  startService(): void {
    this.speech.text = '';
    this.speech.start();
    this.speech.error = false;
    this.openSnackBar("Tu respuesta se esta almacenando")
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  datos() {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    this.usuario.numero_documento = decodedToken.Usuario;
    this.usuario.tipo_usuario_id = decodedToken.Rol;
  }
  private openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Aceptar', {
      duration: 9000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
