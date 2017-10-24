import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {MetaGroup} from "../../models/interfaces/metagroup";
import {Contact} from "@ionic-native/contacts";
import {AuthProvider} from "../auth/auth";
import {SMS} from "@ionic-native/sms";
import {UserProvider} from "../user/user";
import firebase from 'firebase';
import {AlertController} from "ionic-angular";
import {MetaContact} from "../../models/interfaces/contact";
/*
  Generated class for the GroupsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GroupsProvider {

  private chatGroups: MetaGroup[] =[];
  private metaGroup : MetaGroup ;
  private groupIDOwner:string;
  firegroup = firebase.database().ref('/groups');

  constructor(public http: Http,public authService:AuthProvider,
              public alertCtrl:AlertController,private sms: SMS,private userService:UserProvider) {
    console.log('Hello GroupsProvider Provider');
  }




  addGroup(owner:string,creator:string,title:string,description:string,type:string,date:string,fromdate:string,todate:string,
           contacts:MetaContact[], target: Contact[], photoUrl:string, videoUrl:string, mediaFiles:string[],
           finalVideo:string,groupMatchKey:string, role:string, modifiedDate:string){
    console.log("hey");
    //this.metaGroup = this.metaGroup || [];
    this.metaGroup = new MetaGroup(owner,creator,title,description,type,date,fromdate,todate,contacts,target,photoUrl,
      videoUrl, mediaFiles,finalVideo,groupMatchKey,role,modifiedDate) ;
    //console.log(this.chatGroups);
    const userId = this.authService.getActiveUser().uid;
   // var ref = new Firebase("https://videowishes-acb24.firebaseio.com/GroupsCreated.json");
    //db secret key

    for (let member of contacts) {
      let activeuser:any ='';
      this.userService.getallusersPhone().then((res) => {
        let userarray:any = res;
        let smsarray:any =[];


        for(let user in userarray){
          console.log("tel is "+userarray[user].code+''+userarray[user].tel)
         //  var userStr = userarray[user].tel;
         //  userStr.replace( /\D+/g, '');
         //
         //  var memStr = member.tel;
         //  //memStr.replace( /\D/g, '');
         // // var value = '675-805-714';
         //  var numberPattern = /\d+/g;
         //  memStr = memStr.match( numberPattern ).join([]);
          var userStr = userarray[user].code + '' + userarray[user].tel;


          var memStr = member.tel;
          // memStr.replace( /\D+/g, '');



          var resultUserSring = userStr.replace(/[^\w]/gi, '');
          var resultingString = memStr.replace(/[^\w]/gi, '');

          console.log(resultingString+'compares with'+resultUserSring);


          if(resultingString == resultUserSring ){
            activeuser = member.tel;
            const newContactAlert = this.alertCtrl.create({
              title: 'new group',
              message :userStr +" and "+memStr+" "+ userarray[user].uid ,
              buttons : [
                {
                  text : ' Cancel',
                  role : 'cancel'
                }
              ]
            })
            //setting uid of member
            member.uid = userarray[user].uid;
            //end
            newContactAlert.present();
            let newmember = userarray[user];
            let memGroup = new MetaGroup(owner,creator,title,description,type,date,fromdate,todate,contacts,target,photoUrl,
              videoUrl, mediaFiles,finalVideo,groupMatchKey,'Participant',modifiedDate) ;
            const token3 = 'MYi72wQwEqT7iMXJiBTBXUEzaL3Cr2ezKqDwnUIM';
            let url = 'https://vvish-91286.firebaseio.com/Groups/'+ userarray[user].uid + '/GroupsCreated.json?auth='+token3;
            console.log('adding group woht url '+url);
            this.http
              .post('https://vvish-91286.firebaseio.com/Groups/'+ userarray[user].uid + '/GroupsCreated.json?auth='+token3,memGroup)
              .map((res: Response) => {

                return res.json();
              }).subscribe((res)=>{
              // const newAlert = this.alertCtrl.create({
              //   title: 'new group',
              //   message :res.json() +" and "+ userarray[user].uid ,
              //   buttons : [
              //     {
              //       text : ' Cancel',
              //       role : 'cancel'
              //     }
              //   ]
              // })
              // newAlert.present();
            });


          }
          else{

            smsarray.push(userarray[user]);
          }
        }
        console.log(member.tel+' active user is '+activeuser);
        if(member.tel != activeuser){
          //
          const token3 = 'MYi72wQwEqT7iMXJiBTBXUEzaL3Cr2ezKqDwnUIM';
          let phoneNum = member.tel;
          console.log(phoneNum);
          let memGroup = new MetaGroup(owner,creator,title,description,type,date,fromdate,todate,contacts,target,photoUrl,
            videoUrl, mediaFiles,finalVideo,groupMatchKey,'Participant',modifiedDate) ;
          this.http
            .post('https://vvish-91286.firebaseio.com/Groups/'+''+ phoneNum + '/GroupsCreated.json?auth='+token3,memGroup)
            .map((res: Response) => {

              return res.json();
            }).subscribe((res)=>{

          });

          //
        }

      }).catch((err)=>{

      });

      console.log('sms sent to'+JSON.stringify(member));
      //this.sms.send(member.name._objectInstance.phoneNumbers.value);
    }
    //this.metaGroup = new MetaGroup(owner,creator,title,description,type,date,fromdate,todate,contacts,target) ;

    const token2 = 'MYi72wQwEqT7iMXJiBTBXUEzaL3Cr2ezKqDwnUIM';
    return this.http
      .post('https://vvish-91286.firebaseio.com/Groups/'+ userId + '/GroupsCreated.json?auth='+token2,this.metaGroup)
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
    const token2 = 'MYi72wQwEqT7iMXJiBTBXUEzaL3Cr2ezKqDwnUIM';
   // console.log("heyy "+token);
    console.log(token2);
    return this.http
      .get('https://vvish-91286.firebaseio.com/Groups/'+ userId + '/GroupsCreated.json?auth='+token2)
      .map((res: Response) => {
      console.log("response is"+res);
        const chatGroup: MetaGroup[] = res.json() ? res.json() : [];
        console.log('chat group is'+JSON.stringify(chatGroup));
        for (let member of chatGroup) {

          if (!member.hasOwnProperty('members'))
          {
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

  getAllGroupUsers(){
    let firedata = firebase.database().ref('/Groups');
    var promise = new Promise((resolve, reject) => {
      firedata.once('value', (snapshot) => {
        let userdata = snapshot.val();
        console.log(userdata);
        let temparr = [];
        for (let user in userdata) {
          // console.log(user);
          temparr.push(user);
        }
        console.log('temp array is' +temparr);
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  updateGroup(currentUser:string,groupId:string ,groupMatchKey:string,owner: string,photoUrl:string, videoUrl:string, mediaFiles:string[],finalVideo:string,key:string){

    let alert = this.alertCtrl.create({
      title: 'Photo has been uploaded',
      subTitle: 'photo url is'+photoUrl+" "+groupId,
      buttons: ['OK']
    });
    alert.present();
    let currentDate = (new Date()).toISOString();
    const token2 = 'MYi72wQwEqT7iMXJiBTBXUEzaL3Cr2ezKqDwnUIM';
    let body = {
      'photoUrl':photoUrl,
      'videoUrl':videoUrl,
      'mediaFiles':mediaFiles,
      'finalVideo':finalVideo,
      'modifiedDate':currentDate
    }
    this.getOwnerGroupId(owner,groupMatchKey);

    let alert2 = this.alertCtrl.create({
      title: 'owner group is',
      subTitle: 'photo url is'+this.groupIDOwner,
      buttons: ['OK']
    });
    alert2.present();
    // let media: string[] = [];
    // media.push(photoUrl);
    // media.push(videoUrl);

    if(key =='p' && photoUrl!=''){
      mediaFiles.push(photoUrl);
    }
    if(key=='v' && videoUrl!='' ){
      mediaFiles.push(videoUrl);
    }
    //mediaFiles.push(photoUrl);
    let ownerBody = {
      'mediaFiles':mediaFiles,
    }

    // let alert4 = this.alertCtrl.create({
    //   title: 'owner body is',
    //   subTitle: 'photo url is'+JSON.stringify(ownerBody),
    //   buttons: ['OK']
    // });
    // alert4.present();

    return this.http
      .patch('https://vvish-91286.firebaseio.com/Groups/'+ currentUser + '/GroupsCreated/'+groupId+'.json?auth='+token2,body)
      .map((res: Response) => {
        // let alert3 = this.alertCtrl.create({
        //   title: 'success ',
        //   subTitle: 'media ',
        //   buttons: ['OK']
        // });
        // alert3.present();
         this.http
          .patch('https://vvish-91286.firebaseio.com/Groups/'+ owner + '/GroupsCreated/'+this.groupIDOwner+'.json?auth='+token2,ownerBody)
          .map((res: Response) => {

            // let alert2 = this.alertCtrl.create({
            //   title: 'owner success ',
            //   subTitle: 'media ',
            //   buttons: ['OK']
            // });
            // alert2.present();

            return res.json();
          }).subscribe((res:any)=>{

         })
        return res.json();
      })



   // let newGroup =  new MetaGroup(owner,creator,title,description,type,date,fromdate,todate,contacts,target,photoUrl, videoUrl, mediaFiles);


  }

  getOwnerGroupId(owner:string,groupMatchKey:string){

    const token2 = 'MYi72wQwEqT7iMXJiBTBXUEzaL3Cr2ezKqDwnUIM';
     console.log("heyy "+owner);
     let groupID:any;
      this.http
      .get('https://vvish-91286.firebaseio.com/Groups/'+owner+'/GroupsCreated.json?auth='+token2)
      .map((res: Response) => {
        console.log("response is"+res);
        let chatGroup: MetaGroup[] = res.json() ? res.json() : [];
       // console.log('chat group is'+JSON.stringify(chatGroup));
        for (let member  in chatGroup) {
      //console.log("member is "+JSON.stringify(chatGroup[member]));
     // console.log(JSON.stringify(member));
          if (chatGroup[member].owner == owner && chatGroup[member].groupMatchKey == groupMatchKey)
          {
            groupID = member;
            this.groupIDOwner = member;
            console.log('member is '+groupID);
            return this.groupIDOwner;
          }else {
            console.log('in else');
          }

        }

      }).subscribe((res:any)=>{
       console.log('success')
       //console.log('success' +res.json());

     })

return this.groupIDOwner;
  }

  // updateGroup2(index : number , owner:string, creator:string,title: string,description:string, type : string ,date: string,fromdate:string,todate:string, contacts:Contact[],target: Contact[],photoUrl:string, videoUrl:string, mediaFiles:string[]){
  //   this.chatGroups[index] =  new MetaGroup(owner,creator,title,description,type,date,fromdate,todate,contacts,target,photoUrl, videoUrl, mediaFiles);
  // }
  removeGroup(index: number){
    this.chatGroups.splice(index,1);
  }
  fetchGroups(){
    this.chatGroups.slice();
  }

}
