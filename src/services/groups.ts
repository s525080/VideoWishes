import {MetaGroup} from "../models/interfaces/metagroup";
import {MetaContact} from "../models/interfaces/contact";
import {Contact,Contacts} from "@ionic-native/contacts";
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFireAuth} from "angularfire2/auth";
import {UserProvider} from "../providers/user/user";
import {AuthProvider} from "../providers/auth/auth";

export class GroupsService{

  private chatGroups: MetaGroup[] =[];
  // private contactGroup: Contact[] = [];






  // addGroup(title:string,description:string,type:string,date:string, contacts:Contact[], target: Contact[]){
  //   console.log("hey");
  //   this.chatGroups.push(new MetaGroup(title,description,type,date,contacts,target));
  //   console.log(this.chatGroups);
  //
  // }

//   addContactsToGroups(contact : Contact[]){
//
//     this.contactGroup.push(...contact);
//
// }


  getGroups(){
    return  this.chatGroups.slice();
  }
  //
  // updateGroup(index : number , title: string,description:string, type : string ,date: string, contacts:Contact[],target: Contact[]){
  //   this.chatGroups[index] =  new MetaGroup(title,description,type,date,contacts,target);
  // }

  removeGroup(index: number){
    this.chatGroups.splice(index,1);
  }

}
