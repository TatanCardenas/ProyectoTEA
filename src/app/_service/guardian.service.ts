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
      console.log(rol)
      if ((url.includes('/perfil')) && (rol == 1 || rol == 2)) {
        return true
      }
      else if ((url.includes('/registrarP')) && rol == 1) {
        return true
      }
      else if ((url.includes('/enlazarNino/2')) && (rol == 2)) {
        return true
      }
      else if ((url.includes('/enlazarNino/1')) && (rol == 1)) {
        return true
      }
      else if ((url.includes('/registro/3')) && (rol == 1 || rol == 2)) {
        return true;
      } else if ((url.includes('/crearActividad')) && (rol == 1)) {
        return true;
      } else if ((url.includes('/panelActividades') || (url.includes('/actividad'))) && (rol == 1 || rol == 3)) {
        return true;
      }
      else if ((url.includes('/actividad')) && (rol == 1 || rol == 3)) {
        return true;
      } else if ((url.includes('/panelResultados')) && (rol == 1 || rol == 2)) {
        return true;
        
      } else if ((url.includes('/graficas')) && (rol == 1 || rol == 2)) {
        return true;
      }
      else {
        this.router.navigate(['']);
      }
    } catch (e) {
      if ((url.includes('/registro/1')) || (url.includes('/registro/2'))) {
        return true;
      }
      this.router.navigate(['']);
    }
  }

}
