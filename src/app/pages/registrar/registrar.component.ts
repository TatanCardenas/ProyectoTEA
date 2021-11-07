import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/_model/Usuario';
import { UsuarioService } from 'src/app/_service/usuario.service'
@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  private datosUser = new Usuario;
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.datosUser.nombre_usuario = "Tatan";
    this.datosUser.apellido_usuario = "Cardenas";
    this.datosUser.numero_documento = "100356560928";
    this.datosUser.clave_usuario = "123456789";
    this.datosUser.tipo_usuario_id = 1;
    this.usuarioService.registrarUser(this.datosUser).subscribe( data =>{
      console.log(data);
    })
  }

}
