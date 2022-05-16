import { Component, OnInit } from '@angular/core';
import { reduce } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { UsuarioPaciente } from 'src/app/_model/UsuarioPaciente';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { Usuario } from 'src/app/_model/Usuario';
import { ActividadPECS_Categorias } from 'src/app/_model/ActividadPECS_Categorias';
import { ActividadPECS_Imagenes } from 'src/app/_model/ActividadPECS_Imagenes';
import { ActividadService } from 'src/app/_service/actividad.service';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-pecs',
  templateUrl: './pecs.component.html',
  styleUrls: ['./pecs.component.css'],
})
export class PecsComponent implements OnInit {
  public usuarioSesion = new Usuario();
  public usuarioDatos = new UsuarioPaciente();
  public infoCategorias = new ActividadPECS_Categorias();
  public infoImagenes = new ActividadPECS_Imagenes();
  principal = true;
  actividadActual = 0;
  imagenTomada;
  texto_imagenTomada;

  actividadTxt: string[] = [
    'INICIAL',
    'cargando...',
    'cargando...',
    'cargando...',
    'cargando...',
    'cargando...',
  ];

  backgroundOpc_Activity: string[] = [
    '#E2E2E2',
    '#E2E2E2',
    '#E2E2E2',
    '#E2E2E2',
    '#E2E2E2',
    '#E2E2E2',
  ];

  imagenesPECS: string[] = [
    '../../../assets/image/autismo.jpg',
    '../../../assets/image/autismo.jpg',
    '../../../assets/image/autismo.jpg',
    '../../../assets/image/autismo.jpg',
    '../../../assets/image/autismo.jpg',
    '../../../assets/image/autismo.jpg',
  ];

  imagenesPECS_texto: string[] = [
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
  ];

  imagenesSeleccionadasPECS: string[] = [
    '../../../assets/image/autismo.jpg',
    '../../../assets/image/autismo.jpg',
    '../../../assets/image/autismo.jpg',
  ];

  textosSeleccionadosPECS: string[] = [
    ' sin selección ',
    ' sin selección ',
    ' sin selección ',
  ];

  activacionOpcionPECS: boolean[] = [true, true, true, true, true, true];

  constructor(
    private usuarioService: UsuarioService,
    private actividadService: ActividadService,
    private _sanitizer: DomSanitizer
  ) {}

  async ngOnInit(): Promise<void> {
    this.datosSesion();
    this.cargarInfoDocenteEnlazado(this.usuarioSesion.numero_documento);
  }

  datosSesion() {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN);
    const decodedToken = helper.decodeToken(token);
    this.usuarioSesion.numero_documento = decodedToken.Usuario;
  }

  cargarInfoDocenteEnlazado(documento) {
    this.usuarioService.datosPaciente(documento).subscribe((datos) => {
      this.usuarioDatos = datos;
      this.cargarCategoriasActividad(
        this.usuarioDatos.documento_docente,
        this.usuarioDatos.documento
      );
    });
  }

  cargarCategoriasActividad(documentoDocente, documentoPaciente) {
    this.actividadService
      .getCategoriasPECS(documentoDocente, documentoPaciente)
      .subscribe((data) => {
        this.infoCategorias = data;
        this.cargarCategoriasPECS(this.infoCategorias);
      });
  }

  cargarCategoriasPECS(infoCategorias) {
    for (var i = 0; i < 5; i++) {
      this.actividadTxt[i + 1] = infoCategorias[i].categoria;
      this.backgroundOpc_Activity[i + 1] = infoCategorias[i].color;
    }
  }

  cargarImagenesActividad(
    documentoDocente,
    documentoPaciente,
    actividadActual
  ) {
    this.actividadService
      .getImagenesPECS(documentoDocente, documentoPaciente, actividadActual)
      .subscribe((data) => {
        this.infoImagenes = data;
        this.cargarImagenesPECS(this.infoImagenes);
      });
  }

  cargarImagenesPECS(infoImagenesE) {
    this.imagenesPECS.splice(0, this.imagenesPECS.length);
    this.imagenesPECS_texto.splice(0, this.imagenesPECS_texto.length);
    if (Object.entries(infoImagenesE).length > 0) {
      for (var i = 0; i < 6; i++) {
        try {
          this.imagenesPECS[i] = this._sanitizer.bypassSecurityTrustResourceUrl(
            'data:image/jpg;base64,' + infoImagenesE[i].imagen
          ) as string;
          this.imagenesPECS_texto[i] = infoImagenesE[i].texto_imagen;
        } catch (error) {
          this.imagenesPECS[i] = '../../../assets/image/autismo.jpg';
          this.imagenesPECS_texto[i] = ' '; 
        }
      }
    } else if (Object.entries(infoImagenesE).length == 0) {
      for (var i = 0; i < 6; i++) {
        this.imagenesPECS[i] = '../../../assets/image/autismo.jpg';
        this.imagenesPECS_texto[i] = ' '; 
      }
    }
  }

  actividad(idActividad) {
    switch (idActividad) {
      case 1:
        this.principal = true;
        this.actividadActual = 0;
        break;
      case 2:
        this.principal = false;
        this.actividadActual = 1;
        this.cargarImagenesActividad(
          this.usuarioDatos.documento_docente,
          this.usuarioDatos.documento,
          this.actividadActual
        );
        this.activacionOpcionPECS = [true, true, true, true, true, true];
        break;
      case 3:
        this.principal = false;
        this.actividadActual = 2;
        this.cargarImagenesActividad(
          this.usuarioDatos.documento_docente,
          this.usuarioDatos.documento,
          this.actividadActual
        );
        this.activacionOpcionPECS = [true, true, true, true, true, true];
        break;
      case 4:
        this.principal = false;
        this.actividadActual = 3;
        this.cargarImagenesActividad(
          this.usuarioDatos.documento_docente,
          this.usuarioDatos.documento,
          this.actividadActual
        );
        this.activacionOpcionPECS = [true, true, true, true, true, true];
        break;
      case 5:
        this.principal = false;
        this.actividadActual = 4;
        this.cargarImagenesActividad(
          this.usuarioDatos.documento_docente,
          this.usuarioDatos.documento,
          this.actividadActual
        );
        this.activacionOpcionPECS = [true, true, true, true, true, true];
        break;
      case 6:
        this.principal = false;
        this.actividadActual = 5;
        this.cargarImagenesActividad(
          this.usuarioDatos.documento_docente,
          this.usuarioDatos.documento,
          this.actividadActual
        );
        this.activacionOpcionPECS = [true, true, true, true, true, true];
        break;
      default:
        break;
    }
  }

  SeleccionImagen(id_imagen) {
    switch (id_imagen) {
      case 0:
        if (this.activacionOpcionPECS[0] == false) {
          this.activacionOpcionPECS[0] = true;
        } else if (this.activacionOpcionPECS[0] == true) {
          this.activacionOpcionPECS = [false, true, true, true, true, true];
        }
        this.imagenTomada = this.imagenesPECS[0];
        this.texto_imagenTomada = this.imagenesPECS_texto[0];

        break;
      case 1:
        if (this.activacionOpcionPECS[1] == false) {
          this.activacionOpcionPECS[1] = true;
        } else if (this.activacionOpcionPECS[1] == true) {
          this.activacionOpcionPECS = [true, false, true, true, true, true];
        }
        this.imagenTomada = this.imagenesPECS[1];
        this.texto_imagenTomada = this.imagenesPECS_texto[1];
        break;
      case 2:
        if (this.activacionOpcionPECS[2] == false) {
          this.activacionOpcionPECS[2] = true;
        } else if (this.activacionOpcionPECS[2] == true) {
          this.activacionOpcionPECS = [true, true, false, true, true, true];
        }
        this.imagenTomada = this.imagenesPECS[2];
        this.texto_imagenTomada = this.imagenesPECS_texto[2];
        break;
      case 3:
        if (this.activacionOpcionPECS[3] == false) {
          this.activacionOpcionPECS[3] = true;
        } else if (this.activacionOpcionPECS[3] == true) {
          this.activacionOpcionPECS = [true, true, true, false, true, true];
        }
        this.imagenTomada = this.imagenesPECS[3];
        this.texto_imagenTomada = this.imagenesPECS_texto[3];
        break;
      case 4:
        if (this.activacionOpcionPECS[4] == false) {
          this.activacionOpcionPECS[4] = true;
        } else if (this.activacionOpcionPECS[4] == true) {
          this.activacionOpcionPECS = [true, true, true, true, false, true];
        }
        this.imagenTomada = this.imagenesPECS[4];
        this.texto_imagenTomada = this.imagenesPECS_texto[4];
        break;
      case 5:
        if (this.activacionOpcionPECS[5] == false) {
          this.activacionOpcionPECS[5] = true;
        } else if (this.activacionOpcionPECS[5] == true) {
          this.activacionOpcionPECS = [true, true, true, true, true, false];
        }
        this.imagenTomada = this.imagenesPECS[5];
        this.texto_imagenTomada = this.imagenesPECS_texto[5];
        break;
      default:
        break;
    }
  }

  ColocarImagen(id_imagen) {
    switch (id_imagen) {
      case 0:
        this.imagenesSeleccionadasPECS[0] = this.imagenTomada;
        this.textosSeleccionadosPECS[0]= this.texto_imagenTomada;
        break;
      case 1:
        this.imagenesSeleccionadasPECS[1] = this.imagenTomada;
        this.textosSeleccionadosPECS[1]= this.texto_imagenTomada;
        break;
      case 2:
        this.imagenesSeleccionadasPECS[2] = this.imagenTomada;
        this.textosSeleccionadosPECS[2]= this.texto_imagenTomada;
        break;
      default:
        break;
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
