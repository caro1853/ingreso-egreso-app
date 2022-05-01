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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  cargando: Boolean = false;
  uiSubscription!: Subscription

  constructor(private fb: FormBuilder, 
              private authService: AuthService, 
              private store: Store<AppState>,
              private router: Router) { }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
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

  loginUsuario(){

    this.store.dispatch(uiActions.isLoading());

    if(this.loginForm.invalid) { return;}

    const { correo, password } = this.loginForm.value;
    this.authService.loginUsuario( correo, password)
    .then(
      credenciales => {
        console.log("desde login: " + JSON.stringify(credenciales));
        this.store.dispatch(uiActions.stopLoading());
        this.router.navigate(['/']);
      }
    ).catch(err=>
      {
        this.store.dispatch(uiActions.stopLoading());
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
