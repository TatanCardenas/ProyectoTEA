import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public form: FormGroup;
  private datosDocente = new UsuarioDocente();
  private datosAcudiente = new UsuarioAcudiente();
  private datosEstudiante = new UsuarioPaciente();
  hide = true;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route_ID: ActivatedRoute,
    private route: Router
  ) {}

  public tipoDeRegistro_ID: number = this.route_ID.snapshot.params.registroID;
  ngOnInit(): void {
    this.formDocente();
  }

  private formDocente() {
    switch (this.tipoDeRegistro_ID) {
      case 1:
        this.form = this.formBuilder.group({
          //docente
          nombre_docente: [
            this.datosDocente.nombre_docente,
            [
              Validators.required,
              Validators.maxLength(20),
              Validators.minLength(3),
              Validators.pattern(/[A-Za-z]/),
            ],
          ],
          apellido_docente: [
            this.datosDocente.apellido_docente,
            [
              Validators.required,
              Validators.minLength(4),
              ,
              Validators.maxLength(20),
              Validators.pattern(/[A-Za-z]/),
            ],
          ],
          cedula: [
            this.datosDocente.cedula,
            [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(11),
              Validators.pattern(/[0-9]/),
            ],
          ],
          clave: [
            this.datosDocente.clave,
            [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(20),
            ],
          ],
          correo: [
            this.datosDocente.correo,
            [
              Validators.required,
              Validators.pattern(
                /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}/
              ),
            ],
          ],
          nit: [
            this.datosDocente.nit,
            [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(20),
              Validators.pattern(/[0-9]/),
            ],
          ],
        });

        break;
      case 2:
        this.form = this.formBuilder.group({
          //acudiente
          nombre_acudiente: [
            this.datosAcudiente.nombre_acudiente,
            [
              Validators.required,
              Validators.maxLength(20),
              Validators.minLength(3),
              Validators.pattern(/[A-Za-z]/),
            ],
          ],
          apellido_acudiente: [
            this.datosAcudiente.apellido_acudiente,
            [
              Validators.required,
              Validators.minLength(4),
              ,
              Validators.maxLength(20),
              Validators.pattern(/[A-Za-z]/),
            ],
          ],
          cedula: [
            this.datosAcudiente.cedula,
            [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(11),
              Validators.pattern(/[0-9]/),
            ],
          ],
          clave: [
            this.datosAcudiente.clave,
            [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(20),
            ],
          ],
          correo: [
            this.datosAcudiente.correo,
            [
              Validators.required,
              Validators.pattern(
                /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}/
              ),
            ],
          ],
        });

        break;
      case 3:
        this.form = this.formBuilder.group({
          //estudiante
          nombre_paciente: [
            this.datosEstudiante.nombre_paciente,
            [
              Validators.required,
              Validators.maxLength(20),
              Validators.minLength(3),
              Validators.pattern(/[A-Za-z]/),
            ],
          ],
          apellido_paciente: [
            this.datosEstudiante.apellido_paciente,
            [
              Validators.required,
              Validators.minLength(4),
              ,
              Validators.maxLength(20),
              Validators.pattern(/[A-Za-z]/),
            ],
          ],
          numero_documento: [
            this.datosEstudiante.numero_documento,
            [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(11),
              Validators.pattern(/[0-9]/),
            ],
          ],
          clave: [
            this.datosEstudiante.clave,
            [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(20),
            ],
          ],
          grado_autismo: [
            this.datosEstudiante.grado_autismo,
            [Validators.required, Validators.min(1), Validators.max(3)],
          ],
          edad: [
            this.datosEstudiante.edad,
            [
              Validators.required,
              Validators.min(2),
              Validators.max(10),
              Validators.pattern(/[0-9]/),
            ],
          ],
        });

        break;
    }
  }

  //accion del boton (any son los datos que recibe del form)
  registrar(any): void {
    switch (this.tipoDeRegistro_ID) {
      case 1:
        //docente
        this.datosDocente = this.form.value;
        this.datosDocente.institucion_id = 1;
        this.usuarioService
          .registrarDocente(this.datosDocente)
          .subscribe((data) => {
            console.log(data);
            this.openSnackBar('Registro Exitoso');
          });
        break;
      case 2:
        //estudiante
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(
          sessionStorage.getItem(environment.TOKEN)
        );
        const documetoDeLaRegistradora = decodedToken.Usuario;
        const rol = decodedToken.Rol;
        this.datosEstudiante = this.form.value;
        this.datosEstudiante.institucion_id = 1;
        this.datosEstudiante.cedula_docente = documetoDeLaRegistradora;
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
      case 3:
        //acudiente
        this.datosAcudiente = this.form.value;
        this.usuarioService
          .registrarAcudiente(this.datosAcudiente)
          .subscribe((data) => {
            console.log(data);
          });
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
}
