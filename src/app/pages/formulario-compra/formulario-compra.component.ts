import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  private usser = new UsuarioDocente();


  constructor(
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  //IMITACION
  form_compra = new FormGroup({
    nombre: new FormControl(this.usser.nombre, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(15),
      Validators.pattern('[a-zA-Z ]*'),
    ]),
    documento: new FormControl(this.usser.documento, [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(11),
      Validators.pattern('[0-9]*'),
    ]),
    correo: new FormControl(this.usser.correo, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(25),
      
    ]),
  });


  enviarDatos(event: Event) {
    this.usser = this.form_compra.value;
    this.usuarioService.postAgregarTokenCompra(this.usser).subscribe(
      (data) => {
        if(data == true){
          this.openSnackBar('Revisa tu correo');
        }else if(data == false){
          this.openSnackBar('Ya tienes una cuenta activa');
        }else{
          this.openSnackBar('¡Ops! contacta con el administrador '+ data);
        }
      },
      (err) => {
        this.openSnackBar('Envia los datos nuevamente');
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
