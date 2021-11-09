import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UserLogin } from 'src/app/_model/UserLogin';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/_service/login.service'
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: string;
  password: string;
  private user = new UserLogin;
  hide = true;

  formul: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.buildFrom();
  }
  private buildFrom() {
    
    this.formul = this.formBuilder.group({    
      user: [this.usuario, [Validators.required,Validators.maxLength(15), Validators.minLength(3)]],
      pass: [this.password, [Validators.required,Validators.minLength(4), Validators.maxLength(15)]],
    });
  }

  ingresar(event: Event){
    this.user = this.formul.value;
    this.loginService.login(this.user).subscribe(data =>{
      console.log(data);
      this.openSnackBar("Login correcto");
       sessionStorage.setItem(environment.TOKEN, data.access_token);
      this.loginService.paginaReactiva.next(true);
      this.router.navigate(['']);
    }, err => {
      this.openSnackBar(err.error.message)
      console.log("Algo salio mal :(");
    });
  }

  private openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Información', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  } 

}
