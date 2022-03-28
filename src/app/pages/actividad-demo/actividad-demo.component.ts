import { Component, OnInit } from '@angular/core';
import { SpeechService } from 'src/app/_service/speech.service.service';

@Component({
  selector: 'app-actividad-demo',
  templateUrl: './actividad-demo.component.html',
  styleUrls: ['./actividad-demo.component.css']
})
export class ActividadDemoComponent implements OnInit {

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
