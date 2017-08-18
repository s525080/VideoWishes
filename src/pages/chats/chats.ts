import { Component } from '@angular/core';
import {AlertController, Events, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FriendsPage} from "../friends/friends";
import {RequestsProvider} from "../../providers/requests/requests";
import {PersonalchatPage} from "../personalchat/personalchat";
import {ChatProvider} from "../../providers/chat/chat";

/**
 * Generated class for the ChatsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  myrequests;
  myfriends;
  constructor(public navCtrl: NavController, public navParams: NavParams, public requestservice: RequestsProvider,
              public events: Events,public alertCtrl: AlertController, public chatservice: ChatProvider,
              public loadingCtrl:LoadingController) {
  }


  ionViewWillEnter() {
    this.requestservice.getmyrequests();
    this.requestservice.getmyfriends();
    this.myfriends = [];
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.events.subscribe('gotrequests', () => {
      this.myrequests = [];
      this.myrequests = this.requestservice.userdetails;
      loader.dismiss();
    })
    this.events.subscribe('friends', () => {
      this.myfriends = [];
      this.myfriends = this.requestservice.myfriends;
      loader.dismiss();
    })
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotrequests');
    this.events.unsubscribe('friends');
  }
  addbuddy() {
    this.navCtrl.push(FriendsPage);
  }

  buddychat(buddy) {
    this.chatservice.initializebuddy(buddy);
    this.navCtrl.push(PersonalchatPage);
  }

  accept(item) {
    this.requestservice.acceptrequest(item).then(() => {

      let newalert = this.alertCtrl.create({
        title: 'Friend added',
        subTitle: 'Tap on the friend to chat with him',
        buttons: ['Okay']
      });
      newalert.present();
    })
  }

  ignore(item) {
    this.requestservice.deleterequest(item).then(() => {
      alert('Request ignored');
    }).catch((err) => {
      alert(err);
    })
  }



}
