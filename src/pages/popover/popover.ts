import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {ChatsPage} from "../chats/chats";
import {SettingsPage} from "../settings/settings";
import {ProfilePage} from "../profile/profile";

/**
 * Generated class for the PopoverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }
  onchat(){
    this.navCtrl.push(ChatsPage);
    this.viewCtrl.dismiss();
  }

  onsettings(){
    this.navCtrl.push(SettingsPage);
    this.viewCtrl.dismiss();
  }

  onProfile(){
    this.navCtrl.push(ProfilePage);
    this.viewCtrl.dismiss();
  }
}
