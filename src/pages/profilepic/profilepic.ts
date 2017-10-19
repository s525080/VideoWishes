import {Component, NgZone, OnInit} from '@angular/core';
import {ActionSheetController, AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {UserProvider} from "../../providers/user/user";
import {ImghandlerProvider} from "../../providers/imghandler/imghandler";
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
/**
 * Generated class for the ProfilepicPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-profilepic',
  templateUrl: 'profilepic.html',
})
export class ProfilepicPage implements OnInit{
   image: string;
  public base64Image: string;
  avatar : string;
  url:any;
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
  };
 user:any;
  imgurl = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e';
  moveon = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public zone: NgZone,public imgservice: ImghandlerProvider,
              public userservice: UserProvider, public loadingCtrl: LoadingController,private camera: Camera,
              private actionController: ActionSheetController,private alertCtrl:AlertController) {


  }

  ngOnInit(){

    this.user = this.navParams.get('newUser');
  }
  ionViewDidLoad() {
  }

  chooseimage(){
    const actionSheet = this.actionController.create({
      title: 'Select',
      buttons : [
        {
          text : 'Camera',
          handler : () => {
            let loader = this.loadingCtrl.create({
              content: 'Please wait'
            })
            loader.present();

            this.camera.getPicture(this.options).then((imageData: any) => {
              // imageData is either a base64 encoded string or a file URI
              loader.dismiss();
              this.image = "data:image/jpeg;base64," + imageData;
              let cameraImageSelector = document.getElementById('camera-image');

              cameraImageSelector.setAttribute('src', this.image);
              this.moveon = false;
              this.url = this.image;
              let storageRef = firebase.storage().ref('/images');
              // Create a timestamp as filename
              const filename = Math.floor(Date.now() / 1000);

              // Create a reference to 'images/todays-date.jpg'

              const imageRef = storageRef.child(firebase.auth().currentUser.uid);

              let loader2 = this.loadingCtrl.create({
                content: 'Please wait'
              });
              loader2.present();

              imageRef.putString(this.url, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {

                storageRef.child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
                  let alert = this.alertCtrl.create({
                    title: 'uploading! '+url,
                    subTitle: JSON.stringify(this.user),
                    buttons: ['OK']
                  });
                  alert.present();


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
                  this.navCtrl.setRoot(TabsPage);

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



            }, (err) => {
              loader.dismiss();
              // Handle error
            });


          }
        },
        {
          text : 'Photo Library',
          handler : () => {

            let loader = this.loadingCtrl.create({
              content: 'Please wait'
            })
            loader.present();


            this.camera.getPicture({
              sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
              destinationType: this.camera.DestinationType.DATA_URL
            }).then((imageData) => {
              loader.dismiss();

              this.image = 'data:image/jpeg;base64,'+imageData;
              this.url = this.image;
              let storageRef = firebase.storage().ref('/images');
              // Create a timestamp as filename
              const filename = Math.floor(Date.now() / 1000);

              // Create a reference to 'images/todays-date.jpg'

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
                  this.navCtrl.setRoot(TabsPage);

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
              let cameraImageSelector = document.getElementById('camera-image');
              cameraImageSelector.setAttribute('src', this.image);
            }, (err) => {
              console.log(err);
            });



          }
        },
        {
          text: 'Cancel',
          role : 'cancel'
        }
      ]
    });
    actionSheet.present();
  }


  chooseimage2() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    })
    loader.present();
    this.camera.getPicture(this.options).then((imageData: any) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
     // let base64Image = 'data:image/jpeg;base64,' + imageData;
      loader.dismiss();
        this.zone.run(() => {
          this.imgurl = imageData;
          this.moveon = false;
        })
    }, (err) => {
      // Handle error
    });

    // this.imgservice.uploadimage().then((uploadedurl: any) => {
    //   loader.dismiss();
    //   this.zone.run(() => {
    //     this.imgurl = uploadedurl;
    //     this.moveon = false;
    //   })
    // })
  }

  updateproceed() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    })
    loader.present();
    this.userservice.updateimage(this.image,this.user).then((res: any) => {
      loader.dismiss();
      if (res.success) {
        this.navCtrl.setRoot(TabsPage);
      }
      else {
        alert(res);
      }
    })
  }

  proceed() {
    this.navCtrl.setRoot(TabsPage);
  }


}
