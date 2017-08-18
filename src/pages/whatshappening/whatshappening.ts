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
  constructor(public navCtrl: NavController,
              private groupService: GroupsProvider,
              private authService: AuthProvider,public navParams: NavParams,public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WhatshappeningPage');
  }

  ionViewWillEnter(){
    console.log('ion view will enter');
    //this.listItems = this.groupService.getGroups();
    //this.memberGroup = this.groupService.getGroups();

    this.groupService.getGroups().subscribe(data => {
      console.log('final ' + JSON.stringify(data));
      this.memberGroup = data;
      console.log('finally'+JSON.stringify(this.memberGroup));

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
