import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActividadComponent } from './pages/actividad/actividad.component';
import { EnlaceConElPacienteComponent } from './pages/enlace-con-el-paciente/enlace-con-el-paciente.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { GuardianService } from './_service/guardian.service';
import { LoginComponent } from './pages/login/login.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { Not404Component } from './pages/not404/not404.component';
import { CrearActividadComponent } from './pages/crear-actividad/crear-actividad.component';
import { PanelActividadesComponent } from './pages/panel-actividades/panel-actividades.component';
import { ActividadDemoComponent } from './pages/actividad-demo/actividad-demo.component';
import { PanelResultadosComponent } from './pages/panel-resultados/panel-resultados.component';
import { EvaluacionInicialComponent } from './pages/evaluacion-inicial/evaluacion-inicial.component';
import { PanelGraficasResultadosComponent } from './pages/panel-graficas-resultados/panel-graficas-resultados.component';
import { PanelActividadesImitacionComponent } from './pages/panel-actividades-imitacion/panel-actividades-imitacion.component';

const routes: Routes = [
  {path: 'actividad/:idActividad', component: ActividadComponent,canActivate: [GuardianService]},
  {path: 'crearActividad',component: CrearActividadComponent, canActivate: [GuardianService]},
  {path: 'evaluacionInicial', component: EvaluacionInicialComponent},
  {path: 'panelActividadesDeImitacion', component: PanelActividadesImitacionComponent},
  {path: 'graficas/:idActividad/:idEstudiante', component: PanelGraficasResultadosComponent,canActivate: [GuardianService]},
  {path: 'enlazarNino/:id', component: EnlaceConElPacienteComponent, canActivate: [GuardianService]},
  {path: 'panelActividades', component: PanelActividadesComponent,canActivate: [GuardianService]},
  {path: 'panelResultados', component: PanelResultadosComponent,canActivate: [GuardianService]},
  {path: 'actividadDemo', component: ActividadDemoComponent},
  {path: 'registro/:registroID', component: RegistrarComponent,canActivate: [GuardianService]},
  {path: 'perfil/:idRol/:idDocumento', component: PerfilComponent,canActivate: [GuardianService]},
  {path: 'login', component: LoginComponent},
  {path: 'inicio', component: InicioComponent},
  {path: '', component: InicioComponent},
  {path: '**', component: Not404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
