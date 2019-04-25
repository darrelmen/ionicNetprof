import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FormsModule  } from '@angular/forms';
import { CommonModule  } from '@angular/common';
import { HttpClientModule,HttpClient,HttpBackend, HttpXhrBackend } from '@angular/common/http';
//import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from 'ionic-native-http-connection-backend';
//import { RouterModule } from '@angular/router';

import { BrowserModule } from '@angular/platform-browser';
import { MyApp } from './app.component';
import { SearchListPage } from '../pages/searchlist/searchlist';
import { MenuItemsPage } from '../pages/menuitems/menuitems';

import { LogoutPage } from '../pages/logout/logout';
import { FavoritePage } from '../pages/favorite/favorite';
import { LoginPage } from '../pages/login/login';
import { LanguagePage } from '../pages/language/language';

//import {LanguageService} from '../providers/language-service/language-service'
import {AuthService} from '../providers/auth-service/auth-service';
import { DBProvider } from '../providers/db-provider/db-provider';
// used to create fake backend
// import { MockBackend,MockConnection } from '@angular/http/testing';
import { Storage } from '@ionic/storage';
import {OrderByPipe} from '../pages/pipes/orderBy.pipe';
// import { HttpModule,Http} from '@angular/http';
//import { FakeBackendProvider } from '../providers/mock-service/mock-service';

import {HTTP} from "@ionic-native/http"
import {CommonUtils} from '../utils/common-utils'
import {RecordUtils} from '../utils/record-utils'
import { IonicStorageModule } from '@ionic/storage';
//import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { VirtualListModule } from 'angular-virtual-list';

import { RecordPage } from '../pages/record/record';
import { OthersoverPage } from '../pages/othersover/othersover';

import {SortoverPage } from '../pages/sortover/sortover';
import {PlayOptionsOverPage} from '../pages/playoptionsover/playoptionsover'

import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Media } from '@ionic-native/media';
import { Device } from '@ionic-native/device'
import { EmailComposer } from '@ionic-native/email-composer';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { QuizFillPage } from '../pages/quizFill/quizFill';
import { DropQuizPage } from '../pages/dropquiz/dropquiz';
import {DropPage} from '../pages/drop/drop'
import {MixMatchPage} from '../pages/mixmatch/mixmatch'
import {MixMatchGamePage} from '../pages/mixmatchgame/mixmatchgame'

import { QuizTransPage } from '../pages/quizTrans/quizTrans';
import { AutoPlayPage } from '../pages/autoplay/autoplay';
//import { QuizDropDir } from '../pages/quizDrop/quizDrop.directive';

import { FlashCardComponent } from '../components/flash-card/flash-card';

import { ProgressPage } from '../pages/progress/progress';
import { PlaylistPage } from '../pages/playlist/playlist';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import {ContactPage} from '../pages/contact/contact'
import {AboutPage} from '../pages/about/about'
import { MyListPage } from '../pages/mylist/mylist';

import { LongPressModule } from 'ionic-long-press'; 
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TooltipsModule } from 'ionic-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service'
// import { FcmProvider } from '../providers/fcm/fcm';

// import { AngularFireModule } from 'angularfire2';
// import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireAuthModule } from 'angularfire2/auth';

//import {EmailComposer } from '@ionic-native/email-composer';

//import { NativeHttpFallback, NativeHttpModule } from 'ionic-native-http-connection-backend';

//import {FakeBackendProvider} from '../providers/mock-service/mock-service'
//import * as _ from 'lodash';
//import * as requires from 'requires'
//import {sign} from 'jsonwebtoken';

//this require is used only for testing jsonwebtoken
//declare var require
//var jwt = require("jsonwebtoken")
// export function getAuthHttp(http,storage) {
//   return new AuthHttp(new AuthConfig({
//       headerPrefix: '',
//       noJwtError: true,
//       globalHeaders: [{'Accept': 'application/json', 'Content-Type': 'application/json'}],
//       tokenGetter: (() => storage.get('id_token').then((val)=>{return val})),
//   }), http);
// }

// export const firebaseConfig = {
//   apiKey: "AIzaSyAQxcAgZeNXGC6iiPGx68RSXeqUYtGXaL0",
//   authDomain: "edu.dliflc.netProFlite",
//   databaseURL: "https://netprof-fcm.firebaseio.com",
//   storageBucket: "your-domain-name.appspot.com",
//   messagingSenderId: '904871167037-42jhteb3i2cdo9gsj0ffbcrrdvt58v0g.apps.googleusercontent.com'
// };


@NgModule({
  declarations: [
    MyApp,LoginPage,
    SearchListPage,
    LogoutPage,LanguagePage,
    RecordPage,MenuItemsPage,
    OthersoverPage,SortoverPage,PlayOptionsOverPage,MyListPage,
    OrderByPipe,ContactPage,AboutPage,ProgressPage,
    FavoritePage,QuizFillPage,QuizTransPage,AutoPlayPage,DropPage,DropQuizPage,MixMatchPage,MixMatchGamePage,
    FlashCardComponent,PlaylistPage,ProgressBarComponent
  ],
  imports: [FormsModule,CommonModule,BrowserModule, LongPressModule,HttpClientModule, //NativeHttpModule,HttpModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'top'}),VirtualListModule,
    IonicStorageModule.forRoot(),
    TooltipsModule.forRoot(),BrowserAnimationsModule //,NativeHttpModule
    //RouterModule.forRoot([]),
    // AngularFireModule.initializeApp(firebaseConfig),
    // AngularFireDatabaseModule,
    // AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,LoginPage,
    LogoutPage,LanguagePage,
    MenuItemsPage,QuizFillPage,QuizTransPage,
    SearchListPage,RecordPage,MyListPage,
    OthersoverPage,SortoverPage,PlayOptionsOverPage,ContactPage,AboutPage,ProgressPage,
    FavoritePage,PlaylistPage,AutoPlayPage,DropPage,DropQuizPage,MixMatchPage,MixMatchGamePage
  ],
  providers: [StatusBar,Media,File, Device,HTTP, AndroidPermissions,SpeechRecognition,FileTransfer,
     EmailComposer,AuthService,DBProvider,CommonUtils,RecordUtils,CookieService,
    SplashScreen,
    TextToSpeech,
   // {provide: HTTP_INTERCEPTORS,useClass: AuthInterceptor,multi: true},
 //   {provide: HttpBackend, useClass: NativeHttpFallback, deps: [ NativeHttpBackend, HttpXhrBackend]},
  //   {
  //     provide: {
  //     HttpBackend, useClass: NativeHttpFallback,
  //     //useFactory: getAuthHttp,
  //     deps: [HttpClient, Storage, NativeHttpBackend, HttpXhrBackend]
  // },   // {provide: Http, useClass: Http, deps: [NativeHttpFallback, RequestOptions]},
  
  {provide:ErrorHandler, useClass: IonicErrorHandler},
      ] // ,AngularFireDatabase,
   // FcmProvider],
  //,MockBackend,FakeBackendProvider,BaseRequestOptions]
  
})


export class AppModule {}