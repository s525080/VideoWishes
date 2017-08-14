import {Component, ViewChild} from '@angular/core';
import { NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from "../pages/login/login";
import firebase from 'firebase';
import {TabsPage} from "../pages/tabs/tabs";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = LoginPage;
  isAuthenticated = false;
  signinPage = LoginPage;
  tabsPage = TabsPage;
  //private navCtrl: NavController;
  //@ViewChild('content') navCtrl: NavController;
  pages: Array<{title: string, component: any}>;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

     firebase.initializeApp({
       apiKey: "AIzaSyDn55Z3qS79NeL-lzzzMNXxEFLpj0Xss-Y",
       authDomain: "videowishes-acb24.firebaseapp.com",
       databaseURL: "https://videowishes-acb24.firebaseio.com",
       projectId: "videowishes-acb24",
       storageBucket: "videowishes-acb24.appspot.com",
       messagingSenderId: "1097310977315"
     });
    firebase.auth().onAuthStateChanged(user => {
if(user){
  this.isAuthenticated = true;
  this.rootPage = TabsPage;

}else {
  this.isAuthenticated = false;
  this.rootPage = LoginPage;

}
    }

     )
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      splashScreen.hide();

    });
  }


}

