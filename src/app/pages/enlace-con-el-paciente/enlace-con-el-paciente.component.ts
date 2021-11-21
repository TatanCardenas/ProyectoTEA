import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsuarioPaciente } from 'src/app/_model/UsuarioPaciente';
import { PacienteService } from '../../_service/paciente.service';

@Component({
  selector: 'app-enlace-con-el-paciente',
  templateUrl: './enlace-con-el-paciente.component.html',
  styleUrls: ['./enlace-con-el-paciente.component.css']
})
export class EnlaceConElPacienteComponent implements OnInit {

  constructor(private serivcioPaciente:PacienteService,
    private route:ActivatedRoute,) { }

    pacientesTabla: UsuarioPaciente[] = [];
  pacientesPorEnlazar: UsuarioPaciente[];
  pacieteAux:UsuarioPaciente[]=[];
  displayedColumns: string[] = ['Nombre Paciente', 'Apellido Paciente', 'Grado Autismo','Edad'];
  public id: number = this.route.snapshot.params.id;
  formDiscoAgregar = new FormGroup({
    PacienteAEnlazar: new FormControl('',Validators.required)
  });

  async ngOnInit(): Promise<void> {
    await this.delay(2000);
    if(this.id==1){
      this.serivcioPaciente.getPacientesPorEnlazar(this.id).subscribe((paciente: UsuarioPaciente[])=>{
        this.pacientesPorEnlazar=paciente;
      });
      this.serivcioPaciente.getPacientesEnlazados(this.id).subscribe((paciente: UsuarioPaciente[])=>{
        if(paciente!=null){
          for(var i=0;i<paciente.length;i++){
            if(paciente[i].cedula_docente=="100015686"){
              this.pacieteAux.push(paciente[i]);
            }
            this.pacientesTabla = this.pacieteAux;
          }
        }
      })
    }else if(this.id==2){
      this.serivcioPaciente.getPacientesEnlazados(this.id).subscribe((paciente: UsuarioPaciente[])=>{
        //console.log("hola "+paciente[1].nombre_paciente);
        this.pacientesTabla=paciente;
      });
      this.serivcioPaciente.getPacientesPorEnlazar(this.id).subscribe((paciente: UsuarioPaciente[])=>{
        //if(this.pacientesTabla==null){
          this.pacientesPorEnlazar=paciente;
        //}else{
          //this.pacientesPorEnlazar=null;
        //}
      });
    }
    /*this.servicioArtista.getArtisic().subscribe((cantante :Cantante[])=>{
      this.cantantes = cantante;
    });
    this.servicioDiscos.getDiscos().subscribe((disco :Discos[])=>{
      this.discos = disco;
    });*/
  }

  private delay(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  agregarEnlace(){
    
  }

}
