import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from 'src/app/_model/Usuario';
import { UsuarioDocente } from 'src/app/_model/UsuarioDocente';
import { UsuarioAcudiente } from 'src/app/_model/UsuarioAcudiente';
import { UsuarioService } from 'src/app/_service/usuario.service'
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  private datosUser = new Usuario;
 
  private datosAcudiente = new UsuarioAcudiente;
  public form: FormGroup;
  hide = true;
  //public tipoU:number =this.rutaActiva.snapshot.params.idU;

  constructor(private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private rutaActiva: ActivatedRoute) { 
      this.formAcudiente();
      
    }

  ngOnInit(): void {
      this.formAcudiente();
    
  }

  private formAcudiente() {
    
    this.form = this.formBuilder.group({
      
      nombre_acudiente: [this.datosAcudiente.nombre_acudiente, [Validators.required,Validators.maxLength(20), Validators.minLength(3),Validators.pattern(/[A-Za-z]/)]],
      apellido_acudiente: [this.datosAcudiente.apellido_acudiente, [Validators.required,Validators.minLength(4),, Validators.maxLength(20), Validators.pattern(/[A-Za-z]/)]],
      cedula: [this.datosAcudiente.cedula, [Validators.required, Validators.minLength(6), Validators.maxLength(11), Validators.pattern(/[0-9]/)]],
      clave: [this.datosAcudiente.clave, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      correo: [this.datosAcudiente.correo, [Validators.required, Validators.pattern(/[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}/)]]
    });
  }

  registrar(any):void {   
      this.datosAcudiente = this.form.value;
      this.usuarioService.registrarAcudiente(this.datosAcudiente).subscribe(data =>{
        console.log(data);
      });
  }

}
