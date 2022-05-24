import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/_service/login.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { UsuarioDocente } from 'src/app/_model/UsuarioDocente';

@Component({
  selector: 'app-formulario-compra',
  templateUrl: './formulario-compra.component.html',
  styleUrls: ['./formulario-compra.component.css'],
})
export class FormularioCompraComponent implements OnInit {
  form_compra: FormGroup;
  private usser = new UsuarioDocente;
  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {}

  private buildFrom() {
    this.form_compra = this.formBuilder.group({});
  }

  enviarDatos(event: Event) {
    this.usser = this.form_compra.value;
    this.usuarioService.postAgregarTokenCompra(this.usser).subscribe(
      (data) => {
        
        this.openSnackBar('Revisa tu correo'+data);
      },
      (err) => {
        this.openSnackBar(
          'Envia los datos nuevamente'
        );
      }
    );
  }

  private openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Aceptar', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  } 
}
