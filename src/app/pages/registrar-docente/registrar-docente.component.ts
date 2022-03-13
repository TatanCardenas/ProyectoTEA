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
  selector: 'app-registrar-docente',
  templateUrl: './registrar-docente.component.html',
  styleUrls: ['./registrar-docente.component.css'],
})
export class RegistrarDocenteComponent implements OnInit {
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
  ) {}

  public tipoDeRegistro_ID: number = Number(
    this.route_ID.snapshot.params.registroID
  );

  ngOnInit(): void {
    //this.formulario();
  }

  public formR = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
    apellido: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
    documento: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
    clave: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
    correo: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
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
            this.openSnackBar('Registro Exitoso');
          });
        break;
      case 2:
        //acudiente
        this.datosAcudiente = this.formR.value;
        this.usuarioService
          .registrarAcudiente(this.datosAcudiente)
          .subscribe((data) => {
            console.log(data);
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
        this.datosEstudiante = this.formR.value;
        this.datosEstudiante.institucion_id = 1;
        this.datosEstudiante.documento_docente = documetoDeLaRegistradora;
        this.usuarioService.registrarPaciente(this.datosEstudiante).subscribe(
          (data) => {
            this.openSnackBar('' + data);
            this.route.navigate(['enlazarNino/' + rol]);
          },
          (err) => {
            this.openSnackBar('Este usuario ya existe');
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
