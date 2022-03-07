import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioPaciente } from 'src/app/_model/UsuarioPaciente';
import { environment } from 'src/environments/environment';
import { PacienteService } from '../../_service/paciente.service';


@Component({
  selector: 'app-enlace-con-el-paciente',
  templateUrl: './enlace-con-el-paciente.component.html',
  styleUrls: ['./enlace-con-el-paciente.component.css']
})
export class EnlaceConElPacienteComponent implements OnInit {

  constructor(private serivcioPaciente:PacienteService,
    private route:ActivatedRoute,
    private snackBar: MatSnackBar,) { }
    
    pacientesTabla = new MatTableDataSource<UsuarioPaciente>();
    pacientesPorEnlazar: UsuarioPaciente[];

    tipoDeUsuario = new UsuarioPaciente;
    estudianteAEnlazar:UsuarioPaciente;
    enlaceAEliminar = new UsuarioPaciente();
    
    public usuario: String;
    public flagRol: boolean = false;
    public rol: number;
    private user: string;

    displayedColumns: string[] = ['Nombre Paciente', 'Apellido Paciente', 'Grado Autismo','Edad','Eliminar Enlace'];
    public id: number = this.route.snapshot.params.id;
    formEnlaceAgregar = new FormGroup({
      PacienteAEnlazar: new FormControl('',Validators.required)
    });

  async ngOnInit(): Promise<void> {
    this.pacientesPorEnlazar=null;
    await this.delay(2000);
    this.pacientesDelAcudiente();
    this.datos();
    if(this.id==1){
      this.tipoDeUsuario.cedula_docente = this.user;
      this.serivcioPaciente.getPacientesPorEnlazar(this.id).subscribe((paciente: UsuarioPaciente[])=>{
        this.pacientesPorEnlazar=paciente;
      });
      this.serivcioPaciente.getPacientesEnlazados(this.id,this.tipoDeUsuario).subscribe((pacientes)=>{
        this.pacientesTabla = new MatTableDataSource(pacientes);
      })
    }else if(this.id==2){
      await this.delay(1000);
      this.pacientesPorEnlazar = null;
      this.tipoDeUsuario.cedula_acudiente=this.user;
      this.serivcioPaciente.getPacientesEnlazados(this.id, this.tipoDeUsuario).subscribe((pacientes: UsuarioPaciente[])=>{
        this.pacientesTabla = new MatTableDataSource(pacientes);
      });
      await this.delay(1000);
      this.pacientesPorEnlazar=null;
      this.pacientesDelAcudiente();
    }
  }

  private delay(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async pacientesDelAcudiente(){
    this.pacientesPorEnlazar=null;
    await this.delay(1000);
    this.serivcioPaciente.getPacientesPorEnlazar(this.id).subscribe((paciente: UsuarioPaciente[])=>{
      if(this.pacientesTabla.data[0]==undefined){
        this.pacientesPorEnlazar=paciente;
      }else{
        this.pacientesPorEnlazar=null;
      }
    });
  }


  agregarEnlace(valores){
    this.pacientesPorEnlazar = null;
    this.estudianteAEnlazar = new UsuarioPaciente();
    this.estudianteAEnlazar.numero_documento = valores.PacienteAEnlazar;
    if(this.id==1){
      this.estudianteAEnlazar.cedula_docente=this.user;
    }else if(this.id ==2){
      this.estudianteAEnlazar.cedula_acudiente=this.user;
    }
    this.serivcioPaciente.enlazarPaciente(this.estudianteAEnlazar).subscribe(data=>{
      this.pacientesDelAcudiente();
      this.ngOnInit();
      this.openSnackBar(""+ data);
    });
    
  }
  eliminarEnlace(documentoPaciente){
    if(this.id==1){
      this.enlaceAEliminar.cedula_docente= this.user;
    }else if(this.id==2){
      this.enlaceAEliminar.cedula_acudiente= this.user;
    }
    this.enlaceAEliminar.numero_documento= documentoPaciente;
    this.serivcioPaciente.eliminarEnlacePaciente(this.enlaceAEliminar).subscribe(data=>{
      console.log("respuesta "+ data)
      this.openSnackBar(""+data);
      this.ngOnInit();
    });
  }


  datos(){
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    this.rol = decodedToken.Rol;
    this.user = decodedToken.Usuario;
  }
  private openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Aceptar', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  } 
}
