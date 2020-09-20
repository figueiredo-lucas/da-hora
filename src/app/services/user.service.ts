import { Injectable } from '@angular/core';
import { User } from '../shared/user';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() {
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = { uid: user.uid, name: user.displayName, email: user.email };
      }
    });

  }

  private user: User;

  getUser(): User {
    return this.user;
  }
}
