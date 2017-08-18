import {Component, OnInit} from '@angular/core';
import {
  ActionSheetController, AlertController, IonicPage, NavController, NavParams, Platform,
  ViewController
} from 'ionic-angular';
import { SMS } from '@ionic-native/sms';
import {FormArray, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {GroupsService} from "../../services/groups";
import {Contact, Contacts} from "@ionic-native/contacts";
import {WhatsnewPage} from "../whatsnew/whatsnew";
import {AddmemberPage} from "../addmember/addmember";
import {AuthProvider} from "../../providers/auth/auth";
import {GroupsProvider} from "../../providers/groups/groups";


/**
 * Generated class for the NewGroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-group',
  templateUrl: 'new-group.html',
})
export class NewGroupPage implements OnInit{
  mode = 'New';
  selectOptions = ['Birthday','Anniversary', 'Graduation'];
  chatGroupForm : FormGroup;
  grpMembers: string;
  myDate: string;
  contactlist: any;
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
  public authService : AuthProvider,private sms: SMS) {



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
      'myDate' : new FormControl(null,Validators.required),
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

    // const creator:any = this.authService.getActiveUser().displayName;
    // this.groupService.addGroup(creator,value.title,value.description,value.type,value.myDate,members,target)
    // .subscribe(
    //   () =>{
    //     for (let member of members) {
    //       console.log(member.name._objectInstance.name.formatted);
    //       //this.sms.send(member.name._objectInstance.name.formatted);
    //     }
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );


    this.chatGroupForm.reset();
    // this.navCtrl.push(HomePage);
    this.navCtrl.popTo(WhatsnewPage);
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

  // onCreate(form: NgForm){
  //   console.log(form);
  //   this.groupService.addGroup(form.value.groupName,"","");
  //   form.reset();
  //   this.viewCtrl.dismiss(false);
  // }

}
