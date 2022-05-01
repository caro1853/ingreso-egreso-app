import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as uiActions from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm!: FormGroup;

  cargando: Boolean = false;
  uiSubscription!: Subscription;

  constructor(private fb: FormBuilder, 
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router) { }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['juana', Validators.required],
      correo: ['caro@gmail.com', [Validators.required, Validators.min(3), Validators.email]],
      password: ['123456', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe(
      stateUi=> {
        this.cargando = stateUi.isLoading;
        console.log({stateUi});
      }
    );
  }

  crearUsuario(){
    this.store.dispatch(uiActions.isLoading());
    //Swal.showLoading();
    if(this.registroForm.invalid) { return;}
    const {nombre, correo, password } = this.registroForm.value;
    /*let nombre: string = this.registroForm.controls["nombre"].value;
    let correo: string = this.registroForm.controls["correo"].value;
    let password: string = this.registroForm.controls["password"].value;
    */
    /*
    Swal.fire({
      title: 'Espere por favor!',
      didOpen: () => {
        Swal.showLoading();
      }
    });*/

    this.authService.crearUsuario(nombre, correo, password).then(
      credenciales => {
        console.log(credenciales);
        //Swal.close();
        this.store.dispatch(uiActions.stopLoading());
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
      this.store.dispatch(uiActions.stopLoading());
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
