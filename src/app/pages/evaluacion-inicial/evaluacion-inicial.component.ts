import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EvaluacionInicial } from 'src/app/_model/EvaluacionInicial';
import { ActividadService } from 'src/app/_service/actividad.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/pages/popup/popup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluacion-inicial',
  templateUrl: './evaluacion-inicial.component.html',
  styleUrls: ['./evaluacion-inicial.component.css'],
})

export class EvaluacionInicialComponent implements OnInit, PopupComponent {
  //RESULTADOS
  //almacenamiento de los datos de los servicios (dinamico, cambia dependiendo el servicio solicitado)
  public actividadEvaluacionInicial: EvaluacionInicial[];
  //almacenamiento de resultados - se inicializa para poder aplicar push()
  public resultados: EvaluacionInicial[] = [];
  //Se da una Respuesta a cada actividad
  public respuestaActividad = new EvaluacionInicial();
  //verifica se hay respuesta
  respuestaBandera = true;
  //---------------------------------------------------

  //MODULO Y ACTIVIDAD
  //se compone de 5 modulos (ciencia, matematicas) y cada modulo de 3 actividades
  //conteo que se actualiza al avanzar de modulo
  avanceModulo = 0;
  //define el titulo del modulo
  modulo;
  //conteo que se actualiza al avanzar de actividad
  avanceActividad = 1;
  //define si se encuentra en un avance de actividad o en un avance de modulo (true-Actividad, false-Modulo)
  avanceActividad_ModuloBandera = false;
  //inactiva y activa al panel actividad
  inactivarActividad=true;
  //---------------------------------------------------

  //IDENTIFICADORES
  //da un id al div para definir estilos
  dynamicIdMateria;
  dynamicIdActividad;
  //define el titulo de cada modulo
  tituloEvaluacion;
  //define en el div si el mensaje inicial y la seccion de audios se visualizan o no se vusualizan
  mensajeInicial_Audios = true;
  //---------------------------------------------------

  //CONTENIDO ACTIVIDAD
  //valores que se actualizan segun lo recibido en los servicios y el cambio de modulo
  //imagen de la actividad
  imagen;
  //textos de la actividad
  pronunciacionTxt1;
  pronunciacionTxt2;
  pronunciacionTxt3;
  //identificador del div pronunciacion
  idOpcionTxtActivateRight = 'opcion-txt-activate-right';
  idOpcionTxtActivateLeft = 'opcion-txt-activate-left';
  idOpcionTxtActivateCenter = 'opcion-txt-activate-center';
  //identificador del div cambio color de fuente
  idOpcionTxtActivateColorFontRight = 'opcion-txt-inactivate-color-font-right';
  idOpcionTxtActivateColorFontLeft = 'opcion-txt-inactivate-color-font-left';
  idOpcionTxtActivateColorFontCenter =
    'opcion-txt-inactivate-color-font-center';
  //audios de la actividad
  audio1;
  audio2;
  audio3;
  //video
  ///El video se consume por medio de la API de youtube y requiere de estas variables
  //define las dimenciones y el iframe del video
  public YT: any;
  //define el video que se va a reproducir
  public video: any;
  //define el div
  public player: any;
  public reframed: Boolean = false;
  //control de botones
  primerBoton = true;
  segundoboton = false;
  //---------------------------------------------------
  //define el progreso total de la evaluacion, se actualiza dependiendo de la cantidad de actividades y modulos
  progreso = 0;
  //---------------------------------------------------

  constructor(
    private actividadService: ActividadService,
    //permite limpiar las imagenes que llegan en base64 para poder mostrarlas
    private _sanitizer: DomSanitizer,
    //permite generar ventana emergente
    public dialog: MatDialog,
    //router para redireccion
    private router: Router
  ) {}

  ngOnInit(): void {
    //inicializa las informacion de la actividad informativa
    this.buildFrom();
    //inicializa el video
    this.initVideo();
    //pre carga los servicios de la siguiente actividad
    this.activityLoad(this.avanceModulo + 1);
  }

  private buildFrom() {
    //carga el modulo actual actividad {0}
    this.modulo = 'HOLA DOCENTE! Nos da gusto tenerte aquí';
    //carga variables de la actividad {0}
    this.cargaDeIdentificadores(this.avanceModulo);
    //carga del video actividad {0}
    this.video = '9f862GMvJf8';
  }

  scroll(el: HTMLElement) {
    if (this.avanceModulo >= 5) {
      for(var i=0;i<13;i++){
        console.log("Resultado"+i+" "+this.resultados[i].respuesta);
      }
      this.router.navigate(['/inicio']);
    } else {
      //trasladar vista
      el.scrollIntoView({ behavior: 'smooth' });
      if (this.avanceModulo == 0) {
        this.avanceActividad_ModuloBandera = false;
        //ajuste botones
        this.primerBoton = false;
        this.segundoboton = true;
      } else if (this.avanceModulo > 0 && this.avanceModulo < 5) {
        //se deshabilita el mensaje inicial y se habilita la seccion de audios
        this.mensajeInicial_Audios = false;
        this.avanceActividad_ModuloBandera = true;
        //ajuste botones
        this.primerBoton = false;
        this.segundoboton = true;
      }
    }
  }

  scrollSecondary(el: HTMLElement): void {
    //verifica si respondio la pregunta
    if (this.respuestaBandera == false) {
      this.popupDialog();
    } else if (this.respuestaBandera == true) {
      this.progreso = this.progreso + 7.8;
      //Modulo
      if (this.avanceActividad_ModuloBandera == false) {
        this.avanceModulo = this.avanceModulo + 1;
        this.modulo =
          'Modulo ' + this.avanceModulo + '.' + this.avanceActividad;
        switch (this.avanceModulo) {
          case 1: {
            //ciencia
            //carga variables de la actividad {1}
            this.avanzarModulo(this.avanceModulo, el);
            break;
          }
          case 2: {
            //matematicas
            //carga variables de la actividad {2}
            this.avanzarModulo(this.avanceModulo, el);
            break;
          }
          case 3: {
            //comunicacion
            //carga variables de la actividad {3}
            this.avanzarModulo(this.avanceModulo, el);
            break;
          }
          case 4: {
            //habili ciudadanas
            //carga variables de la actividad {4}
            this.avanzarModulo(this.avanceModulo, el);
            break;
          }
          case 5: {
            //final - envio respuestas
            this.avanzarModulo(this.avanceModulo, el);
            console.log('prueba modulo 5');
            break;
          }
          default: {
            //statements

            break;
          }
        }
        //Actividad
      } else if (this.avanceActividad_ModuloBandera == true) {
        this.avanceActividad = this.avanceActividad + 1;
        this.modulo =
          'Modulo ' + this.avanceModulo + '.' + this.avanceActividad;
        switch (this.avanceModulo) {
          case 1: {
            //ciencias
            //carga variables de la actividad {1}
            this.avanzarActividad();
            break;
          }
          case 2: {
            //matematicas;
            //carga variables de la actividad {2}
            this.avanzarActividad();
            break;
          }
          case 3: {
            //comunicativas;
            //carga variables de la actividad {3}
            this.avanzarActividad();
            break;
          }
          case 4: {
            //ciudadanas;
            //carga variables de la actividad {4}
            this.avanzarActividad();
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  }

  //CONFIGURACION DE VIDEO
  //Inicializacion del metodo para YT Iframe consumiendo la API
  initVideo() {
    var tag = document.createElement('script');
    tag.src = 'http://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // crea el iframe despues de el consumo de la API
    window['onYouTubeIframeAPIReady'] = () => this.startVideo();
  }
  //Inicializacion del Iframe, definicion de sus caracteristicas y reproduccion del video
  startVideo() {
    this.reframed = false;
    this.player = new window['YT'].Player('player', {
      height: '100%',
      width: '100%',
      videoId: this.video,
      playerVars: {
        autoplay: 1,
        modestbranding: 1,
        controls: 1,
        disablekb: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        playsinline: 1,
        width: 100,
      },
      events: {
        onStateChange: this.onPlayerStateChange.bind(this),
        onError: this.onPlayerError.bind(this),
        onReady: this.onPlayerReady.bind(this),
      },
    });
  }
  //para el video
  stopVideo() {
    this.player.stopVideo();
  }
  //se llama cuando el video esta en reproduccion
  onPlayerReady(event) {
    event.target.playVideo();
  }
  //permite las funciones de reproducir y parar el video desde el iframe
  onPlayerStateChange(event) {
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() == 0) {
          console.log('started ' + this.cleanTime());
        } else {
          console.log('playing ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          console.log('paused' + ' @ ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ended ');
        break;
    }
  }
  cleanTime() {
    return Math.round(this.player.getCurrentTime());
  }
  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log('' + this.video);
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    }
  }
  //------------------------------------------------------------------------------------

  //REPRODUCCION DE AUDIOS
  //Permite la reproduccion de Voz
  pronuntiation(pronunciacionTxt1) {
    //pone en pausa el video para que no exista interferencia de audios
    this.stopVideo();
    //carga libreria para reconocer textos
    var synth = window.speechSynthesis;
    //utiliza el texto para reproducirlo en voz
    var utterance = new SpeechSynthesisUtterance(pronunciacionTxt1);
    synth.speak(utterance);
  }
  //permite la reproduccion de los audios segun el div
  repruducirAudio(id) {
    const audiosPlay = new Audio();
    //pone en pausa el video para que no exista interferencia de audios
    this.stopVideo();
    //carga los audios dependiendo de la actividad en la que se encuentre y el boton que de clic
    switch (id) {
      case 1:
        audiosPlay.src = this.audio1;
        audiosPlay.load();
        audiosPlay.play();
        break;
      case 2:
        audiosPlay.src = this.audio2;
        audiosPlay.load();
        audiosPlay.play();
        break;
      case 3:
        audiosPlay.src = this.audio3;
        audiosPlay.load();
        audiosPlay.play();
        break;
    }
  }
  //------------------------------------------------------------------------------------

  //CONSUMO DE SERVICIOS
  //Recibe el modulo actual y solicita el servicio dependiendo de este
  activityLoad(idModulo) {
    console.log("Modulo "+idModulo);
    switch (idModulo) {
      case 1:
        //CIENCIAS
        this.actividadService
          .getEvaluacionInicialCiencias()
          .subscribe((data_ciencias) => {
            this.actividadEvaluacionInicial = data_ciencias;
          });
        break;
      case 2:
        //MATEMATICAS
        this.actividadService
          .getEvaluacionInicialMatematicas()
          .subscribe((data_matematicas) => {
            this.actividadEvaluacionInicial = data_matematicas;
          });
        break;
      case 3:
        //COMUNICACION
        this.actividadService
          .getEvaluacionInicialComunicacion()
          .subscribe((data_comunicacion) => {
            this.actividadEvaluacionInicial = data_comunicacion;
          });
        break;
      case 4:
        //HABILIDADES SOCIALES
        this.actividadService
          .getEvaluacionInicialHabilidadesSociales()
          .subscribe((data_habilSociales) => {
            this.actividadEvaluacionInicial = data_habilSociales;
          });
        break;
      case 5:
        break;
    }
  }
  //------------------------------------------------------------------------------------

  //CARGA DE CONTENIDO ACTIVIDAD
  cargaDeIdentificadores(idModulo) {
    switch (idModulo) {
      case 0:
        this.dynamicIdMateria = 'inicial';
        this.dynamicIdActividad = 'inicial';
        this.tituloEvaluacion = 'EVALUACION INICIAL';
        break;
      case 1:
        this.dynamicIdActividad = 'ciencia';
        this.dynamicIdMateria = 'ciencia';
        this.tituloEvaluacion = 'CIENCIA';
        break;
      case 2:
        this.dynamicIdActividad = 'matematicas';
        this.dynamicIdMateria = 'matematicas';
        this.tituloEvaluacion = 'MATEMATICAS';
        break;
      case 3:
        this.dynamicIdActividad = 'comunicativas';
        this.dynamicIdMateria = 'comunicativas';
        this.tituloEvaluacion = 'COMUNICACIÓN';
        break;
      case 4:
        this.dynamicIdActividad = 'sentimientos';
        this.dynamicIdMateria = 'sentimientos';
        this.tituloEvaluacion = 'HABILIDADES SOCIALES';
        break;
      case 5:
        this.dynamicIdActividad = 'finalizacion';
        this.dynamicIdMateria = 'finalizacion';
        this.tituloEvaluacion = 'EVALUACIÓN FINALIZADA';
        break;
      default:
        break;
    }
  }

  cargaContenidoActividad() {
    //despintar botones
    this.cambioColorFuenteYboton(
      'opcion-txt-activate-right',
      'opcion-txt-activate-left',
      'opcion-txt-activate-center',
      'opcion-txt-inactivate-color-font-right',
      'opcion-txt-inactivate-color-font-left',
      'opcion-txt-inactivate-color-font-center'
    );
    //desordena la lista de 3 numeros aleatoriamente
    var lista = [0, 1, 2];
    lista = lista.sort(function () {
      return Math.random() - 0.5;
    });
    this.pronunciacionTxt1 = this.actividadEvaluacionInicial[lista[0]].Lectura;
    this.pronunciacionTxt2 = this.actividadEvaluacionInicial[lista[1]].Lectura;
    this.pronunciacionTxt3 = this.actividadEvaluacionInicial[lista[2]].Lectura;
    this.imagen = this._sanitizer.bypassSecurityTrustResourceUrl(
      'data:image/jpg;base64,' +
        this.actividadEvaluacionInicial[this.avanceActividad - 1].Imagen
    );
    this.audio1 =
      'data:audio/mpeg;base64,' +
      this.actividadEvaluacionInicial[this.avanceActividad - 1].Audio1;
    this.audio2 =
      'data:audio/mpeg;base64,' +
      this.actividadEvaluacionInicial[this.avanceActividad - 1].Audio2;
    this.audio3 =
      'data:audio/mpeg;base64,' +
      this.actividadEvaluacionInicial[this.avanceActividad - 1].Audio3;
    this.video =
      this.actividadEvaluacionInicial[this.avanceActividad - 1].Video;
    this.player.loadVideoById({
      videoId: this.video,
    });
    //Desactivar bandera de respuesta
    this.respuestaBandera = false;
  }
  //------------------------------------------------------------------------------------

  /* ALMACENAMIENTO DE RESPUESTAS */

  cargarRespuesta(respuesta, idRespuesta) {
    //Activar bandera si hay respuesta
    this.respuestaBandera = true;
    switch (idRespuesta) {
      case 1:
        //cambio estilos
        this.cambioColorFuenteYboton(
          'opcion-txt-activate-right',
          'opcion-txt-activate-left-clic',
          'opcion-txt-activate-center',
          'opcion-txt-inactivate-color-font-right',
          'opcion-txt-activate-color-font-left',
          'opcion-txt-inactivate-color-font-center'
        );
        //verifica respuesta
        this.respuestaActividad = this.verificarRespuesta(respuesta);
        break;
      case 2:
        //cambio estilos
        this.cambioColorFuenteYboton(
          'opcion-txt-activate-right',
          'opcion-txt-activate-left',
          'opcion-txt-activate-center-clic',
          'opcion-txt-inactivate-color-font-right',
          'opcion-txt-inactivate-color-font-left',
          'opcion-txt-activate-color-font-center'
        );
        //verifica respuesta
        this.respuestaActividad = this.verificarRespuesta(respuesta);

        break;
      case 3:
        //cambio estilos
        this.cambioColorFuenteYboton(
          'opcion-txt-activate-right-clic',
          'opcion-txt-activate-left',
          'opcion-txt-activate-center',
          'opcion-txt-activate-color-font-right',
          'opcion-txt-inactivate-color-font-left',
          'opcion-txt-inactivate-color-font-center'
        );
        //verifica respuesta
        this.respuestaActividad = this.verificarRespuesta(respuesta);

      default:
        break;
    }
  }

  cambioColorFuenteYboton(
    opcionRight,
    opcionLeft,
    opcionCenter,
    fuenteRight,
    fuenteLeft,
    fuenteCenter
  ) {
    //Cambio estilos (color) opciones
    this.idOpcionTxtActivateRight = opcionRight;
    this.idOpcionTxtActivateLeft = opcionLeft;
    this.idOpcionTxtActivateCenter = opcionCenter;
    //Cambio estilos (color) fuentes
    this.idOpcionTxtActivateColorFontRight = fuenteRight;
    this.idOpcionTxtActivateColorFontLeft = fuenteLeft;
    this.idOpcionTxtActivateColorFontCenter = fuenteCenter;
  }

  verificarRespuesta(respuesta) {
    var respuestaActividad = new EvaluacionInicial();
    //respuesta dada
    respuestaActividad.Lectura = respuesta;
    if (
      respuestaActividad.Lectura ==
      this.actividadEvaluacionInicial[this.avanceActividad - 1].Lectura
    ) {
      respuestaActividad.respuesta = true;
    } else if (
      respuestaActividad.Lectura !=
      this.actividadEvaluacionInicial[this.avanceActividad - 1].Lectura
    ) {
      respuestaActividad.respuesta = false;
    }
    //realiza cambio de modulo
    this.cambioModulo();

    return respuestaActividad;
  }

  //No existe una respuesta
  popupDialog() {
    this.dialog.open(PopupComponent, {
      width: '30%',
    });
  }

  //------------------------------------------------------------------------------------

  //CAMBIO DE MODULO Y ACTIVIDAD
  //avanzar actividad
  avanzarActividad() {
    //almacenar la respuesta
    this.resultados.push(this.respuestaActividad);
    //carga el contenido de la actividad
    this.cargaContenidoActividad();
  }

  //avanzar modulo
  avanzarModulo(avanceModulo, el) {
    //almacenar la respuesta
    this.resultados.push(this.respuestaActividad);
    if (avanceModulo <= 4) {
      //carga el contenido de la actividad
      this.cargaContenidoActividad();
    }else{
      //quita panel actividad 
      this.inactivarActividad= false;

    }
    //carga variables de la actividad {1}
    this.cargaDeIdentificadores(avanceModulo);
    //trasladar vista
    el.scrollIntoView({ behavior: 'smooth' });
    //ajuste botones
    this.primerBoton = true;
    this.segundoboton = false;
  }

  //realiza cambio de modulo al finalizar cada actividad
  cambioModulo() {
    if (this.avanceActividad >= 3) {
      //cambio a modulo
      this.avanceActividad_ModuloBandera = false;
      //reinicia actividad
      this.avanceActividad = 1;
      //pre carga los servicios del siguiente modulo
      this.activityLoad(this.avanceModulo + 1);
    }
  }
  //------------------------------------------------------------------------------------
}
