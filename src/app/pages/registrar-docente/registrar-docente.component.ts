import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioDocente } from 'src/app/_model/UsuarioDocente';
import { UsuarioService } from 'src/app/_service/usuario.service';

@Component({
  selector: 'app-registrar-docente',
  templateUrl: './registrar-docente.component.html',
  styleUrls: ['./registrar-docente.component.css']
})
export class RegistrarDocenteComponent implements OnInit {
  public form: FormGroup;
  private datosDocente = new UsuarioDocente;
  hide = true;

  constructor(private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.formDocente();
  }

  private formDocente() {
    
    this.form = this.formBuilder.group({
      
      nombre_docente: [this.datosDocente.nombre_docente, [Validators.required,Validators.maxLength(20), Validators.minLength(3),Validators.pattern(/[A-Za-z]/)]],
      apellido_docente: [this.datosDocente.apellido_docente, [Validators.required,Validators.minLength(4),, Validators.maxLength(20), Validators.pattern(/[A-Za-z]/)]],
      cedula: [this.datosDocente.cedula, [Validators.required, Validators.minLength(6), Validators.maxLength(11), Validators.pattern(/[0-9]/)]],
      clave: [this.datosDocente.clave, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      correo: [this.datosDocente.correo, [Validators.required, Validators.pattern(/[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}/)]],
      nit: [this.datosDocente.nit, [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern(/[0-9]/)]],
    });
  }

  registrar(any):void {   
    this.datosDocente = this.form.value;
    this.datosDocente.institucion_id = 1;
    this.usuarioService.registrarDocente(this.datosDocente).subscribe(data =>{
      console.log(data);
      this.openSnackBar("Registro Exitoso")
    });
}
private openSnackBar(mensaje: string) {
  this.snackBar.open(mensaje, 'Aceptar', {
    duration: 2000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  });
} 
}
