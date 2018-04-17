import { NavController, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FavoritePage } from '../favorite/favorite';
import { AuthService } from '../../providers/auth-service/auth-service';
import { LogoutPage } from '../logout/logout';
import { PlaylistPage } from '../playlist/playlist';
import {ContactPage} from '../contact/contact'
import {AboutPage} from '../about/about'
@Component({
  templateUrl: 'othersover.html'
})
export class OthersoverPage {
  pages = [
    { title: 'Favorite', component: FavoritePage },
    { title: 'Playlist', component: PlaylistPage },
    { title: 'Contact us', component: ContactPage },
    { title: 'About', component: AboutPage },
    { title: 'Logout ' + this.auth.user, component: LogoutPage }
  ];
  constructor(
    public auth: AuthService,
    public nav: NavController,
    public viewCtrl: ViewController
  ) {

  }

  openPage(page) {
    this.nav.push(page.component)
    this.viewCtrl.dismiss()
  }
}
