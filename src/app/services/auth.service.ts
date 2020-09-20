import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { User } from '../shared/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  login(value: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password).then((res) => {
        resolve(res);
      }, reject)
    });
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  register(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        res?.user?.updateProfile({
          displayName: value.name
        }).then(resolve);
      }, err => reject(err))
    })
  }
}
