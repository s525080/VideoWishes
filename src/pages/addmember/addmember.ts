import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {WhatsnewPage} from "../whatsnew/whatsnew";

/**
 * Generated class for the AddmemberPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-addmember',
  templateUrl: 'addmember.html',
})
export class AddmemberPage {

  contactlist : any;
  newGroupList : any;
  private searchFriend: any;
  constructor(public navCtrl: NavController,private alertCtrl : AlertController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
  //this.searchFriend = '';
  this.contactlist = this.navParams.get('finalContacts');
  console.log(this.contactlist);
    const newContactAlert = this.alertCtrl.create({
      title: 'contact',
      message : this.contactlist,
      buttons : [
        {
          text : ' Cancel',
          role : 'cancel'
        }
      ]
    })
     // newContactAlert.present();

  }

  updateGroup(friend:any){
    this.newGroupList.push(friend);
  }

  done(){
    let finalList = this.newGroupList;
    this.navCtrl.push(WhatsnewPage,{finalList});
  }
}
