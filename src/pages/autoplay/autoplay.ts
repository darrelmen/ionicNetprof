import { Component, ViewChild } from '@angular/core';
import { ViewController, Slides, Platform, NavParams, NavController } from 'ionic-angular';
import { CommonUtils } from '../../utils/common-utils'
import { RecordUtils } from '../../utils/record-utils';
//import { RecordUtils } from '../../utils/record-utils'
import { Item } from '../../model/item'
import { TextToSpeech } from '@ionic-native/text-to-speech';

//declare var cordova: any;
/*
  Generated class for the Record page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-autoplay',
  templateUrl: 'autoplay.html'
})


export class AutoPlayPage {
  items: Array<Item> = []
  allItems: Array<Item> = []
  sliceItems: number = 20

  url: string
  item: any
  index: number
  itemLength = 0

  isAutoPlay = true
  isBoth = false
  duration: any = 1500
  @ViewChild("audio") audio;
  @ViewChild('mySlider') slider: Slides;

  constructor(
    public utils: CommonUtils,
    public platform: Platform,
    public navParam: NavParams,
    public nav: NavController,
    public viewCtrl: ViewController,
    public recUtils: RecordUtils,
    private tts: TextToSpeech
  ) {
    this.items = this.navParam.get("items")
    this.url = this.navParam.get("url")
    console.log("url " + this.url)
    this.allItems = this.items

    this.index = 0

    if (this.items.length > 20) {
      if (this.index > 20) {
        this.items = this.items.slice(0, this.index + 1)
        this.sliceItems = this.index

      } else {
        this.items = this.items.slice(0, this.sliceItems)
      }
    }
    this.itemLength = this.items.length
    console.log("total items " + this.items.length)
  }

  ngAfterViewInit() {
    this.slider.initialSlide = this.index
    this.slider.speed = 300
  }

  ionViewDidEnter() {
    this.url = this.navParam.get("url")
    this.startAutoPlay()
  }

  // man(item, id) {
  //   var urlDown: any
  //   if (item.mrr == "") {
  //     this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.fl)
  //   } else {
  //     this.platform.ready().then((read) => {
  //       this.recUtils.createElement(item.id, item)
  //       this.recUtils.downPlay(this.url + "/" + item.mrr)
  //       this.duration = localStorage.getItem("duration")
  //     })
  //   }
  // }

  woman(item, id) {
    if (item.frr == "") {
      //  this.man(item)
      // this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.fl)
    } else {
      this.recUtils.createElement(item.id, item)
     this.recUtils.downPlay(this.url + "/" + item.frr,item,true)
    //this.playDesk(this.url + "/" + item.frr,item,true)
      this.duration = localStorage.getItem("duration")
      
    }
  }


  playDesk(url,item?:any,autoPlay?:boolean) {
    try {
      let audio: HTMLAudioElement
      if (this.platform.is("core")) {
        audio = new Audio(url.replace("https://netprof.ll.mit.edu/netprof", ""));
      } else {
        audio = new Audio(url);
      }
      audio.preload = 'auto'
      audio.play()
      if (audio.ended){
        this.tts.speak({ text: item.en, locale: 'en-US', rate: 1.5 }).then(()=>{
          this.slideNext()
          console.log(" speak english ")})
              
      }
      // var x = document.createElement("AUDIO");
      // console.log("success play " + url.replace("https://netprof.ll.mit.edu/netprof", ""))

      //   x.setAttribute("src",url.replace("https://netprof.ll.mit.edu/netprof", ""));

      //   x.setAttribute("autoplay","true")

    } catch (error) {
      console.log("err play " + error)
    }

  }


  playSlide() {
     if (this.slider) {

        var indx = this.slider.getActiveIndex()
        if (indx > this.itemLength) {
          indx = 1
        } else if (indx == 0) {
          indx = this.itemLength
        }
        // to get the duration during autoplay
        // if (this.isAutoPlay) {
        //   if (this.duration == undefined || this.duration == null) this.duration = 2500
        //   this.slider.autoplay = (parseInt(this.duration) + 1000) * 2
        //   //this.slider.autoplay = 1000
        // }
        console.log("duration 1 "  + this.duration)
        var item: Item = this.items[indx]
        this.woman(item,indx)
       

      }
  }



  startAutoPlay() {
    this.isAutoPlay = true
    this.slider.freeMode = false;
    this.slider.slidesPerColumn=1
    if (this.duration == undefined || this.duration == null) this.duration = 1500
    this.slider.autoplay = parseInt(this.duration) + 1000;
    this.slider.loop = true;
    console.log("duration "  + this.duration)
    //this.slider.slideTo(this.slider.getActiveIndex() + 1)
    
    this.slider.startAutoplay()
  }

  stopAutoPlay() {
    this.isAutoPlay = false
    this.slider.stopAutoplay()
  }
  slideNext() {
    this.isAutoPlay = false
    this.slider.stopAutoplay()
    this.slider.slideNext(300)
  }

  slidePrevious() {
    this.isAutoPlay = false
    this.slider.stopAutoplay()
    this.slider.slidePrev(300)
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  getNextItem() {
    if (this.slider.getActiveIndex() == this.items.length) {
      if (this.allItems.length - this.sliceItems > 20) {
        this.items = this.allItems.slice(0, this.sliceItems + 20)
        this.sliceItems = this.sliceItems + 20
      } else {
        this.items = this.allItems
      }
    }
    let item: any = this.items[this.slider.getActiveIndex()]

    if (this.slider.getActiveIndex() > this.items.length) {
      item = this.items[this.slider.getActiveIndex() - 2]
    } else if (this.items == this.allItems) {
      item = this.items[this.slider.getActiveIndex() - 1]
    }
    console.log("getNextItem")
  }

}