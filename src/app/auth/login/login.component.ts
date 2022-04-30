import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['caro@gmail.com', [Validators.required, Validators.min(3), Validators.email]],
      password: ['123456', Validators.required]
    });
  }

  loginUsuario(){
    if(this.loginForm.invalid) { return;}

    const { correo, password } = this.loginForm.value;
    this.authService.loginUsuario( correo, password)
    .then(
      credenciales => {
        console.log("desde login: " + JSON.stringify(credenciales));
        this.router.navigate(['/']);
      }
    ).catch(err=>
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
          footer: '<a href="">Why do I have this issue?</a>'
        });

        console.log(err);
      }
    );
  }
}
