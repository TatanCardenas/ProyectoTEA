import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuardianService implements CanActivate {

  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url = state.url;
    try {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN));
      let rol = decodedToken.Rol;
      //Apartados solo para Docentes
      if ((url.includes('/crearActividad')) && (rol == 1)) {
        return true;
      }
      else if ((url.includes('/administrarActividad')) && (rol == 1)) {
        return true;
      }
      else if ((url.includes('/misActividades')) && (rol == 1)) {
        return true;
      }
      //Apartados que pueden ver los docentes y los estudiantes
      else if ((url.includes('/pecs')) && (rol == 1 || rol == 3)) {
        return true;
      }
      else if ((url.includes('/evaluacionInicial')) && (rol == 1 || rol == 3)) {
        return true;
      }
      else if ((url.includes('/panelActividades') || (url.includes('/actividad'))) && (rol == 1 || rol == 3)) {
        return true;
      }
      else if ((url.includes('/actividad')) && (rol == 1 || rol == 3)) {
        return true;
      }
      else if ((url.includes('/panelActividadesDeImitacion')) && (rol == 1 || rol == 3)) {
        return true;
      }
      //Apartados que pueden ver el docente y acudiente
      else if ((url.includes('/graficas')) && (rol == 1 || rol == 2)) {
        return true;
      }
      else if ( ((url.includes('/enlazarNino/1')) && (rol == 1)) || ((url.includes('/enlazarNino/2')) && (rol == 2))) {
        return true
      }
      else if ((url.includes('/panelResultados')) && (rol == 1 || rol == 2)) {
        return true;
      }
      //perfil para los usuarios
      else if ((url.includes('/perfil')) && (rol == 1 || rol == 2)) {
        return true
      }
      //para registrar pacientes 
      else if ((url.includes('/registro/3')) && (rol == 1 || rol == 2)) {
        return true;
      }
      else {
        this.router.navigate(['']);
      }
    } catch (e) {
      //registrar docente o acudiente
      if ((url.includes('/registro/1')) || (url.includes('/registro/2'))) {
        return true;
      }
      this.router.navigate(['']);
    }
  }

}
