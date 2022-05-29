import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/_service/login.service';

@Component({
  selector: 'app-recuperar-clave',
  templateUrl: './recuperar-clave.component.html',
  styleUrls: ['./recuperar-clave.component.css']
})
export class RecuperarClaveComponent implements OnInit {

  constructor(private loginService: LoginService,
    private snackBar:MatSnackBar,
    private router : Router) { }

  ngOnInit(): void {
  }
  form_recuperar = new FormGroup({
    correo: new FormControl("",[
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
      Validators.pattern(
        /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}/
      ),
    ]),
  });

  enviarDatos(event: Event) {
    let correo = this.form_recuperar.value.correo;
    this.loginService.correoParaRecuperar(correo).subscribe(data=>{
      this.openSnackBar(data)
      if(data != "Usuario Inexistente"){
        this.router.navigate(['/inicio']);
      }
    })
  }
  private openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Aceptar', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
