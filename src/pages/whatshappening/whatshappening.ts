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
  constructor(public navCtrl: NavController,private tabStateService: TabStateServiceProvider,
              private groupService: GroupsProvider,
              private authService: AuthProvider,public navParams: NavParams,public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WhatshappeningPage');
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
        if(data[mem].type == 'Memories'){
          count++;
          // this.activeGroup = data[mem];
          // this.groupId = mem;
          // console.log('groupId is '+mem);
        }
      }
      if(count == 1){
        // this.camera.enabled = true;
      this.tabStateService.setState("picnicCamera",true);
       // this.states["picnicCamera"] = true;
      }
      console.log('count is'+count);


      var ReverseArray:any =[]
      // var length = data.length;
      // console.log('length is'+length);
      // for(var i = length-1;i>=0;i--){
      //   console.log('reverse array '+data[i]);
      //  // ReverseArray.push(data[i]);
      // }
      let body:any ={}
      for(let mem in data){
        console.log('mem is'+mem);
        body ={
          mem:data[mem]
        }
        ReverseArray.push(body);
      }

      this.memberGroup = data;


      console.log('finally'+JSON.stringify(ReverseArray));

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
