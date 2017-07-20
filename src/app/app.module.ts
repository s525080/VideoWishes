import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { config } from './app.firebaseconfig';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';

import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import {LoginPage} from "../pages/login/login";
import { HttpModule } from '@angular/http';
import {TabsPage} from "../pages/tabs/tabs";
import {ChatsPage} from "../pages/chats/chats";
import {ProfilePage} from "../pages/profile/profile";
import {GroupsPage} from "../pages/groups/groups";
import { UserProvider } from '../providers/user/user';
import {SignupPage} from "../pages/signup/signup";
import {ProfilepicPage} from "../pages/profilepic/profilepic";
import { ImghandlerProvider } from '../providers/imghandler/imghandler';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import {FriendsPage} from "../pages/friends/friends";
import { RequestsProvider } from '../providers/requests/requests';
import { Camera } from '@ionic-native/camera';
import {ImagePicker} from "@ionic-native/image-picker";
import {LibraryPage} from "../pages/library/library";
import {CalenderPage} from "../pages/calender/calender";
import {WhatsnewPage} from "../pages/whatsnew/whatsnew";
import {WhatshappeningPage} from "../pages/whatshappening/whatshappening";
import {SettingsPage} from "../pages/settings/settings";
import {PopoverPage} from "../pages/popover/popover";
import {StreamingMedia, StreamingVideoOptions} from "@ionic-native/streaming-media";
import {Contact, Contacts} from "@ionic-native/contacts";
import {NewGroupPage} from "../pages/new-group/new-group";
import {ExistingGroupPage} from "../pages/existing-group/existing-group";
import {GroupsService} from "../services/groups";



@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TabsPage,
    ChatsPage,
    ProfilePage,
    GroupsPage,
    ProfilepicPage,
    SignupPage,
    FriendsPage,
    LibraryPage,
    CalenderPage,
    WhatsnewPage,
    WhatshappeningPage,
    SettingsPage,
    PopoverPage,
    ExistingGroupPage,
    NewGroupPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TabsPage,
    ChatsPage,
    ProfilePage,
    GroupsPage,
    ProfilepicPage,
    SignupPage,
    FriendsPage,
    LibraryPage,
    CalenderPage,
    WhatsnewPage,
    WhatshappeningPage,
    SettingsPage,
    PopoverPage,
    ExistingGroupPage,
    NewGroupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    AngularFireAuth,
    AuthProvider,
    UserProvider,
    ImghandlerProvider,
    File,
    FileChooser,
    FilePath,
    RequestsProvider,
    Camera,
    ImagePicker,
    StreamingMedia,
    Contacts,
    Contact,
    GroupsService
  ]
})
export class AppModule {}
