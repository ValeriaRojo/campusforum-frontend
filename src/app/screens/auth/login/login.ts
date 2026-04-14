import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared_imports';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginScreen implements OnInit {

  public username: string = "";
  public password: string = "";
  public errors: any = {};

  public hide_1: boolean = false;
  public inputType_1: string = 'password';

  //PENDIENTE, MASCOTA
  public focusedField: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  public showPassword() {
    if (this.inputType_1 === 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }
//MASCOTA
  public setFocus(field: string) {
    this.focusedField = field;
  }

  public login() {
    this.errors = {};

    if (!this.username) {
      this.errors.username = "El correo es obligatorio";
    }

    if (!this.password) {
      this.errors.password = "La contraseña es obligatoria";
    }

    if (Object.keys(this.errors).length > 0) return;

    // Simulación login correcto
    this.router.navigate(['/dashboard']);
  }

  public recuperarPwd() {
    console.log("Recuperar contraseña");
  }

  public goRegistro() {
    this.router.navigate(['/registro']);
  }
}
