import { Component } from '@angular/core';
import { NavController, MenuController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
@Component({
  templateUrl: 'logout.html',
})

export class LogoutPage {
  constructor(public auth: AuthService, public nav: NavController, public menu: MenuController, private db: Storage, private navParams: NavParams) {

    this.theme = localStorage.getItem("theme")
  }

  theme: string
  logout() {
    this.auth.logout();
    let params = this.navParams.get("params")
    // to store updates to the items like caching 
    this.db.set(params.site, params.items)

    // needed to clear memory so that side menu will work
    this.menu.enable(false);
    this.nav.setRoot(LoginPage);
    // window.location.reload();
  }
}
