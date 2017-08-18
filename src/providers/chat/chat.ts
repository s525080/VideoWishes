import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {PersonalchatPage} from "../../pages/personalchat/personalchat";
import {NavController} from "ionic-angular";
import firebase from 'firebase';
import { Events } from 'ionic-angular';
/*
  Generated class for the ChatProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ChatProvider {
  firebuddychats = firebase.database().ref('/buddychats');
  buddy: any;
  buddymessages = [];

  constructor(public http: Http,public events: Events) {
    console.log('Hello ChatProvider Provider');
  }

  initializebuddy(buddy) {
    this.buddy = buddy;


  }

  addnewmessage(msg) {
    if (this.buddy) {
      var promise = new Promise((resolve, reject) => {
        this.firebuddychats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).push({
          sentby: firebase.auth().currentUser.uid,
          message: msg,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          this.firebuddychats.child(this.buddy.uid).child(firebase.auth().currentUser.uid).push({
            sentby: firebase.auth().currentUser.uid,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            resolve(true);
          }).catch((err) => {
            reject(err);
          })
        })
      })
      return promise;
    }
  }

  getbuddymessages() {

    let temp;
    this.firebuddychats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).on('value', (snapshot) => {
      this.buddymessages = [];
      temp = snapshot.val();
      for (var tempkey in temp) {
        this.buddymessages.push(temp[tempkey]);
      }
      this.events.publish('newmessage');
    })
  }
}
