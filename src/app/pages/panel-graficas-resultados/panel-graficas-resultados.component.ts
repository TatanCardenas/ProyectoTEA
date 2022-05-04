import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import CryptoJS from "crypto-js";
import { ActivatedRoute, Params } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/app/_model/Usuario';
import { ActividadService } from 'src/app/_service/actividad.service';
import { DatePipe } from '@angular/common'
import { UsuarioService } from 'src/app/_service/usuario.service';
import { UsuarioPaciente } from 'src/app/_model/UsuarioPaciente';
import { Actividad } from 'src/app/_model/Actividad';

@Component({
  selector: 'app-panel-graficas-resultados',
  templateUrl: './panel-graficas-resultados.component.html',
  styleUrls: ['./panel-graficas-resultados.component.css']
})
export class PanelGraficasResultadosComponent {
  private id_actividad_crypted;
  private id_estudiante_crypted;
  private scoreArray= [];
  public promedioActividad=0;
  public fecha_Hoy;
  private dateDidActivity =[];
  public usuario= new Usuario();
  public chartOptions: any;
  public usuarioPaciente: UsuarioPaciente;
  public actividadInfo: Actividad;


  /** Based on the screen size, switch from standard to one column per row */
  Highcharts: typeof Highcharts = Highcharts;
  constructor(private actividadRouter:ActivatedRoute,
    private serviceActivity:ActividadService, 
    private usuarioService:UsuarioService,
    private actividadService:ActividadService) { }

  async ngOnInit(): Promise<void> {
    this.datos();
    this.obtenerparametros();
    this.patientInfo();
    this.activityInfo();
    this.serviceActivity.getResulActivity(this.id_actividad_crypted,this.id_estudiante_crypted).subscribe(data=>{
      data.sort((a, b) => (new Date(a.FechaRealizacion.toString()).getTime()- (new Date(b.FechaRealizacion.toString()).getTime())));
      for(let i=0; i<data.length;i++){
        this.scoreArray.push(parseInt(data[i].Score.toString()))
        this.dateDidActivity.push(new Date(data[i].FechaRealizacion.toString()).toLocaleDateString())
        console.log(data[i].Score.toString());
        this.promedioActividad += parseInt(data[i].Score.toString());
      }
      this.promedioActividad = this.promedioActividad/data.length;
      this.fecha_Hoy = new Date(data[data.length-1].FechaRealizacion.toString()).toLocaleDateString();
      this.fillFirstGhrap(this.scoreArray,this.dateDidActivity);
    })
  }
  patientInfo(){
    this.usuarioService.datosPaciente(this.id_estudiante_crypted).subscribe(data=>{
      this.usuarioPaciente = data;
    });
  }
  activityInfo(){
    this.actividadService.getActivityId(this.id_actividad_crypted).subscribe(data=>{
      console.log(data)
      this.actividadInfo = data;
    })
  }
  //permite llenar el primer grafico
  fillFirstGhrap(Score,date){
    this.chartOptions = {
      //Titulo del grafico
      title: {
        text: 'Resultados'
      },
      //Para quitar lo creditos de la parte de abajo
      credits: {
        enabled: false
      },
      //Permite colocar los valores de la parte baja del ejex 
      xAxis: {
        categories: date
      },
      //Coloca el titulo del eje Y
      yAxis: {
        title: {
            text: 'Puntaje'
        },
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },
      //Información de los datos que estan dentro del grafico
      series: [
        {
          name: 'Progreso',
          data: Score
        }
      ],
    }
  }

  // En este metodo se obtiene los 2 parametros incriptados de la URL
  obtenerparametros(){
    this.actividadRouter.params.subscribe((parametros:Params) =>{
      this.id_actividad_crypted = parametros['idActividad'];
      this.id_estudiante_crypted = parametros['idEstudiante'];
    })
    this.id_actividad_crypted = this.descodificarid(this.id_actividad_crypted,'secret_id_actividad')
    this.id_estudiante_crypted = this.descodificarid(this.id_estudiante_crypted,'secret_id_estudiante');
  }
  //toma el id incriptado y con el nombre que se le asigno y lo desencripta
  descodificarid(crytJson,nombre_secret_key){
    let id_decrypted=CryptoJS.AES.decrypt(crytJson,nombre_secret_key);
    id_decrypted=JSON.parse(id_decrypted.toString(CryptoJS.enc.Utf8));
    return id_decrypted;
  }
  datos(){
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    this.usuario.numero_documento = decodedToken.Usuario;
    this.usuario.tipo_usuario_id= decodedToken.Rol;
  }

}