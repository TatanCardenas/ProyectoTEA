import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatDividerModule,
    MatSliderModule,
    MatCardModule,
    MatSnackBarModule
    
  ], exports:[
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatDividerModule,
    MatSliderModule,
    MatCardModule,
    MatSnackBarModule
  ]
})
export class MaterialModule { }
