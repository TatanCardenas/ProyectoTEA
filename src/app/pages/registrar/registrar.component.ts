import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioDocente } from 'src/app/_model/UsuarioDocente';
import { UsuarioAcudiente } from 'src/app/_model/UsuarioAcudiente';
import { UsuarioPaciente } from 'src/app/_model/UsuarioPaciente';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css'],
})
export class RegistrarComponent implements OnInit {
  private datosDocente = new UsuarioDocente();
  private datosAcudiente = new UsuarioAcudiente();
  private datosEstudiante = new UsuarioPaciente();
  private rol;
  hide = true;
  public variable = 0;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route_ID: ActivatedRoute,
    private route: Router
  ) { }

  public tipoDeRegistro_ID: number = Number(
    this.route_ID.snapshot.params.registroID
  );

  ngOnInit(): void {
    //this.formulario();
  }

  //FORMULARIO PARA ACUDIENTE Y DOCENTE
  public formR = this.formBuilder.group({

    nombre: [this.datosEstudiante.nombre, [Validators.required, Validators.maxLength(20), Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
    apellido: [this.datosEstudiante.apellido, [Validators.required, Validators.minLength(4), , Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*')]],
    documento: [this.datosEstudiante.documento, [Validators.required, Validators.minLength(6), Validators.maxLength(11), Validators.pattern('[0-9]*')]],
    clave: [this.datosEstudiante.clave, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    correo: [this.datosEstudiante.grado_autismo, [Validators.required, Validators.min(1), Validators.max(3), Validators.pattern(/[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}/)]],
  });

  //FORMULARIO PARA PACIENTE
  public formRP = this.formBuilder.group({

    nombre: [this.datosEstudiante.nombre, [Validators.required, Validators.maxLength(20), Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
    apellido: [this.datosEstudiante.apellido, [Validators.required, Validators.minLength(4), , Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*')]],
    documento: [this.datosEstudiante.documento, [Validators.required, Validators.minLength(9), Validators.maxLength(11), Validators.pattern('[0-9]*')]],
    clave: [this.datosEstudiante.clave, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    grado_autismo: [this.datosEstudiante.grado_autismo, [Validators.required, Validators.min(1), Validators.max(3), Validators.pattern('[0-9]*')]],
    edad: [this.datosEstudiante.edad, [Validators.required, Validators.min(6), Validators.max(11), Validators.pattern('[0-9]*')]],
  });
  //accion del boton (any son los datos que recibe del form)
  registrar(any): void {
    switch (this.tipoDeRegistro_ID) {
      case 1:
        //docente
        this.datosDocente = this.formR.value;
        this.datosDocente.institucion_id = 1;
        this.usuarioService
          .registrarDocente(this.datosDocente)
          .subscribe((data) => {
            console.log(data);
            this.openSnackBar(data.toString());
            this.route.navigate(['login']);
          }, err => {
            if (err.status == 409) {
              this.openSnackBar("Ya existe este usuario");
            } else {
              this.openSnackBar(err);
            }
          });
        break;
      case 2:
        //acudiente
        this.datosAcudiente = this.formR.value;
        this.usuarioService
          .registrarAcudiente(this.datosAcudiente)
          .subscribe((data) => {
            this.openSnackBar(data.toString());
            this.route.navigate(['login']);
          }, err => {
            if (err.status == 409) {
              this.openSnackBar("Ya existe este usuario");
            } else {
              this.openSnackBar(err);
            }
          });
        break;
      case 3:
        //estudiante
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(
          sessionStorage.getItem(environment.TOKEN)
        );
        const documetoDeLaRegistradora = decodedToken.Usuario;
        const rol = decodedToken.Rol;
        this.datosEstudiante = this.formRP.value;
        this.datosEstudiante.institucion_id = 1;
        this.datosEstudiante.documento_docente = documetoDeLaRegistradora;
        this.usuarioService.registrarPaciente(this.datosEstudiante).subscribe(
          (data) => {
            this.openSnackBar('' + data);
            this.route.navigate(['enlazarNino/' + rol]);
          },
          (err) => {
            if (err.status == 409) {
              this.openSnackBar("Este usuario ya existe");
            } else {
              this.openSnackBar(err);
            }
          }
        );
        break;
    }
  }
  private openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Aceptar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  datos() {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    this.rol = decodedToken.Rol;
  }
}
