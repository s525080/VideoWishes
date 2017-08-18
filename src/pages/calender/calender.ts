import { Component } from '@angular/core';
import {
  AlertController, FabContainer, ModalController, NavController, NavParams,
  PopoverController
} from 'ionic-angular';
import {ChatsPage} from "../chats/chats";
import {SettingsPage} from "../settings/settings";
import {ProfilePage} from "../profile/profile";
import {PopoverPage} from "../popover/popover";
import * as moment from 'moment';
import {EventModalPage} from "../event-modal/event-modal";
import {Calendar} from "@ionic-native/calendar";
import {  Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the CalenderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-calender',
  templateUrl: 'calender.html',
})
export class CalenderPage {
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  public sendTo: any;
  public subject: string = 'Message from Social Sharing App';
  public message: string = 'Take your app development skills to the next level with Mastering Ionic - the definitive guide';
  public image: string = 'http://masteringionic.com/perch/resources/mastering-ionic-2-cover-1-w320.png';
  public uri: string = 'http://masteringionic.com/products/product-detail/s/mastering-ionic-2-e-book';


  constructor(private maincalendar: Calendar, public navCtrl: NavController, public navParams: NavParams,
              public platform   : Platform,
              private _SHARE    : SocialSharing,public popoverCtrl: PopoverController, private modalCtrl: ModalController, private alertCtrl: AlertController) {
  }

  openCalendar() {
    this.maincalendar.openCalendar(new Date()).then(
      (msg) => {
        console.log(msg);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addNewEvent() {
    this.maincalendar.createEventInteractively("event title");

  }

  addEvent() {
    let modal = this.modalCtrl.create(EventModalPage, {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);

        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }


  ionViewDidLoad() {
  }

  shareViaEmail()
  {
    this.platform.ready()
      .then(() =>
      {
        this._SHARE.canShareViaEmail()
          .then(() =>
          {
            this._SHARE.shareViaEmail(this.message, this.subject, this.sendTo)
              .then((data) =>
              {
                console.log('Shared via Email');
              })
              .catch((err) =>
              {
                console.log('Not able to be shared via Email');
              });
          })
          .catch((err) =>
          {
            console.log('Sharing via Email NOT enabled');
          });
      });
  }



  shareViaFacebook()
  {
    this.platform.ready()
      .then(() =>
      {
        this._SHARE.canShareVia('com.apple.social.facebook', this.message, this.image, this.uri)
          .then((data) =>
          {

            this._SHARE.shareViaFacebookWithPasteMessageHint(this.message, this.image, null,'Message pasted to clip board ,press on the area to paste it in the feed')
              .then((data) =>
              {
                console.log('Shared via Facebook');
              })
              .catch((err) =>
              {
                console.log('Was not shared via Facebook');
              });

          })
          .catch((err) =>
          {
            console.log('Not able to be shared via Facebook');
          });

      });
  }




  shareViaInstagram()
  {
    this.platform.ready()
      .then(() =>
      {

        this._SHARE.shareViaInstagram(this.message, this.image)
          .then((data) =>
          {
            console.log('Shared via shareViaInstagram');
          })
          .catch((err) =>
          {
            console.log('Was not shared via Instagram');
          });

      });
  }



}
