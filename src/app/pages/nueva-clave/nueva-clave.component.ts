import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Usuario } from 'src/app/_model/Usuario';
import { LoginService } from 'src/app/_service/login.service';

@Component({
  selector: 'app-nueva-clave',
  templateUrl: './nueva-clave.component.html',
  styleUrls: ['./nueva-clave.component.css']
})
export class NuevaClaveComponent implements OnInit {

  hide = true;
  private token;
  constructor(private snackBar: MatSnackBar,
    private parametros: ActivatedRoute,
    private router:Router,
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.parametros.params.subscribe((parametros: Params) => {
      this.token = parametros['token'];
      this.loginService.accesoNuevaClave(this.token).subscribe(data=>{
        this.openSnackBar(data);
      }, err => {
        //this.openSnackBar(err)
        this.openSnackBar(err.error.Message)
        this.router.navigate(['recuperarClave'])
      });
    })
  }

  form_nueva_clave = new FormGroup({
    clave_nueva: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(15),
    ])
  });


  enviarDatos(event: Event) {
    let clave_nueva = new Usuario();
    clave_nueva.Token = this.token;
    clave_nueva.clave= this.form_nueva_clave.value.clave_nueva;
    this.loginService.nuevaClave(clave_nueva).subscribe(data=>{
      this.openSnackBar(data)
      this.router.navigate(['/login']);
    })
  }

  private openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, '', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
