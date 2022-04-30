import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['juana', Validators.required],
      correo: ['caro@gmail.com', [Validators.required, Validators.min(3), Validators.email]],
      password: ['123456', Validators.required]
    });

    console.log('nom: '+ this.registroForm.controls['nombre'].valid);
  }

  crearUsuario(){
    Swal.showLoading();
    if(this.registroForm.invalid) { return;}
    const {nombre, correo, password } = this.registroForm.value;
    /*let nombre: string = this.registroForm.controls["nombre"].value;
    let correo: string = this.registroForm.controls["correo"].value;
    let password: string = this.registroForm.controls["password"].value;
    */

    Swal.fire({
      title: 'Espere por favor!',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.crearUsuario(nombre, correo, password).then(
      credenciales => {
        console.log(credenciales);
        Swal.close();
        this.router.navigate(['/']);
      }
    )
    .catch(err=>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
        footer: '<a href="">Why do I have this issue?</a>'
      });

      console.log(err);
    });
  }

  showLoading2(){

    Swal.showLoading();

    /*let timerInterval
    Swal.fire({
      title: 'Auto close alert!',
      html: 'I will close in <b></b> milliseconds.',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
       
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })*/
  }

}
