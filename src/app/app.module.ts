import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FormsModule  } from '@angular/forms';
import { CommonModule  } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { MyApp } from './app.component';
import { SearchListPage } from '../pages/searchlist/searchlist';
import { MenuItemsPage } from '../pages/menuitems/menuitems';

import { LogoutPage } from '../pages/logout/logout';
import { FavoritePage } from '../pages/favorite/favorite';
import { LoginPage } from '../pages/login/login';
//import {LanguageService} from '../providers/language-service/language-service'
import {AuthService} from '../providers/auth-service/auth-service';
import { DBProvider } from '../providers/db-provider/db-provider';
// used to create fake backend
// import { MockBackend,MockConnection } from '@angular/http/testing';
import { Storage } from '@ionic/storage';
import {OrderByPipe} from '../pages/pipes/orderBy.pipe';
import { HttpModule,Http} from '@angular/http';
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

import { File } from '@ionic-native/file';
import { FileTransfer,  FileTransferObject } from '@ionic-native/file-transfer';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Media } from '@ionic-native/media';
import { Device } from '@ionic-native/device'
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

import { PlaylistPage } from '../pages/playlist/playlist';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import {ContactPage} from '../pages/contact/contact'
import {AboutPage} from '../pages/about/about'
//import { LongPressModule } from 'ionic-long-press'; 

//import {EmailComposer } from '@ionic-native/email-composer';
//import { DragulaService} from 'ng2-dragula/ng2-dragula';

//import { NativeHttpFallback, NativeHttpModule } from 'ionic-native-http-connection-backend';

//import {FakeBackendProvider} from '../providers/mock-service/mock-service'
//import * as _ from 'lodash';
//import * as requires from 'requires'
//import {sign} from 'jsonwebtoken';

//this require is used only for testing jsonwebtoken
//declare var require
//var jwt = require("jsonwebtoken")
export function getAuthHttp(http,storage) {
  return new AuthHttp(new AuthConfig({
      headerPrefix: '',
      noJwtError: true,
      globalHeaders: [{'Accept': 'application/json', 'Content-Type': 'application/json'}],
      tokenGetter: (() => storage.get('id_token').then((val)=>{return val})),
  }), http);
}



@NgModule({
  declarations: [
    MyApp,LoginPage,
    SearchListPage,
    LogoutPage,
    RecordPage,MenuItemsPage,
    OthersoverPage,SortoverPage,
    OrderByPipe,ContactPage,AboutPage,
    FavoritePage,QuizFillPage,QuizTransPage,AutoPlayPage,DropPage,DropQuizPage,MixMatchPage,MixMatchGamePage,
    FlashCardComponent,PlaylistPage,ProgressBarComponent
  ],
  imports: [FormsModule,CommonModule,BrowserModule,HttpModule,  //LongPressModule, //NativeHttpModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'top'}),VirtualListModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,LoginPage,
    LogoutPage,
    MenuItemsPage,QuizFillPage,QuizTransPage,
    SearchListPage,RecordPage,
    OthersoverPage,SortoverPage,ContactPage,AboutPage,
    FavoritePage,PlaylistPage,AutoPlayPage,DropPage,DropQuizPage,MixMatchPage,MixMatchGamePage
  ],
  providers: [StatusBar,Media,FileTransfer,TextToSpeech,FileTransferObject,File, Device,HTTP,  //EmailComposer,
    SplashScreen,{
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http, Storage]
  },   // {provide: Http, useClass: Http, deps: [NativeHttpFallback, RequestOptions]},
    {provide:ErrorHandler, useClass: IonicErrorHandler}
      ,AuthHttp,AuthService,DBProvider,CommonUtils,RecordUtils],
  //,MockBackend,FakeBackendProvider,BaseRequestOptions]
  
})


export class AppModule {}