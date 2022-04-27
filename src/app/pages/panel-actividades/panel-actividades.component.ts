import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import CryptoJS from "crypto-js";
@Component({
  selector: 'app-panel-actividades',
  templateUrl: './panel-actividades.component.html',
  styleUrls: ['./panel-actividades.component.css']
})
export class PanelActividadesComponent implements OnInit {

  private id_tp_activity;
  constructor(private router: Router) { }

  ngOnInit(){
  }

  actividadSeleccionada(Id_actividad_tipo){
    let pagina = 'panelActividadesDeImitacion';
    switch(Id_actividad_tipo){
      case 1:
        pagina = 'panelActividadesDeImitacion';
        break;
      case 2:
        do{
          this.id_tp_activity = CryptoJS.AES.encrypt(JSON.stringify(0), 'secret key').toString();
        }while(this.id_tp_activity.includes('/'))
        pagina='actividad/'+this.id_tp_activity
        break;
    }
    this.router.navigate([pagina]);
  }
  private delay(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
