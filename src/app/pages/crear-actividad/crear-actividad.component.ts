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
import { ActividadPECS_Imagenes } from 'src/app/_model/ActividadPECS_Imagenes';

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
  private EnviarImagenPECS = new ActividadPECS_Imagenes();
  private EnviarActividad = new Actividad();
  public imagen: string;
  public pruebaImagen;
  private extencionImagen: string;
  public user: string;
  public infoCategorias = new ActividadPECS_Categorias();
  public cantidadCategoriasAsignadas: number;
  private dateNow;
  private nuevaActividad = new Actividad();
  public nuevaCategoriaPECS = new ActividadPECS_Categorias();
  public nuevaImagenPECS = new ActividadPECS_Imagenes();
  public actividad_tipo: TypeActivity[];

  //imagen
  public base64textString: string;

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

  //PECS-categoria
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

  crearActividadPECS_IMAGEN = new FormGroup({
    DesctipcionImagen: new FormControl(this.EnviarImagenPECS.Texto_imagen),
    CategoriaAsignada: new FormControl(this.EnviarImagenPECS.Categoria_id),
  });

  //PECS-imagen

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

  //BOTONES ENVIO DE DATOS

  async agregarActividad(any): Promise<void> {
    this.nuevaActividad = this.crearActividadImitacion.value;
    this.nuevaActividad.Docente_creador = this.user;

    this.nuevaActividad.Contenido_actividad =
      this.actividadTexto.value.contenido_actividad;
    this.nuevaActividad.Tipo_actividad = 1;
    this.servicioActividad
      .postAgregarActividad(this.nuevaActividad)
      .subscribe((data) => {
        this.openSnackBar(data.Mensaje);
        this.ngOnInit();
      });
  }

  async agregarCategoriaPECS(any): Promise<void> {
    //carga cantidad de categorias asignadas por el docente a el paciente especificado
    this.nuevaCategoriaPECS = this.crearActividadPECS.value;
    var nuevaCtaegoria = new ActividadPECS_Categorias();
    nuevaCtaegoria.Categoria = this.nuevaCategoriaPECS.Categoria;
    nuevaCtaegoria.Color = this.nuevaCategoriaPECS.Color;
    nuevaCtaegoria.Id_docente = this.user;
    nuevaCtaegoria.Id_estudiante = this.nuevaCategoriaPECS.Id_estudiante;
    nuevaCtaegoria.estado_id = 2;
    this.cantidadCategoriasImagenPECS_agregarCategoria(nuevaCtaegoria);
  }

  async categoriasImagenPECS(any): Promise<void> {
    this.tipo_actividad_Accion = 'imagenPECS_categoria';
    this.nuevaCategoriaPECS = this.crearActividadPECS.value;
    try {
      this.servicioActividad
        .getCategoriasPECS(this.user, this.nuevaCategoriaPECS.Id_estudiante)
        .subscribe((data) => {
          this.infoCategorias = data;
        });
    } catch (error) {
      console.log('ingrese el id del estudiante' + error);
    }
  }

  async cantidadCategoriasImagenPECS_agregarCategoria(
    nuevaCtaegoria: ActividadPECS_Categorias
  ): Promise<void> {
    let cantidadCategoriasAsignadas;
    try {
      this.servicioActividad
        .getCantidadCategoriasPECS(this.user, nuevaCtaegoria.Id_estudiante)
        .subscribe((data) => {
          cantidadCategoriasAsignadas = data;
        });
    } catch (error) {
      console.log('fallo en servicio' + error);
    }
    
    await this.delay(1500);
    nuevaCtaegoria.Categoria_id = cantidadCategoriasAsignadas;
    console.log(cantidadCategoriasAsignadas);

    this.servicioActividad
      .postAgregarCategoria(nuevaCtaegoria)
      .subscribe((data) => {
        this.openSnackBar(data.Mensaje);
      });
  }

  async agregarImagenPECS(any): Promise<void> {
    this.nuevaImagenPECS = this.crearActividadPECS_IMAGEN.value;
    this.nuevaImagenPECS.Categoria_id =
      this.crearActividadPECS_IMAGEN.value.CategoriaAsignada;
    this.nuevaImagenPECS.Texto_imagen =
      this.crearActividadPECS_IMAGEN.value.DesctipcionImagen;

    var nuevImagen = new ActividadPECS_Imagenes();
    nuevImagen.Categoria_id = this.nuevaImagenPECS.Categoria_id;
    nuevImagen.Texto_imagen = this.nuevaImagenPECS.Texto_imagen;
    nuevImagen.Id_docente = this.user;
    nuevImagen.Id_estudiante = this.nuevaCategoriaPECS.Id_estudiante;
    nuevImagen.Imagen = this.base64textString;

    this.servicioActividad
      .postAgregarActividadPECS(nuevImagen)
      .subscribe((data) => {
        this.openSnackBar(data.Mensaje);
      });
  }

  //--------------------------------------------------------------------------------------------------

  //SELECCTORES - OPCION
  onSelectAccionTipoActividad(value) {
    this.tipo_actividad_Accion = value;
  }

  onSelectAccionColor(value) {
    this.colorAsignadoA_Categoria = value;
  }

  onSelectAccionAsignarCategoria(value) {
    this.categoriaAsignadaA_Imagen = value;
  }
  //---------------------------------------------------------------------------------------
  //SUBIR IMAGEN
  upload(File) {
    console.log(File);

    var files = File.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();

      reader.onload = this.uploadImage.bind(this);

      reader.readAsBinaryString(file);
    }
  }
  uploadImage(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }

  //---------------------------------------------------------------------------------------

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
