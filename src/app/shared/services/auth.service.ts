import { Injectable, NgZone } from '@angular/core';
import { User } from "../services/user";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";

import {HttpClient} from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Variavel para salvar Usuario Logado
  private apiRoot = 'http://127.0.0.1:8000/'; //endereço API de pacientes

  constructor(
    public afs: AngularFirestore,   
    public afAuth: AngularFireAuth, 
    public router: Router,
    public ngZone: NgZone, 
    public http: HttpClient //chamando o cliente da API
  ) {
    
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  

  armazenar2(cpf: number, nome:string, sexo:string, idade: number, doenca:boolean, observacao: string){
    return this.http.post(
      this.apiRoot.concat('pacientes/'),
      { cpf, nome, sexo,idade, doenca, observacao }  );
  }
  //referencia os component.ts do formulário com dados do paciente
  armazenar(pacientesform: any) {
    return this.http.post(this.apiRoot, pacientesform);
  }

  // entrar email/senha
  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['./dashboard']);
          console.log('esta funcionando')

        });
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
        console.log('esta com error')

      })
      
  }
  // Retorna true quando o usuário está logado e o email é verificado
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }


  // rodar providers de autenticação
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
      this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  //metodo padrão de conteudo do firebase caso precisamos exibir as informações pro usuario no futurp
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign out
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    })
  }

}
