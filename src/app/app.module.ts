import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { RegistrarComponent } from './pages/registrar/registrar.component';
import { MaterialModule } from './material/material.module'
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JwtModule } from '@auth0/angular-jwt';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ActividadComponent } from './pages/actividad/actividad.component';
import { EnlazarNinoComponent } from './pages/enlazar-nino/enlazar-nino.component';
import { EnlaceConElPacienteComponent } from './pages/enlace-con-el-paciente/enlace-con-el-paciente.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { Not404Component } from './pages/not404/not404.component';
import { CrearActividadComponent } from './pages/crear-actividad/crear-actividad.component';
import { PanelActividadesComponent } from './pages/panel-actividades/panel-actividades.component';
import { ActividadDemoComponent } from './pages/actividad-demo/actividad-demo.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { PanelResultadosComponent } from './pages/panel-resultados/panel-resultados.component';
import { EvaluacionInicialComponent } from './pages/evaluacion-inicial/evaluacion-inicial.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrarComponent,
    LoginComponent,
    InicioComponent,
    ActividadComponent,
    EnlazarNinoComponent,
    EnlaceConElPacienteComponent,
    PerfilComponent,
    Not404Component,
    CrearActividadComponent,
    PanelActividadesComponent,
    ActividadDemoComponent,
    PanelResultadosComponent,
    EvaluacionInicialComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    JwtModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MatProgressBarModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
