import { Component, OnInit } from '@angular/core';
import { reduce } from 'rxjs/operators';

@Component({
  selector: 'app-pecs',
  templateUrl: './pecs.component.html',
  styleUrls: ['./pecs.component.css'],
})
export class PecsComponent implements OnInit {
  principal = true;

  actividad1 = 1;
  actividad2 = 1;
  actividad3 = 1;
  actividad4 = 1;
  actividad5 = 1;
  actividad6 = 1;

  backgroundOpc1 = "#ffff";
  backgroundOpc2 = "#ffff";
  backgroundOpc3 = "#ffff";
  backgroundOpc4 = "#ffff";
  backgroundOpc5 = "#ffff";
  backgroundOpc6 = "#ffff";

  constructor() {}

  ngOnInit(): void {}

  actividad(idActividad) {
    switch (idActividad) {
      case 1:
        this.principal = true;
        break;
      case 2:
        this.principal = false;
        break;
      case 3:
        this.principal = false;
        break;
      case 4:
        this.principal = false;
        break;
      case 5:
        this.principal = false;
        break;
      case 6:
        this.principal = false;
        break;
      default:
        break;
    }
  }
}
