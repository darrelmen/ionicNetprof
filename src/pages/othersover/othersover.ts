import { NavController, ViewController, Events, NavParams, Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { FavoritePage } from '../favorite/favorite';
import { AuthService } from '../../providers/auth-service/auth-service';
import { LogoutPage } from '../logout/logout';
import { ProgressPage } from '../progress/progress';
import { PlaylistPage } from '../playlist/playlist';
import { ContactPage } from '../contact/contact'
import { AboutPage } from '../about/about'
import { Storage } from '@ionic/storage';
@Component({
  templateUrl: 'othersover.html'
})
export class OthersoverPage {
  flag: string
  pages = []
  constructor(
    public auth: AuthService,
    public nav: NavController,
    public viewCtrl: ViewController,
    public event: Events,
    public db: Storage,
    private platform: Platform,
    private navParams: NavParams
  ) {
    this.theme = localStorage.getItem("theme")
    this.flag = localStorage.getItem("cc")
    this.pages = [
      // { title: 'Favorite', component: FavoritePage, icon: 'bookmark' },
      //  { title: 'Playlist', component: PlaylistPage, icon: 'list-box' },
     // { title: 'Progress', component: ProgressPage, icon: 'analytics' },
      {
        title: 'Theme', component: '', icon: 'color-fill',
        sub: [{ subtitle: 'Green', component: 'green-theme' },
        { subtitle: 'Blue', component: 'blue-theme' },
        { subtitle: 'Default', component: 'ionic.theme.default' }]
      },
    //  { title: 'Contact us', component: ContactPage, icon: 'contacts' },

      { title: 'About', component: AboutPage, icon: 'information-circle' },
      { title: 'Logout ' + this.auth.user, component: LogoutPage, icon: 'log-out' }
    ];
    this.checkAvailSpeech(this.flag)
  }


  theme: string
  showLevel1 = null;
  //showLevel2 = null;

  supportedLang =
    {
      android: [
        { code: "ph", desc: "fil-PH" },
        { code: "br", desc: "pt-BR" },
        { code: "kr", desc: "ko-KR" },
        { code: "ru", desc: "ru-RU" },
        { code: "es", desc: "es-ES" },
        { code: "us", desc: "en-US" },
        { code: "jp", desc: "ja-JP" },
        { code: "fr", desc: "fr-FR" },
        { code: "eg", desc: "ar-EG" },
        { code: "ir", desc: "fa-IR" },
        { code: "de", desc: "de-DE" },
        { code: "cn", desc: "cmn-Hans-CN" }
      ],
      ios: [
        { code: "br", desc: "pt-PT" },
        { code: "kr", desc: "ko-KR" },
        { code: "ru", desc: "ru-RU" },
        { code: "es", desc: "es-ES" },
        { code: "us", desc: "en-GB" },
        { code: "jp", desc: "ja-JP" },
        { code: "fr", desc: "fr-FR" },
        { code: "de", desc: "de-DE" }
      ]
    }

  langSpeak = {}
  checkAvailSpeech(lang) {
    if (this.platform.is('ios')) {
      lang = this.supportedLang.ios.filter((obj) => { return obj.code === lang });
    } else {
      lang = this.supportedLang.android.filter((obj) => { return obj.code === lang });
    }
    if (lang.length == 0) {
    } else {

      let langSpeak = {
        title: 'Voice Search', component: '', icon: "globe",
        sub: [{ subtitle: this.navParams.get("siteName"), component: this.flag },
        { subtitle: 'English', component: 'us' }]
      }
      this.pages.splice(2, 0, langSpeak)
    }
  }

  openPage(page) {
    if (page.title == "Theme") {
      // open the sub-menu
    } else if (page.component == 'green-theme' || page.component == 'blue-theme' || page.component == 'ionic.theme.default') {
      this.event.publish('theme:toggle', page.component);
      this.viewCtrl.dismiss()
    } else if (page.component == 'us') {
      localStorage.setItem("spk", "us")
      this.viewCtrl.dismiss()
    } else if (page.component == this.flag) {
      localStorage.setItem("spk", this.flag)
      this.viewCtrl.dismiss()
    } else if (page.icon == 'log-out') {
      let params = {
        site: this.navParams.get("siteName"),
        items: this.navParams.get("items")
      }
      this.nav.push(page.component, { params: params })
      this.viewCtrl.dismiss()
    } else {
      this.nav.push(page.component)
      this.viewCtrl.dismiss()
    }

  }


  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
  };

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

  // for 3 levels
  // toggleLevel2(idx) {
  //   if (this.isLevel2Shown(idx)) {
  //     this.showLevel1 = null;
  //     this.showLevel2 = null;
  //   } else {
  //     this.showLevel1 = idx;
  //     this.showLevel2 = idx;
  //   }
  // };

  // isLevel2Shown(idx) {
  //   return this.showLevel2 === idx;
  // };
}
