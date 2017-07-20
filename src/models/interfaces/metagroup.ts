import {Contact} from "@ionic-native/contacts";
export class MetaGroup{

  constructor(public title:string,public description:string, public type:string,public contacts:Contact[]){

  }
}
