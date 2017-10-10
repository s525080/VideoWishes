import {Component, OnInit} from '@angular/core';
import {ActionSheetController, AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MetaGroup} from "../../models/interfaces/metagroup";
import {Camera} from "@ionic-native/camera";
import {
  MediaCapture, MediaFile, CaptureError, CaptureImageOptions,
  CaptureVideoOptions
} from '@ionic-native/media-capture';
import firebase from 'firebase';
//declare var window: any;
declare var window;
import {FileChooser} from "@ionic-native/file-chooser";
import {UserProvider} from "../../providers/user/user";
import {File } from "@ionic-native/file";
import {GroupsProvider} from "../../providers/groups/groups";
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { VideoPlayer } from '@ionic-native/video-player';
import { VideoEditor } from '@ionic-native/video-editor';


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
  owner:any;
  currentUser:any;
  nativepath:any;
  thumbnail:any;
  medialist:string[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl:LoadingController,
              public camera:Camera,private mediaCapture: MediaCapture,public alertCtrl:AlertController,
              public actionSheetCtrl: ActionSheetController,public filechooser: FileChooser,public http:Http,
              public userservice: UserProvider,public file:File,public groupservice:GroupsProvider,
              private photoViewer: PhotoViewer,private videoPlayer: VideoPlayer,private videoEditor: VideoEditor) {

this.currentUser = firebase.auth().currentUser.uid;
console.log("user is"+this.currentUser);


  }

  ngOnInit(){
    this.group = this.navParams.get('member');
    this.currentUser = firebase.auth().currentUser.uid;
    this.groupId = this.group.key;
    // this.getthumbnail(this.group.value.videoUrl);
    console.log("this group is"+this.group.key);
    // this.index = this.navParams.get('index');
    this.loadmedia();
  let num:any = this.groupservice.getOwnerGroupId('jccxH4ffpaUs6R0TJ77i6kxGyRl1','563314488');
  console.log('num is'+num);
  }

  getthumbnail(url:string){
    let options = {
      'fileUri':url,
      'outputFileName':'video Thumbnail'
    }
    this.videoEditor.createThumbnail(options).then((res:any) => {
      console.log('res is '+res);
      let alertnew = this.alertCtrl.create({
        title: 'Response is!',
        subTitle: res,
        buttons: ['OK']
      });

      alertnew.present();
      this.thumbnail = res;
    }).catch((err:any)=> {
      console.log('Error in creating thumbnail'+err);
    });

  }
  onphotoClick(src:string){
    this.photoViewer.show(src);
  }
  onvideoClick(src:string){
    this.videoPlayer.play(src).then(() => {
      console.log('video completed');
    }).catch(err => {
      console.log(err);
    });
  }

  loadmedia(){

      let cameraImageSelector = document.getElementById('camera-image');
      //cameraImageSelector.setAttribute('src', this.group.value.photoUrl);


    let mediaSelector = document.getElementById('media-file');
    for (let img in this.group.value.mediaFiles){
      //console.log("img is"+this.group.value.mediaFiles[img]);
      if(this.group.value.mediaFiles[img] != ''){
        console.log("insides"+this.group.value.mediaFiles[img]);
       // mediaSelector.setAttribute('src', this.group.value.mediaFiles[img]);
        this.checkUrl(this.group.value.mediaFiles[img]).subscribe((res:Response)=>{
          this.medialist.push(this.group.value.mediaFiles[img]);
          console.log("response is"+res);
        })

      }

    }
    //mediaSelector.setAttribute('src', this.group.value.mediaFiles);



  }

  checkUrl(url:string){
    return this.http.get(url).map((res:Response)=>{
//console.log("hello"+res);
      return res;
    })
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
    //this.uploadimage();
    let options = {
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: this.camera.MediaType.ALLMEDIA,
      destinationType: this.camera.DestinationType.FILE_URI
    }
    this.getMedia(options).then((res)=>{
      console.log(res);
      let alert3 = this.alertCtrl.create({
        title: 'Response is!',
        subTitle: res,
        buttons: ['OK']
      });
      alert3.present();
      loader.dismiss();
    }).catch((err) => {
      loader.dismiss();
    });
   loader.dismiss();


  }


// // Ability to upload videos
//   public options: any = {
//     sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
//     mediaType: this.camera.MediaType.ALLMEDIA,
//     destinationType: this.camera.DestinationType.FILE_URI
//   }

  getMedia(options): Promise<any> {
    return new Promise((resolve, reject) => {

      this.camera.getPicture(options).then( (fileUri: any) => {


        console.log('File URI: ' + JSON.stringify(fileUri));
         let fileURL = JSON.stringify(fileUri);


        this.file.resolveLocalFilesystemUrl("file://"+fileUri).then((fileEntry:any) => {
          // let alert6 = this.alertCtrl.create({
          //   title: 'File entry is',
          //   subTitle: fileUri,
          //   buttons: ['OK']
          // });
          // alert6.present();
          console.log('Type: ' + (typeof fileEntry));
          fileEntry.file( (file) => {
            console.log('File: ' + (typeof file) + ', ' + JSON.stringify(file));

            const fileReader = new FileReader();

            fileReader.onloadend = (result: any) => {
              console.log('File Reader Result: ' + JSON.stringify(result));
              let arrayBuffer = result.target.result;
              let blob = new Blob([new Uint8Array(arrayBuffer)]);
              const name = '' + Date.now() + firebase.auth().currentUser.uid;
              let alert2 = this.alertCtrl.create({
                title: 'blob created!',
                subTitle: name,
                buttons: ['OK']
              });
              alert2.present();
              let loader = this.loadingCtrl.create({
                content: 'Please wait'
              });
              loader.present();

              let storageRef = firebase.storage().ref('/videos');
              const imageRef = storageRef.child(firebase.auth().currentUser.uid).child(this.groupId);
              //let metadata =  {type: 'video/mp4'};
              if((fileURL.indexOf(".jpg") != -1)|| (fileURL.indexOf(".JPG") != -1) || (fileURL.indexOf(".png") != -1) || (fileURL.indexOf(".PNG") != -1)){
                var metadata =  {'contentType': 'image/jpg'};
              }else {
                var metadata = {'contentType':'video/mp4'};
              }
              let alert10 = this.alertCtrl.create({
                title: 'meta data is!',
                subTitle: JSON.stringify(metadata),
                buttons: ['OK']
              });
              alert10.present();

              imageRef.put(blob,metadata).then((res) => {
                imageRef.getDownloadURL().then((url) => {
                  resolve(url);
                  let alert2 = this.alertCtrl.create({
                    title: 'download url is!',
                    subTitle: url,
                    buttons: ['OK']
                  });
                  alert2.present();
                  loader.dismiss();
                }).catch((err) => {
                  loader.dismiss();
                  reject(err);
                })
              });
             // this.upload(blob, name , file.type, resolve, reject);
            };

            fileReader.onerror = (error: any) => {
              reject(error);
            };

            fileReader.readAsArrayBuffer(file);
          }, (error) => {
            console.log('File Entry Error: ' + JSON.stringify(error));
          });
        }, (error) => {
          let alert3 = this.alertCtrl.create({
            title: 'error!',
            subTitle: 'error',
            buttons: ['OK']
          });
          alert3.present();
          console.log('Error resolving file: ' + JSON.stringify(error));
        });

      });
    });
  }



  photoUpload() {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Take Picture',
          handler: () => {
            let options = {
              sourceType: this.camera.PictureSourceType.CAMERA,
              mediaType: this.camera.MediaType.ALLMEDIA,
              destinationType: this.camera.DestinationType.DATA_URL
            }
            let loader = this.loadingCtrl.create({
              content: 'Please wait'
            })
            loader.present();

            this.camera.getPicture(options).then((imageData: any) => {
              // imageData is either a base64 encoded string or a file URI
              loader.dismiss();
              let image = "data:image/jpeg;base64," + imageData;

              let url = image;
              let storageRef = firebase.storage().ref('/images');
              // Create a timestamp as filename
              const filename = Math.floor(Date.now() / 1000);

              // Create a reference to 'images/todays-date.jpg'

              const imageRef = storageRef.child(firebase.auth().currentUser.uid).child(this.groupId);


              imageRef.putString(url, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {

                storageRef.child(firebase.auth().currentUser.uid).child(this.groupId).getDownloadURL().then((url) => {

                  let loader = this.loadingCtrl.create({
                    content: 'Please wait'
                  });
                  loader.present();


                  this.groupservice.updateGroup(this.currentUser,this.groupId,this.group.value.groupMatchKey,this.group.value.owner,
                    url,this.group.value.videoUrl,this.group.value.mediaFiles,this.group.value.finalVideo).subscribe((res:any)=>{
                    let alert2 = this.alertCtrl.create({
                      title: 'in subscribe!',
                      subTitle: 'res is'+res.json(),
                      buttons: ['OK']
                    });
                    alert2.present();
                    loader.dismiss();
                  })
                  loader.dismiss();

                  let cameraImageSelector = document.getElementById('camera-image');
                  this.group.value.photoUrl = url;
               //   cameraImageSelector.setAttribute('src', url);
                  //   .then((res:any) => {
                  //
                  //       let alert = this.alertCtrl.create({
                  //         title: 'Updated!',
                  //         subTitle: 'Your file has been uploaded!!!',
                  //         buttons: ['OK']
                  //       });
                  //       alert.present();
                  // })

                  //   .then(() =>{
                  //
                  // });
                  // this.userservice.updateimage(url).then((res: any) => {
                  //   if (res.success) {
                  //     let alert = this.alertCtrl.create({
                  //       title: 'Updated!',
                  //       subTitle: 'Your profile pic has been changed successfully!!!',
                  //       buttons: ['OK']
                  //     });
                  //     alert.present();
                  //
                  //     //this.navCtrl.setRoot(TabsPage);
                  //   }
                  // });

                }).catch((err) => {
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
              loader.dismissAll();
              // Handle error
            });

          }
        },
        {
          text: 'Choose from gallery',
          handler: () => {

            let options = {
              sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
              mediaType: this.camera.MediaType.PICTURE,
              destinationType: this.camera.DestinationType.DATA_URL
            }
            let loader = this.loadingCtrl.create({
              content: 'Please wait'
            })
            loader.present();

            this.camera.getPicture(options).then((imageData: any) => {
              // imageData is either a base64 encoded string or a file URI
              loader.dismiss();
              let image = "data:image/jpeg;base64," + imageData;

              let url = image;
              let storageRef = firebase.storage().ref('/images');
              // Create a timestamp as filename
              const filename = Math.floor(Date.now() / 1000);

              // Create a reference to 'images/todays-date.jpg'

              const imageRef = storageRef.child(firebase.auth().currentUser.uid).child(this.groupId);


              imageRef.putString(url, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {

                storageRef.child(firebase.auth().currentUser.uid).child(this.groupId).getDownloadURL().then((url) => {
                  let loader = this.loadingCtrl.create({
                    content: 'Please wait'
                  });
                  loader.present();


                  this.groupservice.updateGroup(this.currentUser,this.groupId,this.group.value.groupMatchKey,this.group.value.owner,
                    url,this.group.value.videoUrl,this.group.value.mediaFiles,this.group.value.finalVideo).subscribe((res:any)=>{
                    let alert2 = this.alertCtrl.create({
                      title: 'in subscribe!',
                      subTitle: 'res is'+res.json(),
                      buttons: ['OK']
                    });
                    alert2.present();
                    loader.dismiss();
                  })
                  loader.dismiss();
                  let cameraImageSelector = document.getElementById('camera-image');
                  this.group.value.photoUrl = url;
                //  cameraImageSelector.setAttribute('src', url);


                }).catch((err) => {
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
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  videoUpload(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Video Source',
      buttons: [
        {
          text: 'Take Video',
          handler: () => {
            let options = {
              sourceType: this.camera.PictureSourceType.CAMERA,
              mediaType: this.camera.MediaType.ALLMEDIA,
              destinationType: this.camera.DestinationType.DATA_URL
            }
            let loader = this.loadingCtrl.create({
              content: 'Please wait'
            })
            //loader.present();


          }
        },
        {
          text: 'Choose from gallery',
          handler: () => {

            let loader = this.loadingCtrl.create({
              content: 'Please wait'
            });
            loader.present();
            //this.uploadimage();
            let options = {
              sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
              mediaType: this.camera.MediaType.ALLMEDIA,
              destinationType: this.camera.DestinationType.FILE_URI
            }
            this.getMedia(options).then((res)=>{
              console.log(res);
              let alert3 = this.alertCtrl.create({
                title: 'Response is!',
                subTitle: res,
                buttons: ['OK']
              });
              alert3.present();

              this.groupservice.updateGroup(this.currentUser,this.groupId,this.group.value.groupMatchKey,this.group.value.owner,
                this.group.value.photoUrl,res,this.group.value.mediaFiles,this.group.value.finalVideo).subscribe((res:any)=>{
                let alert2 = this.alertCtrl.create({
                  title: 'in subscribe!',
                  subTitle: 'res is'+res.json(),
                  buttons: ['OK']
                });
                alert2.present();
              })

              let cameraImageSelector = document.getElementById('lib-video');

              cameraImageSelector.setAttribute('src', res);


              loader.dismiss();
            }).catch((err) => {
              loader.dismiss();
            });
            loader.dismiss();




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

  openCamera() {

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
            let options = {
              sourceType: this.camera.PictureSourceType.CAMERA,
              mediaType: this.camera.MediaType.ALLMEDIA,
              destinationType: this.camera.DestinationType.FILE_URI
            }

            let loader = this.loadingCtrl.create({
              content: 'Please wait'
            });
            loader.present();
            this.getMedia(options).then((res)=>{
              console.log(res);
              let alert3 = this.alertCtrl.create({
                title: 'Response is!',
                subTitle: res,
                buttons: ['OK']
              });
              alert3.present();
              loader.dismiss();
            }).catch((err) => {
              loader.dismiss();
            });
            loader.dismiss();
            // this.camera.getPicture(options).then((imageData) => {
            //
            //       console.log(imageData);
            //     let imageurl = 'data:image/jpeg;base64,'+imageData;
            //
            //         let storageRef = firebase.storage().ref('/videos');
            //
            //    const imageRef = storageRef.child(firebase.auth().currentUser.uid);
            //         imageRef.putString(imageurl, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {
            //           storageRef.child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
            //             let alert = this.alertCtrl.create({
            //               title: 'Url!',
            //               subTitle: url,
            //               buttons: ['OK']
            //             });
            //             alert.present();
            //             // this.chatservice.addnewmessage(url).then(() => {
            //             //   this.scrollto();
            //             //   this.newmessage = '';
            //             // })
            //           }).catch((err) => {
            //           });
            //         }).catch((err) => {
            //
            //         })
            //
            //   },
            //     (err: CaptureError) => console.error(err)
            //   );




          }
        },
        {
          text: 'Take Video',
          handler: () => {

            let options: CaptureVideoOptions = {limit: 3};
            this.mediaCapture.captureVideo()
              .then((data: MediaFile[]) => {
                console.log(data);


                let index = data[0].fullPath.lastIndexOf('/'), finalPath = data[0].fullPath.substr(0, index);
                let alert = this.alertCtrl.create({
                  title: 'blob is!',
                  subTitle: finalPath,
                  buttons: ['OK']
                });
                alert.present();
                //new code


                this.file.resolveLocalFilesystemUrl("file://"+ data[0].fullPath).then((fileEntry:any) => {
                  let alert6 = this.alertCtrl.create({
                    title: 'File entry is',
                    subTitle:  data[0].fullPath,
                    buttons: ['OK']
                  });
                  alert6.present();
                  console.log('Type: ' + (typeof fileEntry));
                  fileEntry.file( (file) => {
                    console.log('File: ' + (typeof file) + ', ' + JSON.stringify(file));

                    const fileReader = new FileReader();

                    fileReader.onloadend = (result: any) => {
                      console.log('File Reader Result: ' + JSON.stringify(result));
                      let arrayBuffer = result.target.result;
                      let blob = new Blob([new Uint8Array(arrayBuffer)]);
                      const name = '' + Date.now() + firebase.auth().currentUser.uid;
                      let alert2 = this.alertCtrl.create({
                        title: 'blob created!',
                        subTitle: name,
                        buttons: ['OK']
                      });
                      alert2.present();
                      let loader = this.loadingCtrl.create({
                        content: 'Please wait'
                      });
                      loader.present();

                      let storageRef = firebase.storage().ref('/videos');
                      const imageRef = storageRef.child(firebase.auth().currentUser.uid);
                      //let metadata =  {type: 'video/mp4'};

                        let metadata = {type:'video/mp4'};

                      imageRef.put(blob,metadata).then((res) => {
                        imageRef.getDownloadURL().then((url) => {
                          //resolve(url);
                          let alert2 = this.alertCtrl.create({
                            title: 'download url is!',
                            subTitle: url,
                            buttons: ['OK']
                          });
                          alert2.present();
                          loader.dismiss();
                        }).catch((err) => {
                          loader.dismiss();
                          //reject(err);
                        })
                      });
                      // this.upload(blob, name , file.type, resolve, reject);
                    };

                    fileReader.onerror = (error: any) => {
                     // reject(error);
                    };

                    fileReader.readAsArrayBuffer(file);
                  }, (error) => {
                    console.log('File Entry Error: ' + JSON.stringify(error));
                  });
                }, (error) => {
                  let alert3 = this.alertCtrl.create({
                    title: 'error!',
                    subTitle: 'error',
                    buttons: ['OK']
                  });
                  alert3.present();
                  console.log('Error resolving file: ' + JSON.stringify(error));
                });


                // //old code
                // //replace final path
                //     this.file.readAsArrayBuffer(data[0].fullPath, data[0].name).then((file) => {
                //       let blob = new Blob([file], {type: data[0].type});
                //     //  let task = this.postRef.child(data[0].name]).put(blob);
                //
                //       let storageRef = firebase.storage().ref('/videos');
                //
                //       const imageRef = storageRef.child(firebase.auth().currentUser.uid);
                //       imageRef.put(blob).then((res: any) => {
                //         let alert2 = this.alertCtrl.create({
                //           title: 'blob is!',
                //           subTitle: JSON.stringify(res),
                //           buttons: ['OK']
                //         });
                //         alert2.present();
                //
                //         storageRef.child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
                //
                //
                //           let alert = this.alertCtrl.create({
                //             title: 'Url!',
                //             subTitle: url,
                //             buttons: ['OK']
                //           });
                //           alert.present();
                //           // this.chatservice.addnewmessage(url).then(() => {
                //           //   this.scrollto();
                //           //   this.newmessage = '';
                //           // })
                //         }).catch((err) => {
                //         });
                //
                //
                //       });
                //
                //     }).catch(err => { console.log(err); });
                //
                //   // Generate filename and upload to Firebase Storage.




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

