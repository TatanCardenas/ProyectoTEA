import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioDocente } from 'src/app/_model/UsuarioDocente';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import CryptoJS from "crypto-js";
import { UsuarioAcudiente } from 'src/app/_model/UsuarioAcudiente';
import { UsuarioPaciente } from 'src/app/_model/UsuarioPaciente';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  private datosDocente = new UsuarioDocente;
  private datosAcudiente = new UsuarioAcudiente;
  private datosPaciente = new UsuarioPaciente;
  public nombre: String;
  private clave: String;
  hide = true;
  public id_rol;
  private id_rol_descrypt: string;
  private id_document_descrypt: string;


  public formNombreApellido = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3), Validators.pattern(/[A-Za-z]/)]],
    apellido: ['', [Validators.required, Validators.minLength(4), , Validators.maxLength(20), Validators.pattern(/[A-Za-z]/)]],
  });
  public formAClave = this.formBuilder.group({
    clave_actual: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    clave: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
  });
  public formCorreo = this.formBuilder.group({
    correo: ['', [Validators.required, Validators.min(1), Validators.max(3), Validators.pattern(/[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}/)]],
  });
  public formGradoAutismoEdad = this.formBuilder.group({
    grado_autismo: ['', [Validators.required, Validators.min(1), Validators.max(3), Validators.pattern('[0-9]*')]],
    edad: ['', [Validators.required, Validators.min(6), Validators.max(11), Validators.pattern('[0-9]*')]],
  });

  constructor(private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private perfilRouter: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.datosToken();
    this.obtenerparametros();
    this.datos();
  }
  obtenerparametros() {
    //window.location.reload()
    this.perfilRouter.params.subscribe((parametros: Params) => {
      this.id_rol_descrypt = parametros['idRol'];
      this.id_document_descrypt = parametros['idDocumento'];
    })
    this.id_rol_descrypt = this.descodificarid(this.id_rol_descrypt, 'id_rol_crypt')
    this.id_rol = this.id_rol_descrypt;
    this.id_document_descrypt = this.descodificarid(this.id_document_descrypt, 'id_document_crypt')
  }
  //toma el id incriptado y con el nombre que se le asigno y lo desencripta
  descodificarid(crytJson, nombre_secret_key) {
    let id_decrypted = CryptoJS.AES.decrypt(crytJson, nombre_secret_key);
    id_decrypted = JSON.parse(id_decrypted.toString(CryptoJS.enc.Utf8));
    return id_decrypted;
  }

  datos() {
    switch (parseInt(this.id_rol_descrypt)) {
      case 1:
        this.usuarioService.datosDocente(this.id_document_descrypt).subscribe(data => {
          this.datosDocente = data;
          this.nombre = this.datosDocente.nombre;
          this.fomularioNombreApellido(this.datosDocente)
          this.fomularioCorreo(this.datosDocente)
        });
        break;
      case 2:
        this.usuarioService.datosAcudiente(this.id_document_descrypt).subscribe(data => {
          this.datosAcudiente = data;
          this.nombre = this.datosAcudiente.nombre;
          this.fomularioNombreApellido(this.datosAcudiente)
          this.fomularioCorreo(this.datosAcudiente)
        });
        break;
      case 3:
        this.usuarioService.datosPaciente(this.id_document_descrypt).subscribe(data => {
          this.datosPaciente = data;
          this.nombre = this.datosPaciente.nombre;
          this.fomularioNombreApellido(this.datosPaciente)
          this.fomularioGradoAutismoEdad(this.datosPaciente);
        });
        break;
    }
  }

  private fomularioNombreApellido(usuario: any) {
    this.formNombreApellido = this.formBuilder.group({
      nombre: [usuario.nombre, [Validators.required, Validators.maxLength(20), Validators.minLength(3), Validators.pattern(/[a-zA-Z]/)]],
      apellido: [usuario.apellido, [Validators.required, Validators.minLength(4), , Validators.maxLength(20), Validators.pattern(/[A-Za-z]/)]],
    });
  }
  private fomularioCorreo(usuario: any) {
    this.formCorreo = this.formBuilder.group({
      correo: [usuario.correo, [Validators.required, Validators.min(1), Validators.max(3), Validators.pattern(/[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}/)]],
    });
  }
  private fomularioGradoAutismoEdad(usuario: any) {
    this.formGradoAutismoEdad = this.formBuilder.group({
      grado_autismo: [usuario.grado_autismo, [Validators.required, Validators.min(1), Validators.max(3), Validators.pattern('[0-9]*')]],
      edad: [usuario.edad, [Validators.required, Validators.min(2), Validators.max(10), Validators.pattern('[0-9]*')]],
    });
  }

  public actualizarDatos(id_formulario) {
    switch (parseInt(id_formulario)) {
      //actualizar nombre y apellido
      case 1:
        this.tipoDeRolActualizar(this.id_rol_descrypt, this.formNombreApellido.value)
        break;
      //actualizar contraseña
      case 2:
        this.tipoDeRolActualizar(this.id_rol_descrypt, this.formAClave.value)
        break;
      //actualizar correo
      case 3:
        console.log(id_formulario)
        this.tipoDeRolActualizar(this.id_rol_descrypt, this.formCorreo.value)
        break;
      //actualizar grado de autismo y edad
      case 4:
        this.tipoDeRolActualizar(this.id_rol_descrypt, this.formGradoAutismoEdad.value)
        break;
    }
  }
  async tipoDeRolActualizar(rol, datos) : Promise<void> {
    switch (parseInt(rol)) {
      case 1:
        let docente = new UsuarioDocente;
        docente = datos
        docente.documento = this.id_document_descrypt;
        this.usuarioService.putActulizarDocente(docente).subscribe(data => {
          console.log(data);
          this.openSnackBar(data);
        })
        break;
      case 2:
        let acudiente = new UsuarioAcudiente;
        acudiente = datos
        acudiente.documento = this.id_document_descrypt;
        this.usuarioService.putActulizarAcudiente(acudiente).subscribe(data => {
          this.openSnackBar(data);
        })
        break;
      case 3:
        let paciente = new UsuarioPaciente;
        paciente = datos
        paciente.documento = this.id_document_descrypt;
        this.usuarioService.putActulizarpaciente(paciente).subscribe(data => {
          this.openSnackBar(data);
        })
        break;
    }
    await this.delay(1000);
    window.location.reload();
  }

  private openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Aceptar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  datosToken() {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    /*this.u = decodedToken.Usuario;
    console.log(this.user)*/
  }

}
