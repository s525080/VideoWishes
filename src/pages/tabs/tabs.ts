import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ChatsPage} from "../chats/chats";
import {GroupsPage} from "../groups/groups";
import {ProfilePage} from "../profile/profile";
import {LibraryPage} from "../library/library";
import {CalenderPage} from "../calender/calender";
import {WhatsnewPage} from "../whatsnew/whatsnew";
import {WhatshappeningPage} from "../whatshappening/whatshappening";

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
export class TabsPage {
   variable: any;

  chatsPage = ChatsPage;
  groupsPage = GroupsPage;
  profilePage = ProfilePage;
  libraryPage = LibraryPage;
  calender = CalenderPage;
  whatsnew = WhatsnewPage;
  whatshappening = WhatshappeningPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.variable = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
