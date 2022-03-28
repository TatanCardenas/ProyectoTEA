import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Actividad } from 'src/app/_model/Actividad';
import { UsuarioAcudiente } from 'src/app/_model/UsuarioAcudiente';
import { ActividadService } from 'src/app/_service/actividad.service';
import { environment } from 'src/environments/environment';

interface tp_actividad {
  value: string;
  actividad_tp: string;
}

@Component({
  selector: 'app-crear-actividad',
  templateUrl: './crear-actividad.component.html',
  styleUrls: ['./crear-actividad.component.css']
})
export class CrearActividadComponent implements OnInit {



  private tipoActividad : UsuarioAcudiente[];
  public id_tipo_actividad: number;
  private actividad = new Actividad();
  public imagen: string;
  private extencionImagen:string;
  public user:string;
  private nuevaActividad = new Actividad();
  public listaActividades  = new MatTableDataSource<Actividad>() 
  public actividad_tipo: tp_actividad[] = [
    {value: '1', actividad_tp: 'Imitacion verbal'},
    {value: '2', actividad_tp: 'Descripción imagen'},
  ]; 


  constructor(private snackBar: MatSnackBar, private servicioActividad:ActividadService) { }

  async ngOnInit(): Promise<void> {
    await this.delay(2000);
    this.datos();
    this.servicioActividad.getListaActividades(this.user).subscribe(data=>{
      this.listaActividades= new MatTableDataSource(data);
    });
  }

  displayedColumns: string[] = ['Nombre Actividad', 'Descripcion', 'Tipo Actividad','Contenido','Eliminar Actividad'];

  crearActividad = new FormGroup({
    nombreActividad : new FormControl(this.actividad.nombreActividad, [Validators.required,Validators.minLength(4),Validators.maxLength(25), Validators.pattern('[a-zA-Z ]+[0-9]*')]),
    tipo_actividad : new FormControl(this.actividad.tipo_actividad, Validators.required),
    descripcion : new FormControl(this.actividad.descripcion, [Validators.required,Validators.minLength(4),Validators.maxLength(25)]),
  })

  actividadImagen = new FormGroup({
    contenido_actividad : new FormControl('',Validators.required)
  });

  public actividadTexto = new FormGroup({
    contenido_actividad : new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(25)])
  });

  agregarActividad(any){
    this.nuevaActividad = this.crearActividad.value;
    this.nuevaActividad.docente_creador = this.user;
    if(this.id_tipo_actividad==1){
      this.nuevaActividad.contenido_actividad = this.actividadTexto.value.contenido_actividad;
      this.servicioActividad.postAgregarActividad(this.nuevaActividad).subscribe(data=>{
        this.openSnackBar(data.Mensaje)
        this.ngOnInit()
      })
      console.log("Se envia un imitacion verbal")
    
    }else if(this.id_tipo_actividad==2){
      this.imagen = this.actividadImagen.value.contenido_actividad;
      this.extencionImagen = this.imagen.substring(this.imagen.lastIndexOf(".") + 1, this.imagen.length);
      this.imagen = (this.imagen.split("\\"))[this.imagen.split("\\").length-1];
      if (this.extencionImagen ==("jpg"||"png"||"jpeg")){
        this.nuevaActividad.contenido_actividad= this.imagen;
        this.servicioActividad.postAgregarActividad(this.nuevaActividad).subscribe(data=>{
          console.log("datos ", data.Mensaje)
          this.openSnackBar(data.Mensaje)
          this.ngOnInit()
        })
      }else{
        this.openSnackBar("Solo puedes seleccionar imagenes")
      }
    }
  }

  onSelect(value){
    this.id_tipo_actividad = value =1 ? value:value;
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
