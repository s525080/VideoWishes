// import { Injectable } from '@angular/core';
// import { Platform } from 'ionic-angular';
// import { Camera } from 'ionic-native';
// //import { StorageService } from './storage.service';
// import { AuthProvider } from '../auth/auth';
// declare var window: any;
// @Injectable()
// export class CameraService {
//
// // Ability to upload videos
//   public options: any = {
//     sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
//     mediaType: Camera.MediaType.ALLMEDIA,
//     destinationType: Camera.DestinationType.FILE_URI
//   }
//
//   constructor(public platform: Platform,
//               public auth: AuthProvider) {}
//
//   getMedia(): Promise<any> {
//     return new Promise((resolve, reject) => {
//       Camera.getPicture(this.options).then( (fileUri: any) => {
//         console.log('File URI: ' + JSON.stringify(fileUri));
//         window.resolveLocalFileSystemURL('file://' + fileUri, (fileEntry) => {
//           console.log('Type: ' + (typeof fileEntry));
//           fileEntry.file( (file) => {
//             console.log('File: ' + (typeof file) + ', ' + JSON.stringify(file));
//             const fileReader = new FileReader();
//
//             fileReader.onloadend = (result: any) => {
//               console.log('File Reader Result: ' + JSON.stringify(result));
//               let arrayBuffer = result.target.result;
//               let blob = new Blob([new Uint8Array(arrayBuffer)], {type: 'video/mp4'});
//               const name = '' + Date.now() + this.auth.getActiveUser().uid;
//               this.upload(blob, name , file.type, resolve, reject);
//             };
//
//             fileReader.onerror = (error: any) => {
//               reject(error);
//             };
//
//             fileReader.readAsArrayBuffer(file);
//           }, (error) => {
//             console.log('File Entry Error: ' + JSON.stringify(error));
//           });
//         }, (error) => {
//           console.log('Error resolving file: ' + JSON.stringify(error));
//         });
//       });
//     });
//   }
//
//   upload(blob: Blob, name: string, type: string, resolve: any, reject: any) {
//     let uploadTask = this.storage.addBlob( name , type, blob);
//     uploadTask.on('state_changed' , (snapshot) => {
//       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log('Upload is ' + progress + '% done');
//       switch (snapshot.state) {
//         case firebase.storage.TaskState.PAUSED: // or 'paused'
//           console.log('Upload is paused');
//           break;
//         case firebase.storage.TaskState.RUNNING: // or 'running'
//           console.log('Upload is running');
//           break;
//       }
//     }, (error: any) => {
//       console.log('An Error has occured');
//       switch (error.code) {
//         case 'storage/unauthorized':
//           // User doesn't have permission to access the object
//           console.log('Unauthorized Access: ' + JSON.stringify(error));
//           reject(error.code);
//           break;
//         case 'storage/canceled':
//           // User canceled the upload
//           console.log('Canceled');
//           reject(error.code);
//           break;
//         case 'storage/unknown':
//           // Unknown error occurred, inspect error.serverResponse
//           console.log('Storage Unkown: ' + JSON.stringify(error));
//           reject(error.code);
//           break;
//         default:
//           console.log('Default: ' + JSON.stringify(error));
//           reject(error.code);
//           break;
//       }
//     }, () => {
//       console.log('Finished Uploading');
//       resolve( {url: uploadTask.snapshot.downloadURL, name: name, mediaType: type} );
//     });
//   }
// }
