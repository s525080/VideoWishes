import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {UserProvider} from "../../providers/user/user";
import {ProfilepicPage} from "../profilepic/profilepic";
import {FormControl, FormGroup, Validators} from "@angular/forms";



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {

  newuser = {
    email: '',
    tel:'',
    password: '',
    displayName: ''
  }
  newuserForm : FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, public userservice: UserProvider,
              public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    this.initializeForm();
  }

  ngOnInit(){



  }
  private initializeForm(){
    this.newuserForm = new FormGroup({
      'email' : new FormControl(null,Validators.required),
      'code' : new FormControl(null,Validators.compose([ Validators.pattern('[+0-9]{1,4}'), Validators.required])),
      'tel' : new FormControl(null,Validators.compose([ Validators.pattern('[0-9]{10}'), Validators.required])),
      'password' : new FormControl(null,Validators.required),
      'displayName' : new FormControl(null,Validators.required)
    });
  }

  onSubmit(){
    console.log(this.newuserForm);
    const value = this.newuserForm.value;

    var toaster = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });
    if (value.email == '' || value.code == '' || value.tel == '' || value.password == '' || value.displayName == '') {
      toaster.setMessage('All fields are required dude');
      toaster.present();
    }
    else if (value.password.length < 7) {
      toaster.setMessage('Password is not strong. Try giving more than six characters');
      toaster.present();
    }
    else if (value.tel.length < 10) {
      toaster.setMessage('Phone number is incomplete.');
      toaster.present();
    }
    else {

      let loader = this.loadingCtrl.create({
        content: 'Please wait'
      });
      loader.present();
      this.userservice.adduser(value).then((res: any) => {
        loader.dismiss();
        if (res.success)
          this.navCtrl.push(ProfilepicPage);
        else
          alert('Error' + res);
      })
    }
  }
  signup() {
    var toaster = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });
    if (this.newuser.email == '' || this.newuser.tel == '' || this.newuser.password == '' || this.newuser.displayName == '') {
      toaster.setMessage('All fields are required dude');
      toaster.present();
    }
    else if (this.newuser.password.length < 7) {
      toaster.setMessage('Password is not strong. Try giving more than six characters');
      toaster.present();
    }
    else if (this.newuser.tel.length < 10) {
      toaster.setMessage('Phone number is incomplete.');
      toaster.present();
    }
    else {
      let loader = this.loadingCtrl.create({
        content: 'Please wait'
      });
      loader.present();
      this.userservice.adduser(this.newuser).then((res: any) => {
        loader.dismiss();
        if (res.success)
          this.navCtrl.push(ProfilepicPage);
        else
          alert('Error' + res);
      })
    }
  }

  goback() {
    this.navCtrl.setRoot(LoginPage);
  }

}
