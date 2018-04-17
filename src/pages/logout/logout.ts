import { Component } from '@angular/core';
import { NavController,MenuController } from 'ionic-angular';
import {AuthService} from '../../providers/auth-service/auth-service';
import {LoginPage} from '../login/login';

@Component({
  templateUrl: 'logout.html',
})

export class LogoutPage {
  constructor(public auth: AuthService, public nav: NavController,public menu:MenuController) {
   }
  logout() {
    this.auth.logout();
    // needed to clear memory so that side menu will work
    this.menu.enable(false);
    this.nav.setRoot(LoginPage);
    // window.location.reload();
    }
}
