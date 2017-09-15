import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {MetaGroup} from "../../models/interfaces/metagroup";
import {Contact} from "@ionic-native/contacts";
import {AuthProvider} from "../auth/auth";
import {SMS} from "@ionic-native/sms";

/*
  Generated class for the GroupsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GroupsProvider {

  private chatGroups: MetaGroup[] =[];
  private metaGroup : MetaGroup ;

  constructor(public http: Http,public authService:AuthProvider,private sms: SMS) {
    console.log('Hello GroupsProvider Provider');
  }

  addGroup(creator:string,title:string,description:string,type:string,date:string,fromdate:string,todate:string, contacts:Contact[], target: Contact[]){
    console.log("hey");
    //this.metaGroup = this.metaGroup || [];
    this.metaGroup = new MetaGroup(creator,title,description,type,date,fromdate,todate,contacts,target) ;
    console.log(this.chatGroups);
    const userId = this.authService.getActiveUser().uid;
   // var ref = new Firebase("https://videowishes-acb24.firebaseio.com/GroupsCreated.json");
    //db secret key

    for (let member of contacts) {
      console.log('sms sent to'+JSON.stringify(member));
      //this.sms.send(member.name._objectInstance.phoneNumbers.value);
    }

    const token2 = 'MYi72wQwEqT7iMXJiBTBXUEzaL3Cr2ezKqDwnUIM';
    return this.http
      .post('https://vvish-91286.firebaseio.com/'+ userId + '/Groups/GroupsCreated.json?auth='+token2,this.metaGroup)
      .map((res: Response) => {
        return res.json();
      })
  }

  sendSms(){
    console.log('testing sms');
    console.log('sms '+JSON.stringify(this.metaGroup));
    // for (let contact of members) {
    //   console.log('sms sent to'+JSON.stringify(contact));

    // }
    var options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: '' // send SMS with the native android SMS messaging
        //intent: '' // send SMS without open any other app
        //intent: 'INTENT' // send SMS inside a default SMS app
      }
    };
    // this.sms.send('9255491435','test msg from app',options)
    //   .then(
    //     (data) => {console.log('success'+data)}
    //   ).catch(
    //   (error) =>  {
    //     console.log(error);
    // }
    // );
    //
    // this.sms.send('+15105985154','test msg from app',options)
    //   .then(
    //     (data) => {console.log('success'+data)}
    //   ).catch(
    //   (error) =>  {
    //     console.log(error);
    //   }
    // );


  }
  getGroups(){
    const userId = this.authService.getActiveUser().uid;
    const token2 = 'qCIHRi2DetGLAlao4A2K6pgmUynrViC18lrEHRlf';
   // console.log("heyy "+token);
    console.log(token2);
    return this.http
      .get('https://videowishes-acb24.firebaseio.com/'+ userId + '/Groups/GroupsCreated.json?auth='+token2)
      .map((res: Response) => {
      console.log("response is"+res);
        const chatGroup: MetaGroup[] = res.json() ? res.json() : [];
        console.log('chat group is'+JSON.stringify(chatGroup));
        for (let member of chatGroup) {

          if (!member.hasOwnProperty('members')) {
            member.contacts = [];
          }else {
            console.log('in else');
          }

        }
        return chatGroup;

      })

  .do((chatGroups: MetaGroup[]) => {

      if (chatGroups) {
        this.chatGroups = chatGroups;
        console.log('in do not');

      } else {
        this.chatGroups = [];
      }
    return  this.chatGroups;
    });
   // return  this.chatGroups.slice();
  }

  updateGroup(index : number , creator:string,title: string,description:string, type : string ,date: string,fromdate:string,todate:string, contacts:Contact[],target: Contact[]){
    this.chatGroups[index] =  new MetaGroup(creator,title,description,type,date,fromdate,todate,contacts,target);
  }

  removeGroup(index: number){
    this.chatGroups.splice(index,1);
  }
  fetchGroups(){
    this.chatGroups.slice();
  }

}
