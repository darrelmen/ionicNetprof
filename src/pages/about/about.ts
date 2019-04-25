import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.theme = localStorage.getItem("theme")
  }
theme:string
ispress=false
  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

show(){
  if(this.ispress) {
    this.ispress=false
  }else {
  this.ispress=true
  }
}
}
