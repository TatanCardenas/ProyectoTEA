import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Actividad } from 'src/app/_model/Actividad';
import { Usuario } from 'src/app/_model/Usuario';
import { UsuarioPaciente } from 'src/app/_model/UsuarioPaciente';
import { ActividadService } from 'src/app/_service/actividad.service';
import { PacienteService } from 'src/app/_service/paciente.service';
import { environment } from 'src/environments/environment';

interface listaActividades {
  value: string;
  actividad_tp: string;
}

@Component({
  selector: 'app-panel-actividades',
  templateUrl: './panel-actividades.component.html',
  styleUrls: ['./panel-actividades.component.css']
})
export class PanelActividadesComponent implements OnInit {

  
  public actividadesLista:Actividad[];

  public pacienteDatos= new UsuarioPaciente();
  public usuario= new Usuario();


  constructor(private router: Router,
    private serviceActividad:ActividadService,
    private servicePaciente:PacienteService) { }

  async ngOnInit(): Promise<void> {
    await this.delay(2000);
    this.datos();
    if(this.usuario.tipo_usuario_id==1){
      this.listDeActividades(this.usuario.numero_documento.toString())
    }else{
      this.servicePaciente.getDatosPaciente(this.usuario.numero_documento.toString()).subscribe(data=>{
        this.pacienteDatos = data;
      })
      await this.delay(2000);
      this.listDeActividades(this.pacienteDatos.documento_docente)
    }
  }

  actividadSeleccionada(Id_actividad){
    console.log("redireccion"+Id_actividad)

  }

  listDeActividades(documentoDocente:string){
    this.serviceActividad.getListaActividades(documentoDocente).subscribe(data=>{
      this.actividadesLista= data;
    })
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
