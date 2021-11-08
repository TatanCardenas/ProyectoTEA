import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: string;
  password: string;
  hide = true;
  formul: FormGroup;
  constructor(private formBuilder: FormBuilder,) { }

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
    return true;
  }

}
