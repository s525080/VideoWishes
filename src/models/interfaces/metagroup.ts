import {Contact} from "@ionic-native/contacts";
export class MetaGroup{

  constructor(public creator:string,public title:string,public description:string,
              public type:string,public date:string,public fromdate:string,public todate:string,public contacts:Contact[],public target:Contact[]){

  }
}
