import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';

@Component({
   template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
 rootPage = LoginPage;


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    //   if (window.indexedDB) {
    //   console.log("I'm in sdfgfdgWKWebView!");
    // } else {
    //   console.log("I'm in UIWebView");
    // }
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
