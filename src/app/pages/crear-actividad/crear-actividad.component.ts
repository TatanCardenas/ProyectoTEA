import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioAcudiente } from 'src/app/_model/UsuarioAcudiente';

interface tp_actividad {
  value: string;
  actividad_tp: string;
}

@Component({
  selector: 'app-crear-actividad',
  templateUrl: './crear-actividad.component.html',
  styleUrls: ['./crear-actividad.component.css']
})
export class CrearActividadComponent implements OnInit {



  private tipoActividad : UsuarioAcudiente[];
  public id_tipo_actividad: number;
  public actividad_tipo: tp_actividad[] = [
    {value: '1', actividad_tp: 'Imitacion verbal'},
    {value: '2', actividad_tp: 'Descripción imagen'},
  ];


  constructor() { }

  ngOnInit(): void {

    
  }

  crearActividad = new FormGroup({
    nombre_actividad : new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(25), Validators.pattern('[a-zA-Z ]+[0-9]*')]),
    tipo_actividad : new FormControl('', Validators.required),
    descri : new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(25)]),
    imagen : new FormControl('',),
    texto : new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(25)])
  })


  agregarActividad(any){

  }


  onSelect(value){
    this.id_tipo_actividad = value =1?value:value;
  }
}
