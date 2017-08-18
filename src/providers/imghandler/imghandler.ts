import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {FileChooser} from "@ionic-native/file-chooser";
import firebase from 'firebase';
import {Camera} from "@ionic-native/camera";

/*
  Generated class for the ImghandlerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ImghandlerProvider {

  nativepath: any;
  firestore = firebase.storage();
  constructor(public filechooser: FileChooser,public camera: Camera) {
  }

  uploadimage(url:any) {
    var promise = new Promise((resolve, reject) => {

        (<any>window).FilePath.resolveNativePath(url, (result) => {
          this.nativepath = result;
          (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
            res.file((resFile) => {
              var reader = new FileReader();
              reader.readAsArrayBuffer(resFile);
              reader.onloadend = (evt: any) => {
                var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                var imageStore = this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid);
                imageStore.put(imgBlob).then((res) => {
                  this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
                    resolve(url);
                  }).catch((err) => {
                    reject(err);
                  })
                }).catch((err) => {
                  reject(err);
                })
              }
            })
          })
        })

    })
    return promise;
  }


  uploadimage2() {
    var promise = new Promise((resolve, reject) => {
      this.filechooser.open().then((url) => {
        (<any>window).FilePath.resolveNativePath(url, (result) => {
          this.nativepath = result;
          (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
            res.file((resFile) => {
              var reader = new FileReader();
              reader.readAsArrayBuffer(resFile);
              reader.onloadend = (evt: any) => {
                var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                var imageStore = this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid);
                imageStore.put(imgBlob).then((res) => {
                  this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
                    resolve(url);
                  }).catch((err) => {
                    reject(err);
                  })
                }).catch((err) => {
                  reject(err);
                })
              }
            })
          })
        })
      })
    })
    return promise;
  }

  picmsgstore() {
    var promise = new Promise((resolve, reject) => {

      this.filechooser.open().then((url) => {
        (<any>window).FilePath.resolveNativePath(url, (result) => {
          this.nativepath = result;
          (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
            res.file((resFile) => {
              var reader = new FileReader();
              reader.readAsArrayBuffer(resFile);
              reader.onloadend = (evt: any) => {
                var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                var uuid = this.guid();
                var imageStore = this.firestore.ref('/picmsgs').child(firebase.auth().currentUser.uid).child('picmsg' + uuid);
                imageStore.put(imgBlob).then((res) => {
                  resolve(res.downloadURL);
                }).catch((err) => {
                  reject(err);
                })
                  .catch((err) => {
                    reject(err);
                  })
              }
            })
          })
        })
      })
    })
    return promise;
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

  takePicture(){
  var promise = new Promise((resolve, reject) => {
    this.camera.getPicture({
      quality : 95,
      destinationType : this.camera.DestinationType.DATA_URL,
      sourceType : this.camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: this.camera.EncodingType.PNG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: true
    }).then((url) => {


              var uuid = this.guid();
              var imageStore = this.firestore.ref('/picmsgs').child(firebase.auth().currentUser.uid).child('picmsg' + uuid);
              imageStore.put(url).then((res) => {
                resolve(res.downloadURL);
              }).catch((err) => {
                reject(err);
              })

          })

  })
    return promise;
  }

}
