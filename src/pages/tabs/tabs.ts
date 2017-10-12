import { Component } from '@angular/core';
import {ActionSheetController, AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ChatsPage} from "../chats/chats";
import {GroupsPage} from "../groups/groups";
import {ProfilePage} from "../profile/profile";
import {LibraryPage} from "../library/library";
import {CalenderPage} from "../calender/calender";
import {WhatsnewPage} from "../whatsnew/whatsnew";
import {WhatshappeningPage} from "../whatshappening/whatshappening";
import {Camera} from "@ionic-native/camera";
import {
  MediaCapture, MediaFile, CaptureError, CaptureImageOptions,
  CaptureVideoOptions
} from '@ionic-native/media-capture';
import firebase from 'firebase';
import {FileChooser} from "@ionic-native/file-chooser";

/**
 * Generated class for the TabsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
   variable: any;

  chatsPage = ChatsPage;
  groupsPage = GroupsPage;
  profilePage = ProfilePage;
  libraryPage = LibraryPage;
  calender = CalenderPage;
  whatsnew = WhatsnewPage;
  whatshappening = WhatshappeningPage;
  nativepath :any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl:LoadingController,
              public camera:Camera,private mediaCapture: MediaCapture,public alertCtrl:AlertController,
              public actionSheetCtrl: ActionSheetController,public filechooser: FileChooser) {
    this.variable = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  openCamera(){
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality : 95,
      saveToPhotoAlbum: true
    }).then((imageData) => {
        console.log(imageData);
        let imageurl = 'data:image/jpeg;base64,'+imageData;

        let storageRef = firebase.storage().ref('/images');

        const imageRef = storageRef.child(firebase.auth().currentUser.uid);
        imageRef.putString(imageurl, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {



          storageRef.child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {




            let alert = this.alertCtrl.create({
              title: 'Url!',
              subTitle: url,
              buttons: ['OK']
            });
            alert.present();
            // this.chatservice.addnewmessage(url).then(() => {
            //   this.scrollto();
            //   this.newmessage = '';
            // })
          }).catch((err) => {
          });
        }).catch((err) => {

        })



      },
      (err: CaptureError) => console.error(err)
    );


  }

}
