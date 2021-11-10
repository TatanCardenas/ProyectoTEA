import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserLogin } from './_model/UserLogin';
import { LoginService } from './_service/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioService } from './_service/usuario.service';
import { UsuarioDocente } from './_model/UsuarioDocente';
import { User } from './_model/User';

interface Registro {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'ProyectoTEAA';
  public flagSesion: boolean = false;
  selectedValue: string;
  public usuario: String;
  private idUser: String;
  public rol: number;
  private user = new User;
  public flagRol: boolean = false;
  private usuarioDocente = new UsuarioDocente;
  
  registros: Registro[] = [
    {value: '1', viewValue: 'Como Docente'},
    {value: '2', viewValue: 'Como Acudiente'},
    {value: '3', viewValue: 'Como niño'}
  ];

  constructor(private loginService: LoginService,
              private usuarioService: UsuarioService){
  }

  ngOnInit():void{
    //this.usuario();
    this.datos();
    this.loginService.paginaReactiva.subscribe(data =>{
      this.datos();
      //console.log()
    });

  }
datos(){
  this.flagSesion = this.loginService.estaLogueado();
  this.flagRol = false;
  if(this.flagSesion == true){
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    this.rol = decodedToken.Rol;
    const user: string = decodedToken.Usuario;
    //this.flagRol = true;
    
    if(this.rol == 1){
      this.usuarioService.datosDocente(user).subscribe(data =>{
        this.usuarioDocente = data;
        this.usuario = this.usuarioDocente.nombre_docente;
        this.idUser = this.usuarioDocente.cedula;
        console.log("Hola: "+ this.usuarioDocente.nombre_docente);
        this.flagRol = true;
      });
    }else{
      if(this.rol == 2){
        return this.flagRol = true;
      }
    }
  }
}

  cerrarSession(){
    this.user.usuario = this.idUser;
    this.loginService.cerrarSesion(this.user);
  
  }
}
