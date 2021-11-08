import { Component } from '@angular/core';

interface Registro {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'ProyectoTEAA';
  public flagSesion: boolean = false;
  selectedValue: string;
  
  registros: Registro[] = [
    {value: '1', viewValue: 'Como Docente'},
    {value: '2', viewValue: 'Como Acudiente'},
    {value: '3', viewValue: 'Como niño'}
  ];

  constructor(){
  }

  ngOnInit():void{
    //this.usuario();

  }


  cerrarSession(){
    return true;
  }
}
