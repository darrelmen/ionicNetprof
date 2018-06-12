import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import { NavController, ActionSheetController, AlertController, LoadingController, Platform, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { CommonUtils } from '../../utils/common-utils'
import { Storage } from '@ionic/storage';
import { Sites } from '../../model/sites'
import { SearchListPage } from '../searchlist/searchlist';

@Component({
  templateUrl: 'language.html',
})


export class LanguagePage {
  // to get the '#usr' tag in the login html
  sites: any;
  url: string
  selected_site: any = 'site'
  // signform: any;
  constructor(public auth: AuthService,
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public utils: CommonUtils,
    public db: Storage,
    public platform: Platform,
    private navParam: NavParams
    // public emailComposer: EmailComposer
  ) {
   
  }
  theme: string
  items: any
  callbackLang: any
  // initialization load on startup
  ionViewDidLoad() {
    //this.platform.ready().then(()=>{
    // this.auth.getSitesNative() 
    // } )

    this.platform.ready().then(() => {
      this.db.ready().then(() => {
        this.db.get('sites')
          .then((val) => {
            this.sites = JSON.parse(val)
            this.sites = this.sites.sort(function (a, b) {
              return a.language.localeCompare(b.language)
            })
          })
      })
      this.theme = localStorage.getItem("theme")
      if(this.theme==null) this.theme="primary"
    })
  }

  ionViewWillEnter() {
    this.callbackLang = this.navParam.get("lang")
  }

  goToMain(){
    this.nav.pop()
  }

  getSite(site) {

    this.db.get(site.language)
      .then((val) => {
        if (val == null) {
          this.getOnlineContents(site)
        } else {
          this.platform.ready().then(() => {
            this.db.set("rtl", site.rtl)
            this.db.set("latestSite", site)
            this.db.set("latestSiteName", site.language)
            localStorage.setItem("cc", site.countrycode)
            localStorage.setItem("siteid", site.id)
            this.db.get(site.language).then(items => {
              this.callbackLang(items).then(() => {
                this.nav.popToRoot();
                //this.nav.push(MenuItemsPage)
              }).catch((err) => { console.log(err) })
            })
          })
        }

      })
  }

  getOnlineContents(site) {
    let loading = this.loadingCtrl.create({
      content: 'Loading items for the first time... Please wait...'
    });
    // var siteUrl :any
    loading.present();
    // this.url = this.logform.value.url
    //   let siteName=this.url.split("https://np.ll.mit.edu/",2)
    this.auth.load(site).then(
      //for deployment 
      //this.auth.load(this.logform.value.site).then(

      (items) => {
        this.platform.ready().then(() => {
          this.db.set("latestSite", site)
          this.db.set("latestSiteName", site.language)
          this.db.set("rtl", site.rtl)
          localStorage.setItem("cc", site.countrycode)
          localStorage.setItem("siteid", site.id)
          loading.dismiss();
          // populate the items with new lang
          this.callbackLang(items).then(() => {
            this.nav.popToRoot();
            // this.nav.push(MenuItemsPage)
          }).catch((err) => { console.log(err) })
        })
      },
      (err) => {
        console.log("login err " + err);
      }
    );

  }



}
