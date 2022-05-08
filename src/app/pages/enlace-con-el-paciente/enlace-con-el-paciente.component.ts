import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioPaciente } from 'src/app/_model/UsuarioPaciente';
import { environment } from 'src/environments/environment';
import CryptoJS from "crypto-js";
import { PacienteService } from '../../_service/paciente.service';


@Component({
  selector: 'app-enlace-con-el-paciente',
  templateUrl: './enlace-con-el-paciente.component.html',
  styleUrls: ['./enlace-con-el-paciente.component.css']
})
export class EnlaceConElPacienteComponent implements OnInit {

  constructor(private serivcioPaciente: PacienteService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router) { }

  pacientesTabla = new MatTableDataSource<UsuarioPaciente>();
  pacientesPorEnlazar = new MatTableDataSource<UsuarioPaciente>();

  tipoDeUsuario = new UsuarioPaciente;
  estudianteAEnlazar: UsuarioPaciente;
  enlaceAEliminar = new UsuarioPaciente();

  public usuario: String;
  public flagRol: boolean = false;
  public rol: number;
  private user: string;
  private id_rol_crypt: string;
  private id_document_crypt: string;

  displayedColumns: string[] = ['Nombre Paciente', 'Apellido Paciente', 'Grado Autismo', 'Edad', 'Editar Datos','Eliminar Enlace'];
  columnasAgregarPaciente: string[] = ['Nombre Paciente', 'Apellido Paciente', 'Grado Autismo', 'Numero_documento', 'Agregar enlace'];
  public id: number = this.route.snapshot.params.id;
  formEnlaceAgregar = new FormGroup({
    PacienteAEnlazar: new FormControl('', Validators.required)
  });

  async ngOnInit(): Promise<void> {
    await this.delay(1000);
    this.datos();
    if (this.id == 1) {
      this.tipoDeUsuario.documento_docente = this.user;
      this.serivcioPaciente.getPacientesPorEnlazar(this.id).subscribe((paciente: UsuarioPaciente[]) => {
        this.pacientesPorEnlazar = new MatTableDataSource(paciente);
      });
      this.serivcioPaciente.getPacientesEnlazados(this.id, this.tipoDeUsuario).subscribe((pacientes) => {
        this.pacientesTabla = new MatTableDataSource(pacientes);
      })
    } else if (this.id == 2) {
      this.pacientesPorEnlazar = null;
      this.tipoDeUsuario.documento_acudiente = this.user;
      this.serivcioPaciente.getPacientesEnlazados(this.id, this.tipoDeUsuario).subscribe((pacientes: UsuarioPaciente[]) => {
        this.pacientesTabla = new MatTableDataSource(pacientes);
      });
      await this.delay(1000);
      this.pacientesDelAcudiente();
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  pacientesDelAcudiente() {
    this.pacientesPorEnlazar = null;
    this.serivcioPaciente.getPacientesPorEnlazar(this.id).subscribe(paciente => {
      if (this.pacientesTabla.data[0] == undefined) {
        this.pacientesPorEnlazar = new MatTableDataSource(paciente);
      } else {
        this.pacientesPorEnlazar = null;
      }
    });
  }


  applyFilterEli(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.pacientesTabla.filter = filterValue.trim().toLowerCase();

  }
  applyFilterAgre(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.pacientesPorEnlazar.filter = filterValue.trim().toLowerCase();

  }

  agregarEnlace(valores) {
    this.pacientesPorEnlazar = null;
    this.estudianteAEnlazar = new UsuarioPaciente();
    this.estudianteAEnlazar.documento = valores;
    if (this.id == 1) {
      this.estudianteAEnlazar.documento_docente = this.user;
    } else if (this.id == 2) {
      this.estudianteAEnlazar.documento_acudiente = this.user;
    }
    this.serivcioPaciente.enlazarPaciente(this.estudianteAEnlazar).subscribe(data => {
      this.ngOnInit();
      this.openSnackBar("" + data);
    });

  }
  eliminarEnlace(documentoPaciente) {
    if (this.id == 1) {
      this.enlaceAEliminar.documento_docente = this.user;
    } else if (this.id == 2) {
      this.enlaceAEliminar.documento_acudiente = this.user;
    }
    this.enlaceAEliminar.documento = documentoPaciente;
    this.serivcioPaciente.eliminarEnlacePaciente(this.enlaceAEliminar).subscribe(data => {
      this.openSnackBar("" + data);
      this.ngOnInit();
    });
  }
  perfil(document_paciente) {
    do {
      this.id_rol_crypt = CryptoJS.AES.encrypt(JSON.stringify(3), 'id_rol_crypt').toString();
    } while (this.id_rol_crypt.includes('/'))
    do {
      this.id_document_crypt = CryptoJS.AES.encrypt(JSON.stringify(document_paciente), 'id_document_crypt').toString();
    } while (this.id_document_crypt.includes('/'))
    this.router.navigate(['perfil/' + this.id_rol_crypt + '/' + this.id_document_crypt]);
  }


  datos() {
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
