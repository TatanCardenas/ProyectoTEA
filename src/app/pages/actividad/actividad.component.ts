import { Component, OnInit } from '@angular/core';
import { SpeechService } from 'src/app/_service/speech.service.service';
@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})
export class ActividadComponent implements OnInit {

  public fraseADecir: String = "El árbol es verde.";
  constructor(public speech: SpeechService) {
    this.speech.init();
  }

  ngOnInit(): void {
  }

  startService(): void {
    this.speech.text = '';
    this.speech.start(this.fraseADecir);
    this.speech.error = false;
  }

}
