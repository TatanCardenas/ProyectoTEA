import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EvaluacionInicial } from 'src/app/_model/EvaluacionInicial';
import { ActividadService } from 'src/app/_service/actividad.service';

@Component({
  selector: 'app-evaluacion-inicial',
  templateUrl: './evaluacion-inicial.component.html',
  styleUrls: ['./evaluacion-inicial.component.css'],
})
export class EvaluacionInicialComponent implements OnInit {
  //almacenamiento de los datos de los servicios (dinamico, cambia dependiendo el servicio solicitado)
  public actividadEvaluacionInicial: EvaluacionInicial[];
  //---------------------------------------------------

  //MODULO Y ACTIVIDAD
  //se compone de 5 modulos (ciencia, matematicas) y cada modulo de 3 actividades
  //conteo que se actualiza al avanzar de modulo
  avanceModulo = 0;
  //define el titulo del modulo
  modulo;
  //conteo que se actualiza al avanzar de actividad
  avanceActividad = 1;
  //define si se encuentra en un avance de actividad o en un avance de modulo
  avanceActividadBandera = false;
  //---------------------------------------------------

  //IDENTIFICADORES
  //da un id al div para definir estilos
  dynamicIdMateria;
  dynamicIdActividad;
  //define el titulo de cada modulo
  tituloEvaluacion;
  //define en el div se el mensaje inicial se visualiza o no se vusualiza
  mensajeInicial = true;
  //---------------------------------------------------

  //CONTENIDO ACTIVIDAD
  //valores que se actualizan segun lo recibido en los servicios y el cambio de modulo
  //imagen de la actividad
  imagen;
  //textos de la actividad
  pronunciacionTxt1;
  pronunciacionTxt2;
  pronunciacionTxt3;
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
  //---------------------------------------------------
  //define el progreso total de la evaluacion, se actualiza dependiendo de la cantidad de actividades y modulos
  progreso = 0;
  //---------------------------------------------------

  constructor(
    private actividadService: ActividadService,
    //permite limpiar las imagenes que llegan en base64 para poder mostrarlas
    private _sanitizer: DomSanitizer
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
    //carga el modulo actual
    this.modulo = 'HOLA DOCENTE! Nos da gusto tenerte aquí';
    //carga variables de la actividad {0}
    this.cargaDeIdentificadores(this.avanceModulo);
    //carga del video
    this.video = '9f862GMvJf8';
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
    if (this.avanceModulo > 0) {
      this.mensajeInicial = false;
      this.avanceActividadBandera = true;
    } else {
      this.avanceActividadBandera = false;
    }
  }

  scrollSecondary(el: HTMLElement): void {
    this.progreso = this.progreso + 7.14;
    if (this.avanceActividadBandera == false) {
      this.avanceModulo = this.avanceModulo + 1;
      this.modulo = 'Modulo ' + this.avanceModulo + '.' + this.avanceActividad;
      switch (this.avanceModulo) {
        case 1: {
          //ciencia
          this.cargaContenidoActividad();
          //carga variables de la actividad {1}
          this.cargaDeIdentificadores(this.avanceModulo);
          this.progreso = 0;
          el.scrollIntoView({ behavior: 'smooth' });
          break;
        }
        case 2: {
          //matematicas
          this.cargaContenidoActividad();
          //carga variables de la actividad {2}
          this.cargaDeIdentificadores(this.avanceModulo);
          el.scrollIntoView({ behavior: 'smooth' });
          break;
        }
        case 3: {
          //
          this.cargaContenidoActividad();
          //carga variables de la actividad {3}
          this.cargaDeIdentificadores(this.avanceModulo);

          el.scrollIntoView({ behavior: 'smooth' });
          break;
        }
        case 4: {
          //
          this.cargaContenidoActividad();
          //carga variables de la actividad {4}
          this.cargaDeIdentificadores(this.avanceModulo);

          el.scrollIntoView({ behavior: 'smooth' });
          break;
        }
        case 5: {
          //
          this.cargaContenidoActividad();
          //carga variables de la actividad {4}
          this.cargaDeIdentificadores(this.avanceModulo);

          el.scrollIntoView({ behavior: 'smooth' });
          break;
        }
        default: {
          //statements

          break;
        }
      }
    } else if (this.avanceActividadBandera == true) {
      this.avanceActividad = this.avanceActividad + 1;
      this.modulo = 'Modulo ' + this.avanceModulo + '.' + this.avanceActividad;
      switch (this.avanceModulo) {
        case 1: {
          //ciencias
          this.cargaContenidoActividad();

          if (this.avanceActividad >= 3) {
            this.avanceActividadBandera = false;
            this.avanceActividad = 1;
            //pre carga los servicios de la siguiente actividad
            this.activityLoad(this.avanceModulo + 1);
          }
          break;
        }
        case 2: {
          //matematicas;
          this.cargaContenidoActividad();

          if (this.avanceActividad >= 3) {
            this.avanceActividadBandera = false;
            this.avanceActividad = 1;
            //pre carga los servicios de la siguiente actividad
            this.activityLoad(this.avanceModulo + 1);
          }
          break;
        }
        case 3: {
          //comunicativas;
          this.cargaContenidoActividad();

          if (this.avanceActividad >= 3) {
            this.avanceActividadBandera = false;
            this.avanceActividad = 1;
            //pre carga los servicios de la siguiente actividad
            this.activityLoad(this.avanceModulo + 1);
          }
          break;
        }
        case 4: {
          //ciudadanas;
          this.cargaContenidoActividad();

          if (this.avanceActividad >= 3) {
            this.avanceActividadBandera = false;
            this.avanceActividad = 1;
            //pre carga los servicios de la siguiente actividad
            this.activityLoad(this.avanceModulo + 1);
          }
          break;
        }
        case 5: {
          //habilid sociales;
          this.cargaContenidoActividad();

          if (this.avanceActividad >= 3) {
            this.avanceActividadBandera = false;
            this.avanceActividad = 1;
            //pre carga los servicios de la siguiente actividad
            this.activityLoad(this.avanceModulo + 1);
          }
          break;
        }
        default: {
          break;
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
    console.log(event.data);
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

  //Consumo de servicios, recibe el modulo actual y solicita el servicio dependiendo de este
  activityLoad(idModulo) {
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
        /*this.actividadService.getEvaluacionInicialComunicacion().subscribe((data) => {
          this.actividadEvaluacionInicial = data;
        });*/
        break;
      case 3:
        //HABILIDADES CIUDADANAS
        /*this.actividadService.getEvaluacionInicialComunicacion().subscribe((data) => {
            this.actividadEvaluacionInicial = data;
          });*/
        break;
      case 3:
        //HABILIDADES SOCIALES
        /*this.actividadService.getEvaluacionInicialComunicacion().subscribe((data) => {
              this.actividadEvaluacionInicial = data;
            });*/
        break;
    }
  }

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
        this.dynamicIdActividad = 'ciudadanas';
        this.dynamicIdMateria = 'ciudadanas';
        this.tituloEvaluacion = 'HABILIDADES CIUDADANAS';
        break;
      case 5:
        this.dynamicIdActividad = 'sentimientos';
        this.dynamicIdMateria = 'sentimientos';
        this.tituloEvaluacion = 'HABILIDADES SOCIALES';
        break;
      default:
        break;
    }
  }

  cargaContenidoActividad() {
    this.pronunciacionTxt1 = this.actividadEvaluacionInicial[0].Lectura;
    this.pronunciacionTxt2 = this.actividadEvaluacionInicial[1].Lectura;
    this.pronunciacionTxt3 = this.actividadEvaluacionInicial[2].Lectura;
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
  }
}
