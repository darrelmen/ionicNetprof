import { NavController, ViewController, Events, NavParams, Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CommonUtils } from '../../utils/common-utils';

@Component({
  templateUrl: 'playoptionsover.html'
})
export class PlayOptionsOverPage {
  playOptions = []
  constructor(
    public nav: NavController,
    public viewCtrl: ViewController,
    public event: Events,
    public db: Storage,
    private navParams: NavParams,
    private utils: CommonUtils
  ) {
    this.theme = localStorage.getItem("theme")
    this.item=this.navParams.get("item")
    this.item.ctmref
    this.item.ctfref
    let selectedPlayValue=localStorage.getItem("playOption")

    let ctr=0
    if(this.item.mrr!="NO") { 
      this.playOptions.splice(ctr,0,{title:  ' Regular', value: '1',checked:false, icon1: 'male',icon2: 'rabbit'})
      ctr++
    }
    if(this.item.msr!="NO") {
      this.playOptions.splice(ctr,0,{title: 'Slow', value: '2',checked:false, icon1: 'male',icon2: 'turtle'})
      ctr++
    }
    if(this.item.frr!="NO") { 
      this.playOptions.splice(ctr,0,{title: ' Regular', value: '3',checked:false, icon1: 'female',icon2: 'rabbit'})
      ctr++
    }
    if(this.item.fsr!="NO") { 
      this.playOptions.splice(ctr,0,{title: 'Slow', value: '4',checked:false, icon1: 'female',icon2: 'turtle'})
      ctr++
    }
    this.playOptions.forEach((p)=>{
      if (selectedPlayValue==p.value) {
        p.checked=true
      }else {
        p.checked=false
      }
    })
    
  }
  
  theme: string
  item

  selectPlay(play) {
      console.log("option " + play.value) 
      play.checked=true
      this.playOptions.forEach((p)=>{
        if (play.value==p.value) {
          p.checked=true
          localStorage.setItem("playOption",p.value)
        }else {
          p.checked=false
        }
      })
      this.viewCtrl.dismiss()  
  }

  
}
