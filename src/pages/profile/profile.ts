import {
  ActionSheetController, AlertController, LoadingController, NavController, NavParams,ToastController
} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {ImghandlerProvider} from "../../providers/imghandler/imghandler";
import firebase from 'firebase';
import {LoginPage} from "../login/login";
import {Camera,CameraOptions} from "@ionic-native/camera";
import {FilePath} from "@ionic-native/file-path";
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { HTTP } from '@ionic-native/http';
import { Http ,Headers } from '@angular/http';
import {Component, NgZone} from "@angular/core";


declare var require: any;

// import { Cloudinary } from 'cloudinary-core';
// //import { Cloudinary } from '@cloudinary/angular';
// import { CloudinaryModule } from '@cloudinary/angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  base64Image:any;
  avatar: string;
  displayName: string;
  url:any;
  user:any;
   //cl = new Cloudinary({cloud_name: "vvish", secure: true});

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public userservice: UserProvider,public zone: NgZone, public alertCtrl: AlertController,
              public imghandler: ImghandlerProvider,public camera: Camera,public actionSheetCtrl:ActionSheetController,
              public filePath: FilePath,public imagepicker: ImagePicker,public loadingCtrl:LoadingController,
              private transfer: FileTransfer, private file: File, private http:Http,private httpUrl:HTTP,public toastCtrl: ToastController) {

  }
  ionViewWillEnter() {


    console.log('ion view will enter');



    this.loaduserdetails();

    //var cl = new cloudinary.Cloudinary({cloud_name: "demo", secure: true});
  }

  loaduserdetails() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.userservice.getuserdetails().then((res: any) => {
      loader.dismiss();
      this.user = res;
      this.displayName = res.displayName;
      console.log("url is"+res.photoURL);
      this.avatar = res.photoURL;
      // this.zone.run(() => {
      //   console.log(res.photoURL);
      //   this.avatar = res.photoURL;
      // })
      let cameraImageSelector = document.getElementById('camera-image');
      cameraImageSelector.setAttribute('src', this.avatar);
    }, (err) => {
      loader.dismiss();
      console.log(err);
    });
  }

  editimage() {

    const image_url = '';
    //let body = { "file": "http://www.juliebergan.no/sites/g/files/g2000006326/f/sample_03.jpg", "upload_preset": "oaggw9ot" };
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');




    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {

            this.camera.getPicture({
              sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
              destinationType: this.camera.DestinationType.DATA_URL
            }).then((imageData) => {
              this.avatar = 'data:image/jpeg;base64,'+imageData;
              this.url = this.avatar;
              let storageRef = firebase.storage().ref('/images');
              // Create a timestamp as filename
              const filename = Math.floor(Date.now() / 1000);


              const imageRef = storageRef.child(firebase.auth().currentUser.uid);

              let loader2 = this.loadingCtrl.create({
                content: 'Please wait'
              });
              loader2.present();
              imageRef.putString(this.url, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {

                storageRef.child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {


                  this.userservice.updateimage(url,this.user).then((res: any) => {
                    if (res.success) {
                      let alert = this.alertCtrl.create({
                        title: 'Updated!',
                        subTitle: 'Your profile pic has been changed successfully!!!',
                        buttons: ['OK']
                      });
                      alert.present();
                    }
                  });
                  loader2.dismiss();

                }).catch((err) => {
                  loader2.dismiss();
                  let alert = this.alertCtrl.create({
                    title: 'Failed!',
                    subTitle: 'Your profile pic was not changed!!!',
                    buttons: ['OK']
                  });
                  alert.present();
                });
                }).catch((err) => {

                })
                // Do something here when the data is succesfully uploaded!

              let cameraImageSelector = document.getElementById('camera-image');
              cameraImageSelector.setAttribute('src', this.avatar);

            }, (err) => {
              console.log(err);
            });


          }
        },
        {
          text: 'Use Camera',
          handler: () => {
           // this.takePicture(this.camera.PictureSourceType.CAMERA);
            this.camera.getPicture({
              sourceType: this.camera.PictureSourceType.CAMERA,
              destinationType: this.camera.DestinationType.DATA_URL,
            }).then((imageData) => {
              this.avatar = "data:image/jpeg;base64,"+imageData;

              this.url = this.avatar;
              let storageRef = firebase.storage().ref('/images');
              // Create a timestamp as filename
              const filename = Math.floor(Date.now() / 1000);


              const imageRef = storageRef.child(firebase.auth().currentUser.uid);

              let loader2 = this.loadingCtrl.create({
                content: 'Please wait'
              });
              loader2.present();

              imageRef.putString(this.url, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {

                storageRef.child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
                  // let alert = this.alertCtrl.create({
                  //   title: 'Updated!',
                  //   subTitle: url,
                  //   buttons: ['OK']
                  // });
                  // alert.present();
                  this.userservice.updateimage(url,this.user).then((res: any) => {
                    if (res.success) {
                      let alert = this.alertCtrl.create({
                        title: 'Updated!',
                        subTitle: 'Your profile pic has been changed successfully!!!',
                        buttons: ['OK']
                      });
                      alert.present();
                    }
                  });
                  loader2.dismiss();

                }).catch((err) => {
                  loader2.dismiss();

                  let alert = this.alertCtrl.create({
                    title: 'Failed!',
                    subTitle: 'Your profile pic was not changed!!!',
                    buttons: ['OK']
                  });
                  alert.present();
                });
              }).catch((err) => {

              })
              // Do something here when the data is succesfully uploaded!

              let cameraImageSelector = document.getElementById('camera-image');
              cameraImageSelector.setAttribute('src', this.avatar);
            }, (err) => {
              console.log(err);
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }





  editname(){
    let statusalert = this.alertCtrl.create({
      buttons: ['okay']
    });
    let alert = this.alertCtrl.create({
      title: 'Edit Nickname',
      inputs: [{
        name: 'nickname',
        placeholder: 'Nickname'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {

        }
      },
        {
          text: 'Edit',
          handler: data => {
            if (data.nickname) {
              this.userservice.updatedisplayname(data.nickname).then((res: any) => {
                if (res.success) {
                  statusalert.setTitle('Updated');
                  statusalert.setSubTitle('Your nickname has been changed successfully!!');
                  statusalert.present();

                  this.zone.run(() => {
                    this.displayName = data.nickname;
                  })
                }

                else {
                  statusalert.setTitle('Failed');
                  statusalert.setSubTitle('Your nickname was not changed');
                  statusalert.present();
                }

              })
            }
          }

        }]
    });
    alert.present();
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.navCtrl.setRoot(LoginPage);
    })
  }

}
