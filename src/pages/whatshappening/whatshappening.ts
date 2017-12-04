import { Component } from '@angular/core';
import {FabContainer, NavController, NavParams, PopoverController} from 'ionic-angular';
import {ChatsPage} from "../chats/chats";
import {SettingsPage} from "../settings/settings";
import {ProfilePage} from "../profile/profile";
import {MetaGroup} from "../../models/interfaces/metagroup";
import {GroupsService} from "../../services/groups";
import {ExistingGroupPage} from "../existing-group/existing-group";
import {PopoverPage} from "../popover/popover";
import {GroupsProvider} from "../../providers/groups/groups";
import {AuthProvider} from "../../providers/auth/auth";
import {TabStateServiceProvider} from "../../providers/tab-state-service/tab-state-service";

/**
 * Generated class for the WhatshappeningPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-whatshappening',
  templateUrl: 'whatshappening.html',
})
export class WhatshappeningPage {
  memberGroup: MetaGroup[];
  ReverseArray:any;
  tempGroup:any;
  testDate = new Date();
  activeGroup:MetaGroup;
  currentDate = (new Date()).toString();
  minDate = this.formatDate(this.currentDate);

  constructor(public navCtrl: NavController,private tabStateService: TabStateServiceProvider,
              private groupService: GroupsProvider,
              private authService: AuthProvider,public navParams: NavParams,public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WhatshappeningPage');
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
  ionViewWillEnter(){
    console.log('ion view will enter');
    this.groupService.getAllGroupUsers().then((res)=>{
      console.log('in gs'+JSON.stringify(res));
    })
    //this.listItems = this.groupService.getGroups();
    //this.memberGroup = this.groupService.getGroups();

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



      this.tempGroup = data;
      // this.ReverseArray = [].slice.call(this.tempGroup).sort((a: any, b: any) =>
      //   (a.value.modifiedDate) - (b.value.modifiedDate)
      // );

      // [].slice.call(this.tempGroup).sort(function(a,b) {
      //   if ( new Date(a.modifiedDate).getTime() > new Date(b.modifiedDate).getTime() )
      //     return -1;
      //   if ( new Date(a.modifiedDate).getTime() < new Date(b.modifiedDate).getTime()  )
      //     return 1;
      //   return 0;
      // } );

      // [].slice.call(this.tempGroup).sort(function(a,b) {
      //   if ( a.value.modifiedDate > b.value.modifiedDate )
      //     return -1;
      //   if ( a.value.modifiedDate < b.value.modifiedDate  )
      //     return 1;
      //   return 0;
      // } );


      //console.log('finally'+JSON.stringify(ReverseArray));
      this.memberGroup = data;
       //this.memberGroup = this.ReverseArray;



    });

  }


  onLoadGroup(member: MetaGroup,index: number){
    this.navCtrl.push(ExistingGroupPage,{member: member, index: index});
  }


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
