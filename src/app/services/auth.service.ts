import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth, private firestore: AngularFirestore ) { }

  initAuhtListener(){
    this.angularFireAuth.authState.subscribe(fuser => {
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
