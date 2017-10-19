import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import {AlertController} from "ionic-angular";

/*
 Generated class for the UserProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class UserProvider {
  firedata = firebase.database().ref('/users');
  constructor(public afireauth: AngularFireAuth,private alertCtrl:AlertController) {
  }

  adduser(newuser) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.createUserWithEmailAndPassword(newuser.email, newuser.password).then(() => {
        this.afireauth.auth.currentUser.updateProfile({
          displayName: newuser.displayName,
          photoURL: ''
        }).then(() => {
          this.firedata.child(this.afireauth.auth.currentUser.uid).set({
            uid: this.afireauth.auth.currentUser.uid,
            displayName: newuser.displayName,
            code:newuser.code,
            tel: newuser.tel,
            photoURL: 'give a dummy placeholder url here'
          }).then((res:any) => {
            //console.log("user created"+res.json());
            console.log("user created and"+JSON.stringify(res));
            resolve({ success: true,uid:this.afireauth.auth.currentUser.uid });
          }).catch((err) => {
            reject(err);
          })
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  passwordreset(email) {
    var promise = new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  updateimage(imageurl:string,user:any) {
    console.log("image url is" + imageurl);
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.currentUser.updateProfile({
        displayName: this.afireauth.auth.currentUser.displayName,
        photoURL: imageurl
      }).then(() => {
        // let alert = this.alertCtrl.create({
        //   title: 'in user!',
        //   subTitle: JSON.stringify(user),
        //   buttons: ['OK']
        // });
        // alert.present();
        firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
          code:user.code,
          displayName: this.afireauth.auth.currentUser.displayName,
          photoURL: imageurl,
          tel:user.tel,
          uid: firebase.auth().currentUser.uid
        }).then(() => {
          resolve({ success: true });
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  updatedisplayname(newname) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.currentUser.updateProfile({
        displayName: newname,
        photoURL: this.afireauth.auth.currentUser.photoURL
      }).then(() => {
        this.firedata.child(firebase.auth().currentUser.uid).update({
          displayName: newname,
          photoURL: this.afireauth.auth.currentUser.photoURL,
          uid: this.afireauth.auth.currentUser.uid
        }).then(() => {
          resolve({ success: true });
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  getuserdetails() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
        resolve(snapshot.val());
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  getallusers() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.orderByChild('uid').once('value', (snapshot) => {
        let userdata = snapshot.val();
        let temparr = [];
        for (var key in userdata) {
          console.log(key);
          temparr.push(userdata[key]);
        }
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  getallusersPhone() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.once('value', (snapshot) => {
        let userdata = snapshot.val();
        console.log(userdata);
         let temparr = [];
        for (let user in userdata) {
         // console.log(user);
          temparr.push(userdata[user].displayName);
        }
        console.log('temp array is' +temparr);
        resolve(userdata);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
  getallusersFromUserGroup() {
    let firedata2 = firebase.database().ref('/UserGroups');
    var promise = new Promise((resolve, reject) => {
      firedata2.once('value', (snapshot) => {
        let userdata = snapshot.val();
        console.log(userdata);
        let temparr = [];
        // for (let user in userdata) {
        //   // console.log(user);
        //   temparr.push(userdata[user].displayName);
        // }
        //console.log('temp array is' +temparr);
        resolve(userdata);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
}
