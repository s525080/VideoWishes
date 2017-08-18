import {Component,ViewChild, NgZone} from '@angular/core';
import {Events, NavController, NavParams, Content, LoadingController} from 'ionic-angular';
import {ChatProvider} from "../../providers/chat/chat";

import firebase from 'firebase';
import {ImghandlerProvider} from "../../providers/imghandler/imghandler";
import {Camera} from "@ionic-native/camera";
/**
 * Generated class for the PersonalchatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-personalchat',
  templateUrl: 'personalchat.html',
})
export class PersonalchatPage {

  @ViewChild('content') content: Content;
  buddy: any;
  newmessage;
  allmessages = [];
  photoURL;
  imgornot;
  constructor(public navCtrl: NavController, public navParams: NavParams, public chatservice: ChatProvider,
              public events: Events, public zone: NgZone, public imgstore:ImghandlerProvider,
              public loadingCtrl:LoadingController,public camera: Camera) {
    this.buddy = this.chatservice.buddy;
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollto();
    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      this.imgornot = [];
      this.zone.run(() => {
        this.allmessages = this.chatservice.buddymessages;
        for (var key in this.allmessages) {
          if (this.allmessages[key].message.substring(0, 4) == 'http')
            this.imgornot.push(true);
          else
            this.imgornot.push(false);
        }
      })
    })
  }

  addmessage() {
    this.chatservice.addnewmessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }

  ionViewDidEnter() {
    this.chatservice.getbuddymessages();
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  sendPicMsg() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.imgstore.picmsgstore().then((imgurl) => {
      loader.dismiss();
      this.chatservice.addnewmessage(imgurl).then(() => {
        this.scrollto();
        this.newmessage = '';
      })
    }).catch((err) => {
      alert(err);
      loader.dismiss();
    })
    loader.dismiss();
  }


sendPicfromLib(){
  let loader = this.loadingCtrl.create({
    content: 'Please wait'
  });
  loader.present();
  this.camera.getPicture({
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    destinationType: this.camera.DestinationType.DATA_URL,
    quality : 95,
     saveToPhotoAlbum: true
  }).then((imageData) => {

    let imageurl = 'data:image/jpeg;base64,'+imageData;
    let storageRef = firebase.storage().ref('/videos');

    const imageRef = storageRef.child(firebase.auth().currentUser.uid);

        var uuid = this.guid();
        var imageStore = storageRef.child(firebase.auth().currentUser.uid).child('picmsg' + uuid);
    imageStore.putString(imageurl, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {

          storageRef.child(firebase.auth().currentUser.uid).child('picmsg' + uuid).getDownloadURL().then((url) => {
            loader.dismiss();
            this.chatservice.addnewmessage(url).then(() => {
              this.scrollto();
              this.newmessage = '';
            })
          }).catch((err) => {
          });
        }).catch((err) => {
          loader.dismiss();
        })


    // Do something here when the data is succesfully uploaded!


  }, (err) => {
    loader.dismiss();
    console.log(err);
  });

  loader.dismiss();
}

  sendPicfromCam(){
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality : 95,
      saveToPhotoAlbum: true
    }).then((imageData) => {

      let imageurl = 'data:image/jpeg;base64,'+imageData;
      let storageRef = firebase.storage().ref('/pictures');

      const imageRef = storageRef.child(firebase.auth().currentUser.uid);

      var uuid = this.guid();
      var imageStore = storageRef.child(firebase.auth().currentUser.uid).child('picmsg' + uuid);
      imageStore.putString(imageurl, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {

        storageRef.child(firebase.auth().currentUser.uid).child('picmsg' + uuid).getDownloadURL().then((url) => {
          loader.dismiss();
          this.chatservice.addnewmessage(url).then(() => {
            this.scrollto();
            this.newmessage = '';
          })
        }).catch((err) => {
        });
      }).catch((err) => {
        loader.dismiss();
      })


      // Do something here when the data is succesfully uploaded!


    }, (err) => {
      loader.dismiss();
      console.log(err);
    });

    loader.dismiss();
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

}
