import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioPaciente } from 'src/app/_model/UsuarioPaciente'
import { UsuarioService } from 'src/app/_service/usuario.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-paciente',
  templateUrl: './registrar-paciente.component.html',
  styleUrls: ['./registrar-paciente.component.css']
})
export class RegistrarPacienteComponent implements OnInit {
  public form: FormGroup;
  private datosPaciente = new UsuarioPaciente;
  hide = true;
  
  constructor(private usuarioService: UsuarioService,private formBuilder: FormBuilder,private snackBar: MatSnackBar,
    private router:Router) { }

  ngOnInit(): void {
    this.formPaciente();
  }

  private formPaciente() {
    
    this.form = this.formBuilder.group({
      
      nombre_paciente: [this.datosPaciente.nombre, [Validators.required,Validators.maxLength(20), Validators.minLength(3),Validators.pattern('[a-zA-Z ]*')]],
      apellido_paciente: [this.datosPaciente.apellido, [Validators.required,Validators.minLength(4),, Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*')]],
      numero_documento: [this.datosPaciente.documento, [Validators.required, Validators.minLength(6), Validators.maxLength(11), Validators.pattern('[0-9]*')]],
      clave: [this.datosPaciente.clave, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      grado_autismo: [this.datosPaciente.grado_autismo, [Validators.required, Validators.min(1), Validators.max(3), Validators.pattern('[0-9]*')]],
      edad: [this.datosPaciente.edad, [Validators.required, Validators.min(2), Validators.max(10), Validators.pattern('[0-9]*')]],
    });
  }

  registrar(any):void {   
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN));
    const documetoDeLaRegistradora = decodedToken.Usuario;
    const rol = decodedToken.Rol;
    this.datosPaciente = this.form.value;
    this.datosPaciente.institucion_id = 1;
    this.datosPaciente.documento_docente = documetoDeLaRegistradora;
    this.usuarioService.registrarPaciente(this.datosPaciente).subscribe(data =>{
      this.openSnackBar(""+data);
      this.router.navigate(['enlazarNino/'+rol]);
    }, err => {
      this.openSnackBar("Este usuario ya existe");
    });
  }


  private openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Aceptar', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  } 
}
