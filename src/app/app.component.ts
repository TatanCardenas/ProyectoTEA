import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import CryptoJS from "crypto-js";
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserLogin } from './_model/UserLogin';
import { LoginService } from './_service/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioService } from './_service/usuario.service';
import { UsuarioDocente } from './_model/UsuarioDocente';
import { User } from './_model/User';
import { UsuarioAcudiente } from './_model/UsuarioAcudiente';
import { UsuarioPaciente } from './_model/UsuarioPaciente';
import { Router } from '@angular/router';

interface Registro {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ProyectoTEAA';
  public flagSesion: boolean = false;
  selectedValue: string;
  public usuario: String;
  private idUser: String;
  public rol: number;
  private user = new User();
  public flagRol: boolean = false;
  private usuarioDocente = new UsuarioDocente();
  private usuarioAcudiente = new UsuarioAcudiente();
  private usuarioPaciente = new UsuarioPaciente();
  private idRol_crypt: string;
  private idDocumet_crypt: string;


  registros: Registro[] = [
    { value: '1', viewValue: 'Como Docente' },
    { value: '2', viewValue: 'Como Acudiente' },
    { value: '3', viewValue: 'Como niño' },
  ];

  constructor(
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    //this.usuario();
    this.datos();
    this.loginService.paginaReactiva.subscribe((data) => {
      this.datos();
      //console.log()
    });
  }
  datos() {
    this.flagSesion = this.loginService.estaLogueado();
    this.flagRol = false;
    if (this.flagSesion == true) {
      const helper = new JwtHelperService();
      let token = sessionStorage.getItem(environment.TOKEN);
      const decodedToken = helper.decodeToken(token);
      this.rol = decodedToken.Rol;
      const user: string = decodedToken.Usuario;
      //this.flagRol = true;

      switch (this.rol.toString()) {
        case "1":
          this.usuarioService.datosDocente(user).subscribe((data) => {
            this.usuarioDocente = data;
            this.ingresoUsuario(this.usuarioDocente);
          })
          break;
        case "2":
          this.usuarioService.datosAcudiente(user).subscribe((data) => {
            this.usuarioAcudiente = data;
            this.ingresoUsuario(this.usuarioAcudiente);
          });
          break;
        case "3":
          this.usuarioService.datosPaciente(user).subscribe((data) => {
            this.usuarioPaciente = data;
            this.ingresoUsuario(this.usuarioPaciente);
          });
          break;
      }
    }
  }

  ingresoUsuario(usuarioIngreso: any) {
    this.usuario = usuarioIngreso.nombre;
    this.idUser = usuarioIngreso.documento;
    this.flagRol = true;
  }

  cerrarSession() {
    this.user.usuario = this.idUser;
    this.usuario = null;
    this.loginService.cerrarSesion(this.user);
    this.ngOnInit();
  }

  enviarRegistro(tipoDeRegistro) {
    window.location.href = 'registro/' + tipoDeRegistro;
  }

  perfil() {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    const documento: string = decodedToken.Usuario;
    do {
      this.idRol_crypt = CryptoJS.AES.encrypt(JSON.stringify(this.rol), 'id_rol_crypt').toString();
    } while (this.idRol_crypt.includes('/'))
    do {
      this.idDocumet_crypt = CryptoJS.AES.encrypt(JSON.stringify(documento), 'id_document_crypt').toString();
    } while (this.idDocumet_crypt.includes('/'))
    this.router.navigate(['perfil/' + this.idRol_crypt + '/' + this.idDocumet_crypt]);
  }

}
