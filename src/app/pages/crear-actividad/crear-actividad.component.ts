import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Actividad } from 'src/app/_model/Actividad';
import { ActividadPECS_Categorias } from 'src/app/_model/ActividadPECS_Categorias';
import { UsuarioAcudiente } from 'src/app/_model/UsuarioAcudiente';
import { ActividadService } from 'src/app/_service/actividad.service';
import { environment } from 'src/environments/environment';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { TypeActivity } from 'src/app/_model/TypeActivity';

@Component({
  selector: 'app-crear-actividad',
  templateUrl: './crear-actividad.component.html',
  styleUrls: ['./crear-actividad.component.css'],
})
export class CrearActividadComponent implements OnInit {
  uploadURL: Observable<string>;
  uploadProgress: Observable<number>;

  opcionCreacion = null;

  public id_tipo_actividad: number;
  public seleccionAgregar_Categoria_Imagen: string;
  public tipo_actividad_Accion;
  public colorAsignadoA_Categoria;
  public categoriaAsignadaA_Imagen;
  private pathImagen;
  private EnviarCategoriaPECS = new ActividadPECS_Categorias();
  private EnviarActividad = new Actividad();
  public imagen: string;
  public pruebaImagen;
  private extencionImagen: string;
  public user: string;
  private dateNow;
  private nuevaActividad = new Actividad();
  private nuevaCategoriaPECS = new ActividadPECS_Categorias();
  public actividad_tipo: TypeActivity[];

  constructor(
    private snackBar: MatSnackBar,
    private servicioActividad: ActividadService,
    private serviceAngularFireBase: AngularFireStorage
  ) {}

  async ngOnInit(): Promise<void> {
    await this.delay(1000);
    //OBTIENE DATOS DE SESION
    this.datosSesion();
    //lista los tipos de actividades disponibles
    this.servicioActividad.getTypeActivity().subscribe((data) => {
      this.actividad_tipo = data;
    });
  }

  //IMITACION
  crearActividadImitacion = new FormGroup({
    nombreActividad: new FormControl(this.EnviarActividad.NombreActividad, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
      Validators.pattern('[a-zA-Z 0-9]*'),
    ]),
    descripcion: new FormControl(this.EnviarActividad.Descripcion, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
  });

  //PECS
  crearActividadPECS = new FormGroup({
    Id_estudiante: new FormControl(this.EnviarCategoriaPECS.Id_estudiante, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
      Validators.pattern('[a-zA-Z 0-9]*'),
    ]),
    tipo_actividad: new FormControl(Validators.required),
    Color: new FormControl(this.EnviarCategoriaPECS.Color, Validators.required),
    Categoria: new FormControl(this.EnviarCategoriaPECS.Categoria, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
    categoriaAsignada: new FormControl(this.EnviarActividad.Tipo_actividad),
  });

  actividadImagen = new FormGroup({
    contenido_actividad: new FormControl(''),
  });

  public actividadTexto = new FormGroup({
    contenido_actividad: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
  });

  async agregarActividad(any): Promise<void> {
    console.log('actividad');
    this.nuevaActividad = this.crearActividadImitacion.value;
    this.nuevaActividad.Docente_creador = this.user;
    if (this.id_tipo_actividad == 1) {
      this.nuevaActividad.Contenido_actividad =
        this.actividadTexto.value.contenido_actividad;
      this.servicioActividad
        .postAgregarActividad(this.nuevaActividad)
        .subscribe((data) => {
          this.openSnackBar(data.Mensaje);
          this.ngOnInit();
        });
    } else if (this.id_tipo_actividad == 2) {
      this.dateNow = new Date()
        .toLocaleString()
        .replace(/[`~!@#$%^&*()_|+\-=?¡¿;:'",.<>\{\}\[\]\\\/]/gi, '')
        .replace(' ', '');
      this.dateNow = this.dateNow + new Date().getMilliseconds();
      this.imagen = this.actividadImagen.value.contenido_actividad;
      this.extencionImagen = this.imagen.substring(
        this.imagen.lastIndexOf('.') + 1,
        this.imagen.length
      );
      this.imagen = this.dateNow + this.user;
      if (this.extencionImagen == ('jpg' || 'png' || 'jpeg')) {
        this.nuevaActividad.Contenido_actividad = this.imagen;
        const ref = this.serviceAngularFireBase.ref('"file/_Z622939.jpg"');
        console.log(ref.getDownloadURL());
      } else {
        this.openSnackBar('Solo puedes seleccionar imagenes');
      }
    }
  }

  async agregarCategoriaPECS(any): Promise<void> {
    this.nuevaCategoriaPECS = this.crearActividadPECS.value;

    var nuevaCtaegoria = new ActividadPECS_Categorias();
    nuevaCtaegoria.Categoria = this.nuevaCategoriaPECS.Categoria;
    nuevaCtaegoria.Categoria_id = 7;
    nuevaCtaegoria.Color = this.nuevaCategoriaPECS.Color;
    nuevaCtaegoria.Id_docente = this.user;
    nuevaCtaegoria.Id_estudiante = this.nuevaCategoriaPECS.Id_estudiante;
    nuevaCtaegoria.estado_id = 2;
    console.log(nuevaCtaegoria);
    this.servicioActividad
      .postAgregarCategoria(nuevaCtaegoria)
      .subscribe((data) => {
        this.openSnackBar(data.Mensaje);
      });
  }

  onSelectAccionTipoActividad(value) {
    this.tipo_actividad_Accion = value;
  }

  onSelectAccionColor(value) {
    this.colorAsignadoA_Categoria = value;
  }

  onSelectAccionAsignarCategoria(value) {
    this.categoriaAsignadaA_Imagen = value;
  }

  upload($event) {
    console.log($event.target.files[0]);
    this.pathImagen = $event.target.files[0];
  }
  uploadImage() {}

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

  datosSesion() {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    this.user = decodedToken.Usuario;
  }

  opcionRegistro(id) {
    if (id == 1) {
      this.opcionCreacion = 1;
    } else if (id == 2) {
      this.opcionCreacion = 2;
    }
  }
}
