import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActividadService } from 'src/app/_service/actividad.service';
import { SpeechService } from 'src/app/_service/speech.service.service';
import { PopupComponent } from 'src/app/pages/popup/popup.component';
@Component({
  selector: 'app-actividad-demo',
  templateUrl: './actividad-demo.component.html',
  styleUrls: ['./actividad-demo.component.css']
})
export class ActividadDemoComponent implements OnInit {

  public fraseADecir: String = "El árbol es verde";
  public dialogRef;
  public resultadoPuntaje=-1;
  textomensaje: string;
  constructor(public speech: SpeechService,private puntajeService:ActividadService,
    public dialog: MatDialog) {
    this.speech.init();
  }

  ngOnInit(): void {
  }

  startService(): void {
    this.speech.text = '';
    this.speech.start();
    this.speech.error = false;
  }
  verPuntaje(){
    if(this.speech.text != null && this.speech.text != '' && this.speech.text != "undefined"){
      this.puntajeService.getScoreImitationActivity(this.fraseADecir,this.speech.text).subscribe(data=>{
        this.resultadoPuntaje= data;
      })
    }
    else{
      this.textomensaje = "PRIMERO INTENTA DECIR LA PALABRA";
      this.popupDialog();
    }
  }

  popupDialog() {
    this.dialogRef = this.dialog.open(PopupComponent, {
      width: '30%',
      data: { txtMensaje: this.textomensaje },
    });
  }
}
