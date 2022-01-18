import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
declare const webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  error = true;

  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  text = '';
  bandera = 0;
  tempWords: any;

  constructor(private router: Router) { }

  init(): void {
    this.recognition.interimResults = true;
    this.recognition.lang = 'es-ES';

    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
    });
  }

  start(fraseAdecir:String): void {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    this.recognition.addEventListener('end', () => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
      } else {
        this.wordConcat();
        this.recognition.start();
        var frase = this.text.trim();
        var cantidadMinima=0;
        //Para la frase a decir
        var fraseADecir_sin_espacio = this.quitarEspaciosYCaracteresEspeciales(fraseAdecir);
        //Para la frase dicha
        var frase_sin_espacio = this.quitarEspaciosYCaracteresEspeciales(frase);
        //prueba de salida por consola
        console.log("entrada" + frase);
        console.log("fraseDicha " + frase_sin_espacio);
        console.log("frase a decir " + fraseADecir_sin_espacio);
        cantidadMinima = frase_sin_espacio.length<=fraseADecir_sin_espacio.length?frase_sin_espacio.length:fraseADecir_sin_espacio.length;
        console.log("porcentaje de acertividad "+this.porcentrajeDeAcertividad(frase_sin_espacio,fraseADecir_sin_espacio,cantidadMinima)+"%");
        //entrada de condicional
        if (frase.toLocaleLowerCase() == fraseAdecir.toLocaleLowerCase()) {
          this.stop();
          this.text = frase;
          this.bandera=1;
          this.error = true;
        } else {
          this.text = "El mensaje es incorrecto repitelo frase dicha";
          this.stop();
          this.bandera=2;
          this.error = true;
        }
      }
    });
  }
  stop(): void {
    this.text = '';
    this.recognition.stop();
    this.isStoppedSpeechRecog = true;
    this.wordConcat();
  }

  wordConcat(): void {
    this.text = this.text + this.tempWords + ' ';
    this.tempWords = ' ';
  }

  quitarEspaciosYCaracteresEspeciales(palabraAModificar:String):String{
    return palabraAModificar.replace(/[`~!@#$%^&*()_|+\-=?¡¿;:'",.<>\{\}\[\]\\\/]/gi,"").replace(/ /g,'').toLowerCase();
  }

  porcentrajeDeAcertividad(fraseDicha,fraseAdecir,cantidadMinimaDePalabras): number{
    var cant_acertada_de_letras=0;
    var porcentaje=0;
    for(var i=0;i<fraseAdecir.length;i++){
      if(i<cantidadMinimaDePalabras){
        if(fraseAdecir.charAt(i)==fraseDicha.charAt(i)){
          cant_acertada_de_letras++;
        }
      }else{
        break;
      }
    }
    porcentaje=(cant_acertada_de_letras*100)/fraseAdecir.length;
    return porcentaje;
  }
}