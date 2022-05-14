import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Actividad } from 'src/app/_model/Actividad';
import { ActividadService } from 'src/app/_service/actividad.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-administrar-actividad',
  templateUrl: './administrar-actividad.component.html',
  styleUrls: ['./administrar-actividad.component.css'],
})
export class AdministrarActividadComponent implements OnInit {
  public listaActividades_activas = new MatTableDataSource<Actividad>();
  public listaActividades_inactivas = new MatTableDataSource<Actividad>();
  public user: string;

  constructor(
    private servicioActividad: ActividadService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.datosSesion();
    this.servicioActividad
      .getListaActividades(1, this.user)
      .subscribe((data) => {
        this.listaActividades_activas = new MatTableDataSource(
          data.filter((x) => x.Estado_id <= 1)
        );
        this.listaActividades_inactivas = new MatTableDataSource(
          data.filter((x) => x.Estado_id >= 2)
        );
      });
  }
  //ENCABEZADO DE LAS TABLAS
  displayedColumns: string[] = [
    'Nombre Actividad',
    'Descripcion',
    'Tipo Actividad',
    'Contenido',
    'Desactivar',
  ];
  displayedColumns_: string[] = [
    'Nombre Actividad',
    'Descripcion',
    'Tipo Actividad',
    'Contenido',
    'Activar',
  ];

  datosSesion() {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    this.user = decodedToken.Usuario;
  }

  actualizareActividad(id_actividad) {
    console.log('id actividad ' + id_actividad);
    this.servicioActividad.putActividad(id_actividad).subscribe((data) => {
      this.openSnackBar(data);
      this.ngOnInit();
    });
  }

  private openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, '', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
