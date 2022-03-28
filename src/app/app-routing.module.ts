import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActividadComponent } from './pages/actividad/actividad.component';
import { EnlaceConElPacienteComponent } from './pages/enlace-con-el-paciente/enlace-con-el-paciente.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { GuardianService } from './_service/guardian.service';
import { LoginComponent } from './pages/login/login.component';
import { RegistrarDocenteComponent } from './pages/registrar-docente/registrar-docente.component';
import { RegistrarPacienteComponent } from './pages/registrar-paciente/registrar-paciente.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { Not404Component } from './pages/not404/not404.component';
import { CrearActividadComponent } from './pages/crear-actividad/crear-actividad.component';
import { PanelActividadesComponent } from './pages/panel-actividades/panel-actividades.component';
import { ActividadDemoComponent } from './pages/actividad-demo/actividad-demo.component';

const routes: Routes = [
  {path: 'actividad', component: ActividadComponent},
  {path: 'crearActividad',component: CrearActividadComponent, canActivate: [GuardianService]},
  {path: 'enlazarNino/:id', component: EnlaceConElPacienteComponent, canActivate: [GuardianService]},
  {path: 'registrarP', component: RegistrarPacienteComponent, canActivate: [GuardianService]},
  {path: 'panelActividades', component: PanelActividadesComponent},
  {path: 'actividadDemo', component: ActividadDemoComponent},
  {path: 'registrarA', component: RegistrarComponent},
  {path: 'registro/:registroID', component: RegistrarDocenteComponent},
  {path: 'perfil', component: PerfilComponent,canActivate: [GuardianService]},
  {path: 'login', component: LoginComponent},
  {path: 'inicio', component: InicioComponent},
  {path: '', component: InicioComponent},
  {path: '**', component: Not404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
