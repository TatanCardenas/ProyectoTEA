import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioDocente } from 'src/app/_model/UsuarioDocente';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: String;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  public usuarioDocente = new UsuarioDocente;
  private datosDocente = new UsuarioDocente;
  public nombre: String;
  public form: FormGroup;
  constructor(private usuarioService: UsuarioService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.datos();
    this.formDocente();
  }

  datos(){
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    //this.rol = decodedToken.Rol;
    const user: string = decodedToken.Usuario;
    this.usuarioService.datosDocente(user).subscribe(data =>{
      this.usuarioDocente = data;
      this.datosDocente = data;
      this.nombre = this.usuarioDocente.nombre_docente;
      console.log("Hola: "+ this.nombre);
      this.formDocente();
    });
  }

  private formDocente() {
    
    this.form = this.formBuilder.group({
      
      nombre_docente: [this.datosDocente.nombre_docente, [Validators.required,Validators.maxLength(20), Validators.minLength(3),Validators.pattern(/[A-Za-z]/)]],
      apellido_docente: [this.datosDocente.apellido_docente, [Validators.required,Validators.minLength(4),, Validators.maxLength(20), Validators.pattern(/[A-Za-z]/)]],
      cedula: [this.datosDocente.cedula, [Validators.required, Validators.minLength(6), Validators.maxLength(11), Validators.pattern(/[0-9]/)]],
      correo: [this.datosDocente.correo, [Validators.required, Validators.pattern(/[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}/)]],
      nit: [this.datosDocente.nit, [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern(/[0-9]/)]],
    });
  }

  
 /*  tiles: Tile[] = [
    {text: 'Foto', cols: 1, rows: 2, color: 'lightblue'},
    {text:  , cols: 3, rows: 5, color: '#ECEBDF'},
    
  ]; */

}
