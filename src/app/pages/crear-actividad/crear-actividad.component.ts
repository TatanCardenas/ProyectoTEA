import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Actividad } from 'src/app/_model/Actividad';
import { UsuarioAcudiente } from 'src/app/_model/UsuarioAcudiente';
import { ActividadService } from 'src/app/_service/actividad.service';
import { environment } from 'src/environments/environment';
import { AngularFireStorage } from '@angular/fire/storage'
import { async } from 'rxjs/internal/scheduler/async';
import { finalize } from "rxjs/operators";
import { Observable } from 'rxjs';
import { TypeActivity } from 'src/app/_model/TypeActivity';

@Component({
  selector: 'app-crear-actividad',
  templateUrl: './crear-actividad.component.html',
  styleUrls: ['./crear-actividad.component.css']
})
export class CrearActividadComponent implements OnInit {

  uploadURL: Observable<string>;
  uploadProgress: Observable<number>;

  private tipoActividad : UsuarioAcudiente[];
  public id_tipo_actividad: number;
  private actividad = new Actividad();
  public imagen: string;
  public pruebaImagen;
  private extencionImagen:string;
  private pathImagen;
  public user:string;
  private dateNow;
  private nuevaActividad = new Actividad();
  public listaActividades  = new MatTableDataSource<Actividad>() 
  public actividad_tipo: TypeActivity[];


  constructor(private snackBar: MatSnackBar, private servicioActividad:ActividadService,
    private serviceAngularFireBase:AngularFireStorage) { }

  async ngOnInit(): Promise<void> {
    await this.delay(1000);
    this.datos();
    this.servicioActividad.getListaActividades(1,this.user).subscribe(data=>{
      this.listaActividades= new MatTableDataSource(data);
    });
    this.servicioActividad.getTypeActivity().subscribe(data=>{
      this.actividad_tipo = data;
    });
  }

  displayedColumns: string[] = ['Nombre Actividad', 'Descripcion', 'Tipo Actividad','Contenido','Eliminar Actividad'];

  crearActividad = new FormGroup({
    nombreActividad : new FormControl(this.actividad.NombreActividad, [Validators.required,Validators.minLength(4),Validators.maxLength(25), Validators.pattern('[a-zA-Z ]+[0-9]*')]),
    tipo_actividad : new FormControl(this.actividad.Tipo_actividad, Validators.required),
    descripcion : new FormControl(this.actividad.Descripcion, [Validators.required,Validators.minLength(4),Validators.maxLength(25)]),
  })

  actividadImagen = new FormGroup({
    contenido_actividad : new FormControl('',Validators.required)
  });

  public actividadTexto = new FormGroup({
    contenido_actividad : new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(25)])
  });

  async agregarActividad(any): Promise<void> {
    this.nuevaActividad = this.crearActividad.value;
    this.nuevaActividad.Docente_creador = this.user;
    if(this.id_tipo_actividad==1){
      this.nuevaActividad.Contenido_actividad = this.actividadTexto.value.contenido_actividad;
      this.servicioActividad.postAgregarActividad(this.nuevaActividad).subscribe(data=>{
        this.openSnackBar(data.Mensaje)
        this.ngOnInit()
      })
      console.log("Se envia un imitacion verbal")
    
    }else if(this.id_tipo_actividad==2){
      this.dateNow = new Date().toLocaleString().replace(/[`~!@#$%^&*()_|+\-=?¡¿;:'",.<>\{\}\[\]\\\/]/gi,"").replace(" ","");
      this.dateNow = this.dateNow + new Date().getMilliseconds();
      this.imagen = this.actividadImagen.value.contenido_actividad;
      this.extencionImagen = this.imagen.substring(this.imagen.lastIndexOf(".") + 1, this.imagen.length);
      this.imagen = this.dateNow+this.user;
      if (this.extencionImagen ==("jpg"||"png"||"jpeg")){
        this.nuevaActividad.Contenido_actividad= this.imagen;
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
      }else{
        this.openSnackBar("Solo puedes seleccionar imagenes")
      }
    }
  }

  onSelect(value){
    this.id_tipo_actividad = value =1 ? value:value;
  }

  upload($event){
    console.log($event.target.files[0])
    this.pathImagen= $event.target.files[0];
  }
  uploadImage(){

  }
  eliminarActividad(id_actividad){
    console.log("id actividad "+ id_actividad)
    this.servicioActividad.deleteElminarActividad(id_actividad).subscribe(data=>{
      this.openSnackBar(data)
      this.ngOnInit()
    })
  }




  private openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Aceptar', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  } 

  private delay(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  
  datos(){
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    this.user = decodedToken.Usuario;
    console.log(this.user)
  }
}
