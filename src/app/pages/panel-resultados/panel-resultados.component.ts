import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Actividad } from 'src/app/_model/Actividad';
import { PacienteScoreJSon } from 'src/app/_model/PacienteScoreJSon';
import { Usuario } from 'src/app/_model/Usuario';
import { UsuarioPaciente } from 'src/app/_model/UsuarioPaciente';
import { ActividadService } from 'src/app/_service/actividad.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-panel-resultados',
  templateUrl: './panel-resultados.component.html',
  styleUrls: ['./panel-resultados.component.css']
})
export class PanelResultadosComponent implements OnInit {

  public actividadesLista:Actividad[];
  public usuario= new Usuario();
  pacientesTabla = new MatTableDataSource<UsuarioPaciente>();
  displayedColumns: string[] = ['Nombre Paciente', 'Apellido Paciente', 'Grado Autismo','Edad','Reporte'];//['Nombre Paciente', 'Apellido Paciente', 'Grado Autismo','Edad','Reporte'];

  constructor(private serviceActividad:ActividadService,private snackBar: MatSnackBar,) { }

  async ngOnInit(): Promise<void> {
    this.datos();
    await this.delay(1000)
    this.listDeActividades(this.usuario.tipo_usuario_id, this.usuario.numero_documento.toString())
  }

  listDeActividades(id_rol:number,documento:string){
    this.serviceActividad.getListaActividades(id_rol,documento).subscribe(data=>{
      this.actividadesLista= data;
    }, err => {
      this.openSnackBar(err.error.Message);
    });
  }
  actividadSeleccionada(Id_actividad){
    if(this.usuario.tipo_usuario_id==1){
      this.serviceActividad.getGetAcivitysMakedByPatientForTeacher(Id_actividad,this.usuario.numero_documento)
      .subscribe(data=>{
        this.pacientesTabla = new MatTableDataSource(data);
      }, err => {
        this.pacientesTabla = null;
        this.openSnackBar(err.error.Message);
      })
    }else{
      this.serviceActividad.getGetAcivitysMakedByPatientForAttendant(Id_actividad,this.usuario.numero_documento)
      .subscribe(data=>{
        this.pacientesTabla = new MatTableDataSource(data);
        console.log("elegir",data)
      }, err => {
        this.pacientesTabla = null;
        this.openSnackBar(err.error.Message);
      });
    }
  }

  datos(){
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    this.usuario.numero_documento = decodedToken.Usuario;
    this.usuario.tipo_usuario_id= decodedToken.Rol;
  }

  private delay(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Aceptar', {
      duration: 8000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  } 

}
