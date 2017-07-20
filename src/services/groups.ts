import {MetaGroup} from "../models/interfaces/metagroup";
import {MetaContact} from "../models/interfaces/contact";
import {Contact} from "@ionic-native/contacts";

export class GroupsService{

  private chatGroups: MetaGroup[] =[];
  // private contactGroup: Contact[] = [];


  addGroup(title:string,description:string,type:string, contacts:Contact[]){
    console.log("hey");
    this.chatGroups.push(new MetaGroup(title,description,type,contacts));
    console.log(this.chatGroups);
  }

//   addContactsToGroups(contact : Contact[]){
//
//     this.contactGroup.push(...contact);
//
// }

  getGroups(){
    return  this.chatGroups.slice();
  }

  updateGroup(index : number , title: string,description:string, type : string , contacts:Contact[]){
    this.chatGroups[index] =  new MetaGroup(title,description,type,contacts);
  }

  removeGroup(index: number){
    this.chatGroups.splice(index,1);
  }

}
