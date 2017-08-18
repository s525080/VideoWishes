import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFireAuth} from "angularfire2/auth";
import {UserCredentials} from "../../models/interfaces/userCredentials";
import firebase from 'firebase';


@Injectable()
export class AuthProvider {

  constructor(public http: Http,public afireauth: AngularFireAuth) {
    console.log('Hello AuthProvider Provider');
  }

  /*
   For logging in a particular user. Called from the login.ts file.

   */

  login(credentials: UserCredentials) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then(() => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
    })

    return promise;

  }

  getActiveUser() {
    return firebase.auth().currentUser;
  }
}
