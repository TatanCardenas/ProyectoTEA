import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Actividad } from 'src/app/_model/Actividad';
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
  displayedColumns: string[] = ['Nombre Paciente', 'Apellido Paciente', 'Grado Autismo','Edad','Eliminar Enlace'];

  constructor(private serviceActividad:ActividadService,) { }

  async ngOnInit(): Promise<void> {
    this.datos();
    await this.delay(1000)
    this.listDeActividades(this.usuario.numero_documento.toString())
  }

  listDeActividades(documentoDocente:string){
    this.serviceActividad.getListaActividades(documentoDocente).subscribe(data=>{
      this.actividadesLista= data;
    })
  }
  actividadSeleccionada(Id_actividad){
    console.log(""+Id_actividad);
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

}
