import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Actividad } from 'src/app/_model/Actividad';
import { Usuario } from 'src/app/_model/Usuario';
import { UsuarioPaciente } from 'src/app/_model/UsuarioPaciente';
import { ActividadService } from 'src/app/_service/actividad.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { environment } from 'src/environments/environment';
import CryptoJS from "crypto-js";

@Component({
  selector: 'app-panel-actividades-imitacion',
  templateUrl: './panel-actividades-imitacion.component.html',
  styleUrls: ['./panel-actividades-imitacion.component.css']
})
export class PanelActividadesImitacionComponent implements OnInit {

  public actividadesLista:Actividad[];
  private idencrypted;
  public pacienteDatos= new UsuarioPaciente();
  public usuario= new Usuario();


  constructor(private router: Router,
    private serviceActividad:ActividadService,
    private serviceUsuario:UsuarioService) { }

  async ngOnInit(): Promise<void> {
    await this.delay(1000);
    this.datos();
    if(this.usuario.tipo_usuario_id==1){
      this.listDeActividades(this.usuario.numero_documento.toString())
    }else{
      this.serviceUsuario.datosPaciente(this.usuario.numero_documento.toString()).subscribe(data=>{
        
        this.pacienteDatos = data;
        this.listDeActividades(this.pacienteDatos.documento_docente)
      })
    }
  }
  actividadSeleccionada(Id_actividad){
    do{
      this.idencrypted = CryptoJS.AES.encrypt(JSON.stringify(Id_actividad), 'secret key').toString();
    }while(this.idencrypted.includes('/'))
    window.location.href = 'actividad/'+this.idencrypted;
  }

  listDeActividades(documentoDocente:string){
    this.serviceActividad.getListaActividades(this.usuario.tipo_usuario_id,documentoDocente).subscribe(data=>{
      console.log(data)
      this.actividadesLista= data.filter(x=>x.Tipo_actividad==1);
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
