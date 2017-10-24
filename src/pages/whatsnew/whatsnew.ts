import {Component, OnInit} from '@angular/core';
import {
  ActionSheetController, AlertController,
  FabContainer, ModalController, NavController, NavParams, Platform, PopoverController,
  ViewController, Tabs, ToastController, LoadingController
} from 'ionic-angular';
import {ChatsPage} from "../chats/chats";
import {SettingsPage} from "../settings/settings";
import {ProfilePage} from "../profile/profile";
import {Contact, Contacts} from "@ionic-native/contacts";
import {MetaGroup} from "../../models/interfaces/metagroup";
import {ExistingGroupPage} from "../existing-group/existing-group";
import {NewGroupPage} from "../new-group/new-group";
import {PopoverPage} from "../popover/popover";
import {GroupsProvider} from "../../providers/groups/groups";
import {AuthProvider} from "../../providers/auth/auth";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {AddmemberPage} from "../addmember/addmember";
import {WhatshappeningPage} from "../whatshappening/whatshappening";
import firebase from 'firebase';
import {UserProvider} from "../../providers/user/user";
import {MetaContact} from "../../models/interfaces/contact";

/**
 * Generated class for the WhatsnewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-whatsnew',
  templateUrl: 'whatsnew.html',
})
export class WhatsnewPage implements OnInit{

  mode = 'New';
  selectOptions = ['select','Surprise','Memories','Capsule'];
  chatGroupForm : FormGroup;
  grpMembers: string;
  myDate: string;
  contactlist: any[];
  FinalContactList:MetaContact[]=[];
  subContactsList:MetaContact[]=[];
  selectedValue:any;
  token:any;
  // userID:any;
  currentDate = (new Date()).toISOString();
  opts = {
    multiple: true,
    hasPhoneNumber:true,
    fields:  [ 'displayName', 'name' ]
  };
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,
              private groupService: GroupsProvider,
              private actionController: ActionSheetController, private alertCtrl : AlertController,
              private contacts: Contacts,private cnt: Contact, public platform: Platform,
              public authService : AuthProvider,public popoverCtrl: PopoverController,
              private userService:UserProvider,public toastCtrl: ToastController,
              public modalCtrl: ModalController,public loadingCtrl:LoadingController) {

this.contactlist =[];


  }

  ngOnInit(){

    this.mode = this.navParams.get('mode');
    this.initializeForm();


  }


  private initializeForm(){
    this.chatGroupForm = new FormGroup({
      'title' : new FormControl(null,Validators.required),
      'description' : new FormControl(null,Validators.required),
      'type' : new FormControl('select',Validators.required),
      'myDate' : new FormControl(null),
      'fromDate' : new FormControl(null),
      'toDate' : new FormControl(null),
      'members': new FormArray([]),
      'target' : new FormArray([])
    });
  }




  onSubmit(){
    console.log(this.chatGroupForm);
    var value = this.chatGroupForm.value;
    let groupUniqueKey = Math.floor(Math.random()*8+1)+Math.random().toString().slice(2,10);

    let media:string[] =[];
    value['photoUrl'] = '';
    value['videoUrl'] ='';
    value['mediaFiles']= [''];
    value['finalVideo'] = '';
    value['groupMatchKey'] =groupUniqueKey;
    value['role'] = 'Owner';
    value['modifiedDate'] = this.currentDate;
    // let members = [];
    // let target = [];
    // if(value.members.length > 0){
    //   members = value.members.map(name => {
    //     return { name: name , contactNumber : 1 }
    //   })
    //
    // }
    //
    // if(value.target.length > 0){
    //   target = value.target.map(name => {
    //     return { name: name , contactNumber : 1 }
    //   })
    // }

    const creator:any = this.authService.getActiveUser().displayName;
    const owner:any = firebase.auth().currentUser.uid;
    console.log("type is"+value.type);
    // this.groupService.addGroup(owner,creator,value.title,value.description,value.type,value.myDate,value.fromDate,value.toDate,value.members,value.target,
    // value.photoUrl,value.videoUrl,value.mediaFiles,value.finalVideo,value.groupMatchKey)
    this.groupService.addGroup(owner,creator,value.title,value.description,value.type,value.myDate,value.fromDate,value.toDate,value.members,value.target,
      value.photoUrl,value.videoUrl,value.mediaFiles,value.finalVideo,value.groupMatchKey,value.role,value.modifiedDate)
      .subscribe(
        () => {

        },
        error => {
          console.log(error);
        }
      );


    this.chatGroupForm.reset();
    // this.navCtrl.push(HomePage);
    this.navCtrl.setRoot(WhatshappeningPage);

    var t: Tabs = this.navCtrl.parent;
    t.select(3);
   // this.groupService.sendSms();
  }
  OpenModal(){

  }
  onAddNewMembers(){
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.contacts.find([ 'displayName', 'name' ],this.opts).then((contacts) => {
      this.contactlist=contacts;

      let finalContacts = this.contactlist;
      console.log('final contacts list'+JSON.stringify(finalContacts));
      finalContacts.sort();
      console.log('final contacts list after sorting'+JSON.stringify(finalContacts));
      loader.dismiss();
      let contactsModal = this.modalCtrl.create(AddmemberPage,{data:finalContacts});
      contactsModal.onDidDismiss(data => {
        this.subContactsList = data;
        console.log('final contacts list after selecting'+JSON.stringify(this.subContactsList));

        console.log('final contact'+JSON.stringify(this.FinalContactList));
        this.FinalContactList.concat(this.subContactsList);
        console.log('final contacts list is'+JSON.stringify(this.FinalContactList));
        for(let mem in this.subContactsList){
          (<FormArray>this.chatGroupForm.get('members')).push(new FormControl(this.subContactsList[mem]));
        }

        console.log('members are'+JSON.stringify(this.chatGroupForm.get('members')));
      });
      contactsModal.present();


      // this.navCtrl.push(AddmemberPage,{finalContacts});
      //
      //
      //   let finalList = this.navParams.get('finalList');
      // console.log('final contacts list after selecting'+JSON.stringify(finalList));
      // this.FinalContactList.concat(finalList);


    }, (error) => {
      console.log(error);
    })
  }


  onAddMembers(){
    let contact: Contact = this.contacts.create();

    this.contacts.pickContact().then(
      cnt => {
        console.log('contact is:'+cnt.displayName);
        console.log('contact is:'+cnt.phoneNumbers[0].value);
        let updatedNumber:string;
        if(cnt.phoneNumbers[0].value.charAt(0) != '+' ){
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
                    updatedNumber = data.countrycode.toString()+' '+cnt.phoneNumbers[0].value;

                    const toast = this.toastCtrl.create({
                      message: 'updatedNumber is '+updatedNumber,
                      duration: 3000,
                      position: 'bottom'
                    });

                    toast.onDidDismiss(() => {
                      console.log('Dismissed toast');
                    });

                    toast.present();
                    this.updateContact(updatedNumber,cnt.name.formatted)

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
          updatedNumber = cnt.phoneNumbers[0].value;
          this.updateContact(updatedNumber,cnt.name.formatted)
        }


      }
    ).catch(error => {

    })

  }

  updateContact(updatedNumber:string,name:string){
    //let userID:string ='';
    let contactInfo:any;
    this.isUidExists(updatedNumber).then((res)=>{

      if(res == ''){
         contactInfo = {
          'uid':updatedNumber,
          'tel':updatedNumber,
          'displayName':name,
          'photoURL':''
        };
      }else{
         contactInfo = {
          'uid':res,
          'tel':updatedNumber,
          'displayName':name,
          'photoURL':''
        };
      }



      (<FormArray>this.chatGroupForm.get('members')).push(new FormControl(contactInfo));
      console.log(this.chatGroupForm.get('members'));
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
    var promise = new Promise((resolve, reject) => {
      this.userService.getallusersPhone().then((res) => {
        // this.userService.getallusersFromUserGroup().then((res) => {

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

        return userID;
      }).then((res)=>{
        resolve(res);

      }).catch((err) => {
reject(err);
      });
    })

    return promise;
  }

  updateTargetContact(updatedNumber:string,name:string){
    let contactInfo:any = {
      'uid':updatedNumber,
      'tel':updatedNumber,
      'displayName':name,
      'photoURL':''
    };


    (<FormArray>this.chatGroupForm.get('target')).push(new FormControl(contactInfo));

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
  }
  onSelectTarget(){
    let contact: Contact = this.contacts.create();

    this.contacts.pickContact().then(
    cnt => {
      console.log('contact is:'+cnt.displayName);
      console.log('contact is:'+cnt.phoneNumbers[0].value);
      let updatedNumber:string;
      if(cnt.phoneNumbers[0].value.charAt(0) != '+' ){
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
                  updatedNumber = data.countrycode.toString()+' '+cnt.phoneNumbers[0].value;

                  const toast = this.toastCtrl.create({
                    message: 'updatedNumber is '+updatedNumber,
                    duration: 3000,
                    position: 'bottom'
                  });

                  toast.onDidDismiss(() => {
                    console.log('Dismissed toast');
                  });

                  toast.present();
                  this.updateTargetContact(updatedNumber,cnt.name.formatted)

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
        updatedNumber = cnt.phoneNumbers[0].value;
        this.updateTargetContact(updatedNumber,cnt.name.formatted)
      }


    }
    ).catch(error => {

    })

  }

  onEditMembers(i: number){
    const actionSheet = this.actionController.create({
      title: 'Select',
      buttons : [
        {
          text : 'Delete Member',
          role : 'destructive',
          handler : () => {
            const fArray : FormArray = <FormArray>this.chatGroupForm.get('members');
            const len = fArray.length;
            if(len >= 0){
              fArray.removeAt(i);
            }
          }
        },
        {
          text : 'Edit Details',
          handler : () => {

          }
        },
        {
          text: 'Cancel',
          role : 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  onEditTarget(i: number){
    const actionSheet = this.actionController.create({
      title: 'Select',
      buttons : [
        {
          text : 'Delete Member',
          role : 'destructive',
          handler : () => {
            const fArray : FormArray = <FormArray>this.chatGroupForm.get('target');
            const len = fArray.length;
            if(len >= 0){
              fArray.removeAt(i);
            }
          }
        },
        {
          text : 'Edit Details',
          handler : () => {

          }
        },
        {
          text: 'Cancel',
          role : 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  //old code





  // memberGroup: MetaGroup[];
  // constructor(public navCtrl: NavController, public navParams: NavParams,public popoverCtrl: PopoverController,private contacts: Contacts,private cnt: Contact , private mdl: ModalController,
  //             private groupService: GroupsProvider,
  // private authService: AuthProvider) {
  // }
  //
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad WhatsnewPage');
  //   this.groupService.getGroups().subscribe(data => {
  //     console.log('final ' + JSON.stringify(data));
  //     this.memberGroup = data;
  //     console.log('finally'+JSON.stringify(this.memberGroup));
  //
  //   });
  // }
  //
  // ngOnInit(){
  //   // this.groupService.getGroups().subscribe(data => {
  //   //   console.log('final' + data);
  //   //   this.memberGroup = data});
  //
  // }
  //
  // ionViewWillEnter(){
  //   console.log('ion view will enter');
  //   //this.listItems = this.groupService.getGroups();
  //  // const token:any = this.authService.getActiveUser().getIdToken();
  //   //this.memberGroup =
  //
  // this.groupService.getGroups().subscribe(data => {
  //   console.log('final ' + JSON.stringify(data));
  //    this.memberGroup = data;
  //   console.log('finally'+JSON.stringify(this.memberGroup));
  //
  // });
  //
  //   // .subscribe(
  //   //   (list :MetaGroup[]) =>
  //   //   {
  //   //     if(list){
  //   //       this.memberGroup = list;
  //   //     }else{
  //   //       this.memberGroup = [];
  //   //     }
  //   //   },
  //   //   error => {
  //   //     console.log(error);
  //   //   }
  //   // );
  //
  // }
  //
  // onNewGroup(){
  //   this.navCtrl.push(NewGroupPage,{mode: 'New'});
  // }
  //
  // onLoadGroup(member: MetaGroup){
  //   this.navCtrl.push(ExistingGroupPage,{member: member});
  // }


  //fab
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }
  onchat(fab: FabContainer){
    this.navCtrl.push(ChatsPage);
    fab.close();
  }

  onsettings(fab: FabContainer){
    this.navCtrl.push(SettingsPage);
    fab.close();
  }

  onProfile(fab: FabContainer){
    this.navCtrl.push(ProfilePage);
    fab.close();
  }

}
