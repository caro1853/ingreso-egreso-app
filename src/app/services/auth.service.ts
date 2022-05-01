import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as autActions from '../auth/auth.actions';
import { Usuario } from '../models/usuario.models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription!:Subscription;
  constructor(private angularFireAuth: AngularFireAuth, 
              private firestore: AngularFirestore,
              private store: Store<AppState> ) { }

  initAuhtListener(){
    this.angularFireAuth.authState.subscribe(fuser => {
      if(fuser){
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`)
          .valueChanges()
          .subscribe( (fireStoreUSer:any) => {
            const user = Usuario.fromFirebase(fireStoreUSer)
            console.log('from initAuhtListener' + JSON.stringify( user) );
            this.store.dispatch(autActions.setUser( {user}));
            console.log('finish dispacth');
          });
      }else{
        this.userSubscription.unsubscribe();
        console.log('user dont exist');
        this.store.dispatch(autActions.unSetUser());
      }

      
      console.log({fuser});
    });
  }

  crearUsuario(nombre: string, email:string, password:string){
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password)
    .then(
      ({ user }) => {
        const newUser = new Usuario(user?.uid!, nombre, email, )
        return this.firestore.doc(`${ user?.uid }/usuario`).
        set({ ...newUser});
      }
    );
  }

  loginUsuario(email:string, password:string){
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.angularFireAuth.signOut();
  }

  isAuth(){
    return this.angularFireAuth.authState.pipe(
      map( fbUSer => fbUSer!= null)
    )
  }
}
