import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-actividades',
  templateUrl: './mis-actividades.component.html',
  styleUrls: ['./mis-actividades.component.css'],
})
export class MisActividadesComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  opcion(id) {
    if (id == 1) {
      this.router.navigate(['/administrarActividad/1']);
    } else if (id == 2) {
      this.router.navigate(['/administrarActividad/2']);
    }
  }
}
