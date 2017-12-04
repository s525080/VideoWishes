import {Contact} from "@ionic-native/contacts";
import {MetaContact} from "./contact";
export class MetaGroup{

  constructor(public owner:string,public creator:string,public title:string,public description:string,
              public type:string,public date:string,public fromdate:string,public todate:string,
              public contacts:MetaContact[],public target:Contact[],
              public photoUrl:string,public videoUrl:string,public mediaFiles:string[],public finalVideo:string,
              public groupMatchKey:string,public role:string,public modifiedDate:string,public place:string){

  }
}
