import {Component, OnInit} from '@angular/core';
import {ActionSheetController, AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MetaGroup} from "../../models/interfaces/metagroup";
import {Camera} from "@ionic-native/camera";
import {
  MediaCapture, MediaFile, CaptureError, CaptureImageOptions,
  CaptureVideoOptions
} from '@ionic-native/media-capture';
import firebase from 'firebase';
declare var window: any;
import {FileChooser} from "@ionic-native/file-chooser";
import {Http,Headers} from "@angular/http";
import {UserProvider} from "../../providers/user/user";
import {File} from "@ionic-native/file";

/**
 * Generated class for the ExistingGroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-existing-group',
  templateUrl: 'existing-group.html',
})
export class ExistingGroupPage implements OnInit{



  group: any;
  index: number;
  groupId:any;
  nativepath:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl:LoadingController,
              public camera:Camera,private mediaCapture: MediaCapture,public alertCtrl:AlertController,
              public actionSheetCtrl: ActionSheetController,public filechooser: FileChooser,
  private http:Http,public userservice: UserProvider,public file:File) {
  }

  ngOnInit(){
    this.group = this.navParams.get('member');
    this.groupId = JSON.stringify(this.group.key);
    console.log("this group is"+JSON.stringify(this.group.key));
    // this.index = this.navParams.get('index');
  }

  onEditGroup(){

  }

  onDeleteGroup(){

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
      mediaType: this.camera.MediaType.ALLMEDIA,
      saveToPhotoAlbum: true
    }).then((imageData) => {
      let alert = this.alertCtrl.create({
        title: 'Updated!',
        subTitle: JSON.stringify(imageData),
        buttons: ['OK']
      });
      alert.present();
      let imageurl = 'data:image/jpeg;base64,'+imageData;
      let storageRef = firebase.storage().ref('/videos');

      // const imageRef = storageRef.child(firebase.auth().currentUser.uid);
      // imageRef.putString(imageurl, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {
      //
      //   storageRef.child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {

      var imageStore = storageRef.child(this.groupId).child(firebase.auth().currentUser.uid);
      imageStore.putString(imageurl, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {

        storageRef.child(this.groupId).child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
          loader.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Updated!',
            subTitle: url,
            buttons: ['OK']
          });
          alert.present();

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


  }

  sendPicfromCam(){
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    let options: CaptureImageOptions = { limit: 3 };
    this.mediaCapture.captureVideo()
      .then((data: MediaFile[]) => {
      console.log(data);
          let alert = this.alertCtrl.create({
            title: 'Updated!',
            subTitle: JSON.stringify(data),
            buttons: ['OK']
          });
          alert.present();
          let videourl = 'data:video/mov;base64,'+data;
          let storageRef = firebase.storage().ref('/videos');

          const imageRef = storageRef.child(firebase.auth().currentUser.uid);


          var imageStore = storageRef.child(this.groupId).child(firebase.auth().currentUser.uid);
          // imageStore.putString(videourl, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {
          imageStore.put(videourl).then((res: any)=> {

            storageRef.child(this.groupId).child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {

              loader.dismiss();
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
            loader.dismiss();
          })


        },
        (err: CaptureError) => console.error(err)
      );



    loader.dismiss();
  }


  openCamera() {
    const base_url ='https://api.cloudinary.com/v1_1/vvish/image/upload';
    const image_url = '';
    //let body = { "file": "http://www.juliebergan.no/sites/g/files/g2000006326/f/sample_03.jpg", "upload_preset": "oaggw9ot" };
    var headers = new Headers();
    headers.append('Content-Type', 'application/JSON');

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Take Picture',
          handler: () => {
            this.camera.getPicture({
              sourceType: this.camera.PictureSourceType.CAMERA,
              destinationType: this.camera.DestinationType.DATA_URL,
              quality : 95,
              saveToPhotoAlbum: true
            }).then((imageData) => {
                  console.log(imageData);
                let imageurl = 'data:image/jpeg;base64,'+imageData;

                    let storageRef = firebase.storage().ref('/videos');

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
        },
        {
          text: 'Take Video',
          handler: () => {

            let options: CaptureVideoOptions = {limit: 3};
            this.mediaCapture.captureVideo(options)
              .then((data: MediaFile[]) => {
                console.log(data);
                    let index = data[0].fullPath.lastIndexOf('/'), finalPath = data[0].fullPath.substr(0, index);
                    this.file.readAsArrayBuffer(finalPath, data[0].name).then((file) => {
                      let blob = new Blob([file], {type: data[0].type});
                    //  let task = this.postRef.child(data[0].name]).put(blob);
                      let storageRef = firebase.storage().ref('/videos');

                      const imageRef = storageRef.child(firebase.auth().currentUser.uid);
                      imageRef.put(blob).then((res: any) => {

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


                      });

                    }).catch(err => { console.log(err); });

                  // Generate filename and upload to Firebase Storage.




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



  //Action controller
  // openCamera() {
  //
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: 'Select Image Source',
  //     buttons: [
  //       {
  //         text: 'Take Picture',
  //         handler: () => {
  //          ;
  //           let options: CaptureImageOptions = { limit: 3 };
  //           this.mediaCapture.captureImage(options)
  //             .then((data: MediaFile[]) => {
  //                 console.log(data);
  //
  //                for(let entry of data){
  //                  let alert = this.alertCtrl.create({
  //                    title: 'Updated!',
  //                    subTitle: JSON.stringify(entry.fullPath),
  //                    buttons: ['OK']
  //                  });
  //                  alert.present();
  //                  let imageurl = 'data:image/jpeg;base64,'+entry.fullPath;
  //                 // let imageurl = JSON.stringify(entry.fullPath);
  //                  let alert2 = this.alertCtrl.create({
  //                    title: 'URL is!',
  //                    subTitle: imageurl,
  //                    buttons: ['OK']
  //                  });
  //                  alert2.present();
  //                  let storageRef = firebase.storage().ref('/videos');
  //
  //                  //
  //                  //   storageRef.child(this.groupId).child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
  //                  //     var imageStore = storageRef.child(firebase.auth().currentUser.uid).child('picmsg');
  //                  //     imageStore.putString(imageurl, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {
  //                  //
  //                  //       storageRef.child(firebase.auth().currentUser.uid).child('picmsg').getDownloadURL().then((url) => {
  //
  //                          const imageRef = storageRef.child(firebase.auth().currentUser.uid);
  //                         imageRef.putString(imageurl, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {
  //
  //                            //imageRef.put(imageurl).then((res: any)=> {
  //
  //
  //                              storageRef.child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
  //
  //
  //
  //
  //                      let alert = this.alertCtrl.create({
  //                        title: 'Url!',
  //                        subTitle: url,
  //                        buttons: ['OK']
  //                      });
  //                      alert.present();
  //                      // this.chatservice.addnewmessage(url).then(() => {
  //                      //   this.scrollto();
  //                      //   this.newmessage = '';
  //                      // })
  //                    }).catch((err) => {
  //                    });
  //                  }).catch((err) => {
  //
  //                  })
  //                }
  //
  //
  //               },
  //               (err: CaptureError) => console.error(err)
  //             );
  //
  //
  //
  //
  //         }
  //       },
  //       {
  //         text: 'Take Video',
  //         handler: () => {
  //
  //           let options: CaptureVideoOptions = { limit: 3 };
  //           this.mediaCapture.captureVideo()
  //             .then((data: MediaFile[]) => {
  //                 console.log(data);
  //                 for(let entry of data){
  //                   let alert = this.alertCtrl.create({
  //                     title: 'Updated!',
  //                     subTitle: JSON.stringify(entry.fullPath),
  //                     buttons: ['OK']
  //                   });
  //                   alert.present();
  //                   let imageurl = 'data:video/mov;base64,'+entry.fullPath;
  //                   let storageRef = firebase.storage().ref('/videos');
  //                   // const imageRef = storageRef.child(firebase.auth().currentUser.uid);
  //
  //                   //
  //                   // var imageStore = storageRef.child(this.groupId).child(firebase.auth().currentUser.uid);
  //                   // imageStore.putString(imageurl, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {
  //                   //   //imageStore.put(videourl).then((res: any)=> {
  //                   //
  //                   //   storageRef.child(this.groupId).child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
  //
  //                       const imageRef = storageRef.child(firebase.auth().currentUser.uid);
  //                       imageRef.putString(imageurl, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {
  //
  //                         storageRef.child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
  //                       let alert = this.alertCtrl.create({
  //                         title: 'Url!',
  //                         subTitle: url,
  //                         buttons: ['OK']
  //                       });
  //                       alert.present();
  //                       // this.chatservice.addnewmessage(url).then(() => {
  //                       //   this.scrollto();
  //                       //   this.newmessage = '';
  //                       // })
  //                     }).catch((err) => {
  //                     });
  //                   }).catch((err) => {
  //
  //                   })
  //                 }
  //
  //
  //               },
  //               (err: CaptureError) => console.error(err)
  //             );
  //
  //
  //
  //
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       }
  //     ]
  //   });
  //   actionSheet.present();
  // }



}

