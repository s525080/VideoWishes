import { Component } from '@angular/core';
import {FabContainer, NavController, NavParams, PopoverController} from 'ionic-angular';
import {ChatsPage} from "../chats/chats";
import {SettingsPage} from "../settings/settings";
import {ProfilePage} from "../profile/profile";
import {PopoverPage} from "../popover/popover";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
// import {StreamingMedia, StreamingVideoOptions} from "@ionic-native/streaming-media";


/**
 * Generated class for the LibraryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-library',
  templateUrl: 'library.html',
})
export class LibraryPage {
  library: any[];
  expand: any;
  myInput:any;
  information: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public popoverCtrl: PopoverController,
              private http: Http) {
    let localData = http.get('assets/library.json').map(res => res.json().items);
    localData.subscribe(data => {
      this.library = data;
    })


    // let localData2 = http.get('assets/information.json').map(res => res.json().items);
    // localData2.subscribe(data => {
    //   this.information = data;
    // })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LibraryPage');
  }
//   options: StreamingVideoOptions = {
//   successCallback: () => { console.log('Video played') },
//   errorCallback: (e) => { console.log('Error streaming') },
//   orientation: 'landscape'
// };


  onRowClick(){

    this.expand = true;


  }
  // play(item){
  //   console.log("url is"+item.url);
  //   this.streamingMedia.playVideo(item.url, this.options);
  //
  // }


  toggleSection(i) {
    this.library[i].open = !this.library[i].open;
  }
  //
  // toggleItem(i, j) {
  //   this.information[i].children[j].open = !this.information[i].children[j].open;
  // }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }
  onchat(fab: FabContainer){
    this.navCtrl.push(ChatsPage);
     fab.close();
  }

  onsettings(fab: FabContainer){
    this.navCtrl.push(SettingsPage);
    fab.close();
  }

  onProfile(fab: FabContainer){
    this.navCtrl.push(ProfilePage);
    fab.close();
  }


}
