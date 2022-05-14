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

        pagina = 'pecs';
        break;
    }
    this.router.navigate([pagina]);
  }
  private delay(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
