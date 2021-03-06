import { Component } from '@angular/core';
import {FabContainer, NavController, NavParams, PopoverController} from 'ionic-angular';
import {ChatsPage} from "../chats/chats";
import {SettingsPage} from "../settings/settings";
import {ProfilePage} from "../profile/profile";
import {PopoverPage} from "../popover/popover";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {GroupsProvider} from "../../providers/groups/groups";
import {TabStateServiceProvider} from "../../providers/tab-state-service/tab-state-service";
import {MetaGroup} from "../../models/interfaces/metagroup";
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
  activeGroup:MetaGroup;
  information: any[];
  currentDate = (new Date()).toString();
  minDate = this.formatDate(this.currentDate);
  constructor(public navCtrl: NavController, private tabStateService: TabStateServiceProvider,
              private groupService: GroupsProvider,
              public navParams: NavParams,public popoverCtrl: PopoverController,
              private http: Http) {
    let localData = http.get('assets/library.json').map(res => res.json().items);
    localData.subscribe(data => {
      this.library = data;
    })
    this.groupService.getGroups().subscribe(data => {
      console.log('final ' + JSON.stringify(data));

      let count = 0;
      for(let mem in data){
        console.log(this.currentDate);
        console.log(this.minDate);
        console.log(data[mem].todate);
        if(data[mem].type == 'Memories'){

          let formattedTodate = this.formatDate(data[mem].todate);
          console.log(formattedTodate);
          if(this.minDate == formattedTodate){
            count++;
            if(count == 1){
              this.activeGroup = data[mem];
            }

          }
          // this.groupId = mem;
          // console.log('groupId is '+mem);
        }
      }
      if(count == 1){
        this.tabStateService.setState("Camera",true);
      }

      console.log('count is'+count);

    });

    // let localData2 = http.get('assets/information.json').map(res => res.json().items);
    // localData2.subscribe(data => {
    //   this.information = data;
    // })
  }





  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year,month, day].join('-');
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
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
