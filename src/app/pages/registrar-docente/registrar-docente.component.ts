import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.formDocente();
  }

  private formDocente() {
    
    this.form = this.formBuilder.group({
      
      nombre: [this.datosDocente.nombre_docente, [Validators.required,Validators.maxLength(20), Validators.minLength(3),Validators.pattern(/[A-Za-z]/)]],
      apellido: [this.datosDocente.apellido_docente, [Validators.required,Validators.minLength(4),, Validators.maxLength(20), Validators.pattern(/[A-Za-z]/)]],
      documento: [this.datosDocente.cedula, [Validators.required, Validators.minLength(6), Validators.maxLength(11), Validators.pattern(/[0-9]/)]],
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
    });
}
}
