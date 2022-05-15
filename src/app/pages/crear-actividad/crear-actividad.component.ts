import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Actividad } from 'src/app/_model/Actividad';
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

  private tipoActividad: UsuarioAcudiente[];
  public id_tipo_actividad: number;
  public id_tipo_actividadAccion: string;
  private EnviarActividad = new Actividad();
  public imagen: string;
  public pruebaImagen;
  private extencionImagen: string;
  private pathImagen;
  public user: string;
  private dateNow;
  private nuevaActividad = new Actividad();
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

  crearActividadImitacion = new FormGroup({
    nombreActividad: new FormControl(this.EnviarActividad.NombreActividad, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
      Validators.pattern('[a-zA-Z 0-9]*'),
    ]),
    tipo_actividad: new FormControl(
      this.EnviarActividad.Tipo_actividad,
      Validators.required
    ),
    descripcion: new FormControl(this.EnviarActividad.Descripcion, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
  });

  crearActividadPECS = new FormGroup({
    nombreActividad: new FormControl(this.EnviarActividad.NombreActividad, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
      Validators.pattern('[a-zA-Z 0-9]*'),
    ]),
    tipo_actividad: new FormControl(
      this.EnviarActividad.Tipo_actividad,
      Validators.required
    ),
    color_categoria: new FormControl(
      this.EnviarActividad.Tipo_actividad,
      Validators.required
    ),
    descripcion: new FormControl(this.EnviarActividad.Descripcion, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
  });

  actividadImagen = new FormGroup({
    contenido_actividad: new FormControl('', Validators.required),
  });

  public actividadTexto = new FormGroup({
    contenido_actividad: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
    ]),
  });

  async agregarActividad(any): Promise<void> {
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
        /*const fileRef = this.serviceAngularFireBase.ref("file/_Z622939.jpg");
        const respuesta = this.serviceAngularFireBase.upload("file/_Z622939.jpg",this.pathImagen);
        this.uploadProgress = respuesta.percentageChanges();

    // Get notified when the download URL is available
      respuesta.snapshotChanges().pipe(
        finalize(() => console.log(fileRef.getDownloadURL()))
        ).subscribe();
        /*this.servicioActividad.postAgregarActividad(this.nuevaActividad).subscribe(data=>{
          console.log("datos ", data.Mensaje)
          this.openSnackBar(data.Mensaje)
          this.ngOnInit()
        })*/
      } else {
        this.openSnackBar('Solo puedes seleccionar imagenes');
      }
    }
  }

  onSelect(value) {
    this.id_tipo_actividad = value = 1 ? value : value;
  }

  onSelectAccion(value) {
    this.id_tipo_actividadAccion = value;
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
