import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioPaciente } from 'src/app/_model/UsuarioPaciente'
import { UsuarioService } from 'src/app/_service/usuario.service';

@Component({
  selector: 'app-registrar-paciente',
  templateUrl: './registrar-paciente.component.html',
  styleUrls: ['./registrar-paciente.component.css']
})
export class RegistrarPacienteComponent implements OnInit {
  public form: FormGroup;
  private datosPaciente = new UsuarioPaciente;
  hide = true;
  
  constructor(private usuarioService: UsuarioService,private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.formPaciente();
  }

  private formPaciente() {
    
    this.form = this.formBuilder.group({
      
      nombre: [this.datosPaciente.nombre_paciente, [Validators.required,Validators.maxLength(20), Validators.minLength(3),Validators.pattern(/[A-Za-z]/)]],
      apellido: [this.datosPaciente.apellido_paciente, [Validators.required,Validators.minLength(4),, Validators.maxLength(20), Validators.pattern(/[A-Za-z]/)]],
      documento: [this.datosPaciente.numero_documento, [Validators.required, Validators.minLength(6), Validators.maxLength(11), Validators.pattern(/[0-9]/)]],
      clave: [this.datosPaciente.clave, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      gradoA: [this.datosPaciente.grado_autismo, [Validators.required, Validators.min(1), Validators.max(3)]],
      edad: [this.datosPaciente.edad, [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern(/[0-9]/)]],
      institucion: [this.datosPaciente.institucion_id, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    });
  }

  registrar(any):void {   
    this.datosPaciente = this.form.value;
    this.datosPaciente.institucion_id = 1;
    this.usuarioService.registrarPaciente(this.datosPaciente).subscribe(data =>{
      console.log(data);
    });
  }

}
