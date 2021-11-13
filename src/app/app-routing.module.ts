import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActividadComponent } from './pages/actividad/actividad.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrarDocenteComponent } from './pages/registrar-docente/registrar-docente.component';
import { RegistrarPacienteComponent } from './pages/registrar-paciente/registrar-paciente.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'registrarA', component: RegistrarComponent},
  {path: 'inicio', component: InicioComponent},
  {path: 'registrarD', component: RegistrarDocenteComponent},
  {path: 'registrarP', component: RegistrarPacienteComponent},
  {path: 'login', component: LoginComponent},
  {path: 'actividad', component: ActividadComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
