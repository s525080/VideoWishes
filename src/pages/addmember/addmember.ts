import { Component } from '@angular/core';
import {
  ActionSheetController, AlertController, NavController, NavParams, PopoverController,
  ToastController, ViewController
} from 'ionic-angular';
import {WhatsnewPage} from "../whatsnew/whatsnew";
import {MetaContact} from "../../models/interfaces/contact";
import {Contact, Contacts} from "@ionic-native/contacts";
import {AuthProvider} from "../../providers/auth/auth";
import {UserProvider} from "../../providers/user/user";

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
  finalContactList:MetaContact[]=[];
  private searchFriend: any;
  filteredusers = [];
  temporaryList =[];
  temparr=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private actionController: ActionSheetController, private alertCtrl : AlertController,
              private contacts: Contacts,private cnt: Contact,
              public authService : AuthProvider,public popoverCtrl: PopoverController,
              private userService:UserProvider,public toastCtrl: ToastController,
              public viewCtrl:ViewController) {
    this.newGroupList =[];
  }

  ionViewDidLoad() {
  //this.searchFriend = '';
  this.contactlist = this.navParams.get('data');
    this.contactlist.sort(function(a,b) {
      if ( a.name.formatted < b.name.formatted )
        return -1;
      if ( a.name.formatted > b.name.formatted )
        return 1;
      return 0;
    } );

    this.temparr = this.contactlist;
    console.log(this.contactlist);


  }

  initializeItems(): void {
    this.contactlist = this.navParams.get('data');
  }

  searchuser(searchbar) {
    this.initializeItems();
   // this.filteredusers = this.temparr;
    var q = searchbar.target.value;
    console.log('value is'+q);
    if (!q) {
      console.log('exitting wtith'+q.trim());
      return;
    }

    this.contactlist = this.contactlist.filter((v) => {
      //console.log('value is'+v.name.formatted);
      if (v.name.formatted.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }


  updateGroup(friend:any){
    console.log('friend is'+JSON.stringify(friend));
      let templist:any = this.finalContactList;
      console.log("initial length is"+this.finalContactList.length);
      if(this.finalContactList.length >0){
        console.log('in length loop');
        for(let member in this.finalContactList){
          console.log('member is'+member);
          console.log('member data is'+JSON.stringify(this.finalContactList[member]));
          console.log('start');
          let telone;
          let teltwo
          let contactlist = (this.finalContactList[member].tel).replace(/[^\w]/gi, '');
          console.log('contact list'+contactlist);

          if(friend.phoneNumbers.length>0)
          {
             telone = (friend.phoneNumbers[0].value).replace(/[^\w]/gi, '');
            console.log('contact list'+telone);
          }
          console.log('phone length is'+friend.phoneNumbers.length);
          if(friend.phoneNumbers.length>1){
             teltwo = (friend.phoneNumbers[1].value).replace(/[^\w]/gi, '');
            console.log('contact list'+teltwo);
          }

          console.log(' contact lis is'+contactlist+' tel one is'+telone+' tel two is'+teltwo);
          if(contactlist== telone || contactlist == teltwo){
            (this.finalContactList).splice(parseInt(member));
            console.log('member removed');
            return;
          }

        }

      }
      console.log('starting to list');
    // for(let member in templist){
    //   if(templist[member].tel == friend.phoneNumbers[0].value || templist[member].tel == friend.phoneNumbers[1].value){
    //     templist.splice(member);
    //     console.log('in splice'+member);
    //   }else{
    //
    //   }
    // }'


    // if(templist != null){
    //   console.log('true');
    //   for(let member in templist){
    //     if(templist[member].tel == friend.phoneNumbers[0].value || templist[member].tel == friend.phoneNumbers[1].value){
    //       //templist.splice(member);
    //       console.log('in splice'+member);
    //     }
    //   }
    // }

        console.log('friend is'+JSON.stringify(friend.name.formatted));
        console.log('phone is'+JSON.stringify(friend.phoneNumbers));
        let cont:any =0;
        for(let num in friend.phoneNumbers){
          cont+=1;
        }
        // console.log('length is');
        // console.log('length is'+cont);
        // console.log('length is'+JSON.stringify(friend.phoneNumbers.length()));
        //console.log('length is'+friend.phoneNumbers.value.length());
        if(cont>0){
          console.log('inside loop');
          console.log('num is'+friend.phoneNumbers[0].value);
          if(cont == 1){
            let updatedNumber:string;
            if(friend.phoneNumbers[0].value.charAt(0) != '+' ){
              const alert = this.alertCtrl.create({
                title: 'Missing Country Code',
                inputs: [
                  {
                    name: 'countrycode',
                    placeholder: 'Enter Country Code',
                    type:'text'

                  }
                ],
                buttons: [

                  {
                    text: 'Save',
                    handler: data => {
                      if (data.countrycode != '') {
                        // logged in!
                        updatedNumber = data.countrycode.toString()+' '+friend.phoneNumbers[0].value;

                        const toast = this.toastCtrl.create({
                          message: 'updatedNumber is '+updatedNumber,
                          duration: 3000,
                          position: 'bottom'
                        });

                        toast.onDidDismiss(() => {
                          console.log('Dismissed toast');
                        });

                        toast.present();
                        console.log('about to update'+updatedNumber);
                        this.updateContact(updatedNumber,friend.name.formatted)

                      } else {
                        const toast = this.toastCtrl.create({
                          message: 'Please enter Country Code',
                          duration: 3000,
                          position: 'bottom'
                        });

                        toast.onDidDismiss(() => {
                          console.log('Dismissed toast');
                        });

                        toast.present();

                        // invalid login
                        return false;
                      }
                    }
                  }
                ]
              });
              alert.present();
            }else {
              updatedNumber = friend.phoneNumbers[0].value;
              console.log('about to update'+updatedNumber);
              this.updateContact(updatedNumber,friend.name.formatted)
            }

          }else{
            let count = cont;
            let alert = this.alertCtrl.create();
            alert.setTitle('Please choose a phone number');

            alert.addInput({
              type: 'radio',
              label: friend.phoneNumbers[0].value,
              value: friend.phoneNumbers[0].value,
              checked: false
            });

            alert.addInput({
              type: 'radio',
              label: friend.phoneNumbers[1].value,
              value: friend.phoneNumbers[1].value,
              checked: false
            });
            alert.addButton({
              text: 'Save',
              handler: data => {
                console.log('radio data:', data);

                let updatedNumber:string;
                let selectedNumber = data;

                if(selectedNumber.charAt(0) != '+' ){
                  const alert = this.alertCtrl.create({
                    title: 'Missing Country Code',
                    inputs: [
                      {
                        name: 'countrycode',
                        placeholder: 'Enter Country Code',
                        type:'text'

                      }
                    ],
                    buttons: [

                      {
                        text: 'Save',
                        handler: data => {
                          if (data.countrycode != '') {
                            // logged in!
                            updatedNumber = data.countrycode.toString()+' '+selectedNumber;

                            const toast = this.toastCtrl.create({
                              message: 'updatedNumber is '+updatedNumber,
                              duration: 3000,
                              position: 'bottom'
                            });

                            toast.onDidDismiss(() => {
                              console.log('Dismissed toast');
                            });

                            toast.present();
                            console.log('about to update'+updatedNumber);
                            this.updateContact(updatedNumber,friend.name.formatted)

                          } else {
                            const toast = this.toastCtrl.create({
                              message: 'Please enter Country Code',
                              duration: 3000,
                              position: 'bottom'
                            });

                            toast.onDidDismiss(() => {
                              console.log('Dismissed toast');
                            });

                            toast.present();

                            // invalid login
                            return false;
                          }
                        }
                      }
                    ]
                  });
                  alert.present();
                }else {
                  updatedNumber = selectedNumber;
                  console.log('about to update'+updatedNumber);
                  this.updateContact(updatedNumber,friend.name.formatted)
                }

              }
            });
            alert.present();

          }
        }



    //this.newGroupList.push(friend);

   // console.log('friend is'+JSON.stringify(friend));
  }


  updateContact(updatedNumber:string,name:string){
    //let userID:string ='';
    let contactInfo:MetaContact;
    this.isUidExists(updatedNumber).then((res:any)=>{

     console.log('exists'+JSON.stringify(res));
      if((res.uid)!=''){
        contactInfo = {
          'uid':res.uid,
          'tel':updatedNumber,
          'displayName':res.name,
          'photoUrl':'',
          videoUrl:'',
          mediaFiles:['']
        };
      }else{
        contactInfo = {
          'uid':updatedNumber,
          'tel':updatedNumber,
          'displayName':name,
          'photoUrl':'',
          videoUrl:'',
          mediaFiles:['']
        };
      }

      const newContactAlert = this.alertCtrl.create({
        title: 'contact',
        message : JSON.stringify(contactInfo),
        buttons : [
          {
            text : ' Cancel',
            role : 'cancel'
          }
        ]
      })
      newContactAlert.present();

      // (<FormArray>this.chatGroupForm.get('members')).push(new FormControl(contactInfo));
      // console.log(this.chatGroupForm.get('members'));
      this.finalContactList.push(contactInfo);


    }).catch((err)=>{
      const newContactAlert = this.alertCtrl.create({
        title: 'error',
        message : "error"+err,
        buttons : [
          {
            text : ' Cancel',
            role : 'cancel'
          }
        ]
      })
      newContactAlert.present();

    });




  }

  isUidExists(updatedNumber:string){
    let userID:string ='';
    let name:string ='';
    var promise = new Promise((resolve, reject) => {
      this.userService.getallusersPhone().then((res) => {
        // this.userService.getallusersFromUserGroup().then((res) => {
        let body:any;
        let userarray: any = res;
        let smsarray: any = [];

        for (let user in userarray) {
          console.log("tel is " + userarray[user].tel)
          var userStr = userarray[user].code + '' + userarray[user].tel;


          var memStr = updatedNumber;
          // memStr.replace( /\D+/g, '');


          //memStr.replace( /\D/g, '');
          // var value = '675-805-714';
          var numberPattern = /\d+/g;
          //memStr = memStr.match(numberPattern).join();
          // userStr = userStr.match(numberPattern).join();
          //memStr.replace(/(?!\w)./g, '');
          var resultUserSring = userStr.replace(/[^\w]/gi, '');
          var resultingString = memStr.replace(/[^\w]/gi, '');


          if (resultUserSring == resultingString) {


            //setting uid of member
            userID = userarray[user].uid;
            name = userarray[user].displayName;
            const newContactAlert = this.alertCtrl.create({
              title: 'new group',
              message: userStr + " and " + resultingString + " finally " + userID,
              buttons: [
                {
                  text: ' Cancel',
                  role: 'cancel'
                }
              ]
            })
            newContactAlert.present();
            //end



          }


        }
        if(userID != ''){
          body ={
            'uid' : userID,
            'name': name
          }
        }else{
          body ={
            'uid' : '',
            'name': ''
          }
        }
       console.log('body is'+JSON.stringify(body));
        return body;
      }).then((res)=>{
        console.log('res is'+res);
        resolve(res);

      }).catch((err) => {
        reject(err);
      });
    })

    return promise;
  }

  done(){
    let finalList = this.finalContactList;
    console.log('final list is'+JSON.stringify(finalList));
   // this.navCtrl.push(WhatsnewPage,{finalList:finalList});
      this.viewCtrl.dismiss(finalList);
  }
}
