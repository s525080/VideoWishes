import { Component } from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';



import { UserCredentials } from '../../models/interfaces/userCredentials';

import { AuthProvider } from '../../providers/auth/auth';
import {TabsPage} from "../tabs/tabs";
import {SignupPage} from "../signup/signup";
import {PasswordresetPage} from "../passwordreset/passwordreset";
import firebase from 'firebase';
import {FormControl, FormGroup, Validators} from "@angular/forms";

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  LoginForm : FormGroup;

  credentials = {} as UserCredentials;
  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,public navParams: NavParams,
              public authservice: AuthProvider, public alertCtrl: AlertController) {
    this.initializeForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    //this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  private initializeForm(){
    this.LoginForm = new FormGroup({
      'email' : new FormControl(null,Validators.required),
      'password' : new FormControl(null,Validators.required)
    });
  }


  onSubmit(){
    console.log(this.LoginForm);
    const value = this.LoginForm.value;

    this.credentials.email = value.email;
    this.credentials.password = value.password;

    let loader = this.loadingCtrl.create({
      content: 'Signing in..'
    });
    loader.present();
    this.authservice.login(this.credentials).then((res: any) => {
      loader.dismiss();
      if (!res.code)
        this.navCtrl.setRoot(TabsPage);
      else
      {

      }
    }).catch(error => {
      loader.dismiss();
      const alert = this.alertCtrl.create(
        {
          title : 'Login Failed!',
          message: 'Please check your credentials',
          buttons : ['Ok']
        }
      )
      alert.present();
    })
  }

  signin() {
    //this.navCtrl.setRoot(TabsPage);
    let loader = this.loadingCtrl.create({
      content: 'Signing in..'
    });
    loader.present();
    this.authservice.login(this.credentials).then((res: any) => {
      loader.dismiss();
      if (!res.code)
        this.navCtrl.setRoot(TabsPage);
      else
      {

      }
    }).catch(error => {
      loader.dismiss();
      const alert = this.alertCtrl.create(
        {
          title : 'Login Failed!',
          message: 'Please check your credentials',
          buttons : ['Ok']
        }
      )
      alert.present();
    })
  }

  // signIn(phoneNumber: number){
  //   const appVerifier = this.recaptchaVerifier;
  //   const phoneNumberString = "+" + phoneNumber;
  //   firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
  //     .then( confirmationResult => {
  //       // SMS sent. Prompt user to type the code from the message, then sign the
  //       // user in with confirmationResult.confirm(code).
  //       let prompt = this.alertCtrl.create({
  //         title: 'Enter the Confirmation code',
  //         inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
  //         buttons: [
  //           { text: 'Cancel',
  //             handler: data => { console.log('Cancel clicked'); }
  //           },
  //           { text: 'Send',
  //             handler: data => {
  //               confirmationResult.confirm(data.confirmationCode)
  //                 .then(function (result) {
  //                   // User signed in successfully.
  //                   console.log(result.user);
  //                   this.navCtrl.setRoot(TabsPage);
  //                   // ...
  //                 }).catch(function (error) {
  //                 // User couldn't sign in (bad verification code?)
  //                 // ...
  //                 alert(error);
  //               });
  //             }
  //           }
  //         ]
  //       });
  //       prompt.present();
  //     })
  //     .catch(function (error) {
  //       console.error("SMS not sent", error);
  //     });
  //
  // }

  passwordreset() {
    this.navCtrl.push(PasswordresetPage);
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }
}
