import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioDocente } from 'src/app/_model/UsuarioDocente';
import { UsuarioPaciente } from 'src/app/_model/UsuarioPaciente';
import { UsuarioService } from 'src/app/_service/usuario.service';
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
    private usuarioService: UsuarioService) { }
    
    pacientesTabla: UsuarioPaciente[] = [];
    pacientesPorEnlazar: UsuarioPaciente[];
    pacieteAux:UsuarioPaciente[]=[];
    estudianteAEnlazar:UsuarioPaciente;
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
    await this.delay(2000);
    this.datos();
    if(this.id==1){
      this.serivcioPaciente.getPacientesPorEnlazar(this.id).subscribe((paciente: UsuarioPaciente[])=>{
        this.pacientesPorEnlazar=paciente;
      });
      this.serivcioPaciente.getPacientesEnlazados(this.id).subscribe((paciente: UsuarioPaciente[])=>{
        if(paciente!=null){
          for(var i=0;i<paciente.length;i++){
            if(paciente[i].cedula_docente==this.user){
              this.pacieteAux.push(paciente[i]);
            }
            this.pacientesTabla = this.pacieteAux;
          }
        }
      })
    }else if(this.id==2){
      this.serivcioPaciente.getPacientesEnlazados(this.id).subscribe((paciente: UsuarioPaciente[])=>{
        if(paciente!=null){
          for(var i=0;i<paciente.length;i++){
            if(paciente[i].cedula_acudiente==this.user){
              this.pacieteAux.push(paciente[i]);
            }
            this.pacientesTabla = this.pacieteAux;
          }
        }
      });
      await this.delay(2000);
      this.serivcioPaciente.getPacientesPorEnlazar(this.id).subscribe((paciente: UsuarioPaciente[])=>{
        if(this.pacientesTabla[0]==undefined){
          console.log("entro a el if");
          this.pacientesPorEnlazar=paciente;
        }else{
          console.log("entro a else");
          this.pacientesPorEnlazar=null;
        }
      });
    }
  }

  private delay(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  agregarEnlace(valores){
    this.estudianteAEnlazar = new UsuarioPaciente();
    this.estudianteAEnlazar.numero_documento = valores.PacienteAEnlazar;
    if(this.id==1){
      this.estudianteAEnlazar.cedula_docente=this.user;
    }else if(this.id ==2){
      this.estudianteAEnlazar.cedula_acudiente=this.user;
    }
    this.serivcioPaciente.enlazarPaciente(this.estudianteAEnlazar).subscribe(data=>{
      console.log(data[1]);
    });
    this.ngOnInit();
  }


  datos(){
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    this.rol = decodedToken.Rol;
    this.user = decodedToken.Usuario;
  }
}
