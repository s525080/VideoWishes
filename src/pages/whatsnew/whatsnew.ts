import {Component, OnInit} from '@angular/core';
import {
  ActionSheetController, AlertController,
  FabContainer, ModalController, NavController, NavParams, Platform, PopoverController,
  ViewController,Tabs
} from 'ionic-angular';
import {ChatsPage} from "../chats/chats";
import {SettingsPage} from "../settings/settings";
import {ProfilePage} from "../profile/profile";
import {GroupsService} from "../../services/groups";
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
  selectOptions = ['Picnic','Birthday','Anniversary', 'Graduation'];
  chatGroupForm : FormGroup;
  grpMembers: string;
  myDate: string;
  contactlist: any;
  selectedValue:any;
  token:any;
  opts = {
    filter : "M",
    multiple: true,
    hasPhoneNumber:true,
    fields:  [ 'displayName', 'name' ]
  };
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,
              private groupService: GroupsProvider,
              private actionController: ActionSheetController, private alertCtrl : AlertController,
              private contacts: Contacts,private cnt: Contact, public platform: Platform,
              public authService : AuthProvider,public popoverCtrl: PopoverController) {




  }

  ngOnInit(){

    this.mode = this.navParams.get('mode');
    this.initializeForm();


  }

  private initializeForm(){
    this.chatGroupForm = new FormGroup({
      'title' : new FormControl(null,Validators.required),
      'description' : new FormControl(null,Validators.required),
      'type' : new FormControl('Birthday',Validators.required),
      'myDate' : new FormControl(null),
      'fromDate' : new FormControl(null),
      'toDate' : new FormControl(null),
      'members': new FormArray([]),
      'target' : new FormArray([])
    });
  }




  onSubmit(){
    console.log(this.chatGroupForm);
    const value = this.chatGroupForm.value;
    let members = [];
    let target = [];
    if(value.members.length > 0){
      members = value.members.map(name => {
        return { name: name , contactNumber : 1 }
      })

    }

    if(value.target.length > 0){
      target = value.target.map(name => {
        return { name: name , contactNumber : 1 }
      })
    }

    const creator:any = this.authService.getActiveUser().displayName;
    this.groupService.addGroup(creator,value.title,value.description,value.type,value.myDate,value.fromDate,value.toDate,members,target)
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
    t.select(2);
   // this.groupService.sendSms();
  }

  onAddNewMembers(){
    this.contacts.find([ 'displayName', 'name' ],this.opts).then((contacts) => {
      this.contactlist=contacts;
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
      let finalContacts = this.contactlist;
      this.navCtrl.push(AddmemberPage,{finalContacts});

    }, (error) => {
      console.log(error);
    })
  }
  onAddMembers(){
    let contact: Contact = this.contacts.create();

    this.contacts.pickContact().then(
      cnt => {
        console.log('contact is:'+cnt.displayName);
        (<FormArray>this.chatGroupForm.get('members')).push(new FormControl(cnt));
        console.log(this.chatGroupForm.get('members'));
        const newContactAlert = this.alertCtrl.create({
          title: 'contact',
          message : cnt.displayName,
          buttons : [
            {
              text : ' Cancel',
              role : 'cancel'
            }
          ]
        })
        // newContactAlert.present();
      }
    ).catch(error => {

    })

  }

  onSelectTarget(){
    let contact: Contact = this.contacts.create();

    this.contacts.pickContact().then(
      cnt => {
        (<FormArray>this.chatGroupForm.get('target')).push(new FormControl(cnt));


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
