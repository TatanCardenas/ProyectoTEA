import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Actividad } from 'src/app/_model/Actividad';
import { ActividadService } from 'src/app/_service/actividad.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActividadPECS_Categorias } from 'src/app/_model/ActividadPECS_Categorias';

@Component({
  selector: 'app-administrar-actividad',
  templateUrl: './administrar-actividad.component.html',
  styleUrls: ['./administrar-actividad.component.css'],
})
export class AdministrarActividadComponent implements OnInit {
  public listaActividades_activas = new MatTableDataSource<Actividad>();
  public listaActividades_inactivas = new MatTableDataSource<Actividad>();

  public listaCategorias_activas = new MatTableDataSource<ActividadPECS_Categorias>();
  public listaCategorias_inactivas = new MatTableDataSource<ActividadPECS_Categorias>();

  public user: string;
  public id_activityencrypt: number;
  tipoGestion;

  constructor(
    private servicioActividad: ActividadService,
    private snackBar: MatSnackBar,
    private actividadRouter: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.datosSesion();
    await this.delay(1000);
    this.actividadRouter.params.subscribe((parametros: Params) => {
      this.id_activityencrypt = parametros['idActividad'];
      console.log(this.id_activityencrypt);
    });

    this.cargaDatosSegunTipoGestion(this.id_activityencrypt);
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
    this.servicioActividad.putActividad(id_actividad).subscribe((data) => {
      this.openSnackBar(data);
      this.ngOnInit();
    });
  }

  actualizarCategoria(id_categoria) {
    console.log('id categoria ' + id_categoria);
    this.servicioActividad.putCategoriaEstado(id_categoria).subscribe((data) => {
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

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  cargaDatosSegunTipoGestion(id_tipoGestion) {
    if (id_tipoGestion == 1) {
      this.tipoGestion = 'GESTIÓN DE ACTIVIDADES DE IMITACIÓN';
      this.servicioActividad
        .getListaActividades(1, this.user)
        .subscribe((data) => {
          console.log(data)
          this.listaActividades_activas = new MatTableDataSource(
            data.filter((x) => x.Estado_id <= 1)
          );
          this.listaActividades_inactivas = new MatTableDataSource(
            data.filter((x) => x.Estado_id >= 2)
          );
        });
    } else if (id_tipoGestion == 2) {
      this.tipoGestion = 'GESTIÓN DE CATEGORÍAS PECS';
      this.servicioActividad
        .getListaCategorias(this.user)
        .subscribe((data) => {
          console.log(data[0].estado_id)
          this.listaCategorias_activas = new MatTableDataSource(
            data.filter((x) => x.estado_id <= 1)
          );
          this.listaCategorias_inactivas = new MatTableDataSource(
            data.filter((x) => x.estado_id >= 2)
          );
        });
    }
  }
}
