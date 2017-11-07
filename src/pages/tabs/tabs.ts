import {Component, OnInit} from '@angular/core';
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
import {GroupsProvider} from "../../providers/groups/groups";
import {MetaGroup} from "../../models/interfaces/metagroup";
import {TabStateServiceProvider} from "../../providers/tab-state-service/tab-state-service";

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
export class TabsPage implements OnInit{
   variable: any;

  chatsPage = ChatsPage;
  groupsPage = GroupsPage;
  profilePage = ProfilePage;
  libraryPage = LibraryPage;
  calender = CalenderPage;
  whatsnew = WhatsnewPage;
  whatshappening = WhatshappeningPage;
  currentUser:any;
  nativepath :any;
  activeGroup:MetaGroup;
  groupId:string;
  public states: { [s: string]: any } = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,private tabStateService:TabStateServiceProvider,
              public loadingCtrl:LoadingController,private groupService: GroupsProvider,
              public camera:Camera,private mediaCapture: MediaCapture,public alertCtrl:AlertController,
              public actionSheetCtrl: ActionSheetController,public filechooser: FileChooser) {
    this.variable = false;
  }

  ngOnInit(){
    this.currentUser = firebase.auth().currentUser.uid;
this.checkCapsuleCount();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  checkCapsuleCount(){
    this.groupService.getGroups().subscribe(data => {
      console.log('final length is' + JSON.stringify(data));
      let count = 0;
      for(let mem in data){
        if(data[mem].type == 'Memories'){
          count++;
          this.activeGroup = data[mem];
          this.groupId = mem;
          console.log('groupId is '+mem);

        }
      }
      if(count == 1){
        // this.camera.enabled = true;

        // this.states["picnicCamera"] = true;
      }
      console.log('count is'+count);


    });
  }
  openCamera(){
    this.checkCapsuleCount();
console.log("in camera "+this.groupId);
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.CAMERA,
      mediaType: this.camera.MediaType.ALLMEDIA,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality : 95,
      saveToPhotoAlbum: true
    }).then((imageData) => {
        let loader = this.loadingCtrl.create({
          content: 'Please wait'
        });
        loader.present();
        console.log(imageData);
        let imageurl = 'data:image/jpeg;base64,'+imageData;

        let storageRef = firebase.storage().ref('/images');

        const imageRef = storageRef.child(firebase.auth().currentUser.uid);
        imageRef.putString(imageurl, firebase.storage.StringFormat.DATA_URL).then((res: any)=> {



          storageRef.child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {


           // this.activeGroup.mediaFiles.push(url);



            this.groupService.updateNonSurpriseGroup(this.activeGroup.contacts,this.currentUser,this.groupId,this.activeGroup.groupMatchKey,this.activeGroup.owner,
              url,this.activeGroup.videoUrl,this.activeGroup.mediaFiles,this.activeGroup.finalVideo).subscribe((res:any)=>{
              let alert2 = this.alertCtrl.create({
                title: 'in subscribe!',
                subTitle: 'res is'+res.json(),
                buttons: ['OK']
              });
              alert2.present();
              loader.dismiss();
            })
            loader.dismiss();


          }).catch((err) => {
          });
        }).catch((err) => {

        })



      },
      (err: CaptureError) => console.error(err)
    );


  }

}
