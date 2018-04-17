/*
  Generated class for the FavoritePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/



import { Component, ViewChild } from '@angular/core';
import { reorderArray, AlertController, NavController, Platform,Events } from 'ionic-angular';
import { Item } from '../../model/item'
import { AuthService } from '../../providers/auth-service/auth-service';
import { CommonUtils } from '../../utils/common-utils'
import { Storage } from '@ionic/storage';
import { RecordUtils } from '../../utils/record-utils';
import { RecordPage } from '../../pages/record/record';

/*
  Generated class for the SearchListPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  templateUrl: 'favorite.html'
})
export class FavoritePage {
  items: Array<Item> = [];
  contents: any
  ifPlay = false
  url: any

  siteName: any
  siteAudio: any
  //newFile = this.newMedia.create('Users/tamasmarius/Desktop/MyAudioFile.wav')
  @ViewChild('player') audio; //tied to track-detail.html <audio> tag using the local player param-- can be anything

  progress = 0;
  constructor(
    public alertCtrl: AlertController,
    public utils: CommonUtils,
    public nav: NavController,
    public db: Storage,
    public auth: AuthService,
    public recUtils: RecordUtils,
    public platform: Platform
  ) {
    this.db.ready().then(() => {
      this.db.get('url').then(val => {
        this.url = val
        this.siteName = val.split("https://np.ll.mit.edu/npfClassroom", 2); if (this.platform.is('core') || this.platform.is('mobileweb') || this.platform.is('android')) {
          this.siteAudio = this.url.split("https://np.ll.mit.edu", 2);
        } else {
          this.siteAudio = this.url
          console.log("site audio " + this.siteAudio)
        }

        this.getContentsFromDB()
      })
    });
  }

  getContentsFromDB() {
    this.db.ready().then(() => {

      this.db.get(this.siteName[1] + 'Playlist')
        .then((str) => {
          if(str!==null) this.items = JSON.parse(str)
        })
        .catch(err => console.error('DB error: ', err));
    });
  }

  // reorderArray
  reorderItems(indexes) {
    this.items = reorderArray(this.items, indexes);
  }

  changeSpeed(item) {
    if (item.selectedSlow) {
      item.selectedSlow = false
    } else {
      item.selectedSlow = true
    }
  }

  contextItem(item) {
    if (item.selectedCtr) {
      item.selectedCtr = false
    } else {
      item.selectedCtr = true
    }
  }

  context(item,id,event) {
    if (item.ctmref == "NO") {
      this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.ct)
    } else {

      let contx = item.ct
      this.utils.showAlert("", "Context Sentence...", contx.fontcolor("blue") + " (" + item.ctr + ")")
      //if (this.activeItem != item.ctmref) {
      this.platform.ready().then(() => {
        this.recUtils.downPlay(this.url + "/" + item.ctmref)
      })
      //this.newFile = new MediaPlugin(this.url + "/" + item.ctmref)
      //  this.activeItem = item.ctmref
      //}
      //his.audio.nativeElement.src = this.url + "/" + item.ctmref
      //this.audio.nativeElement.play();
    }
  }

  man(item,id,event) {
    if (item.mrr == "") {
      this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.fl)
    } else {

      if (item.selectedCtr == true) {
        if (item.ctmref == "NO") {
          this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.ct)
        } else {
          let contx = item.ct
         // this.utils.showAlert("", "Context Sentence...", contx.fontcolor("blue") + " (" + item.ctr + ")")
          //this.newFile = new MediaPlugin(this.url + "/" + item.ctmref)
          this.platform.ready().then(() => {
            this.recUtils.downPlay(this.url + "/" + item.ctmref)
          })
          //this.audio.nativeElement.src = this.url + "/" + item.ctmref
        }

      } else {
        // if (this.activeItem != item.msr) {
        if (item.selectedSlow) {
          this.platform.ready().then(() => {
            this.recUtils.downPlay(this.url + "/" + item.msr)
          })

        } else {
          this.platform.ready().then(() => {
            this.recUtils.downPlay(this.url + "/" + item.mrr)
          })
        }
        //   this.activeItem = item.msr
        // }
      }
      //this.audio.nativeElement.play();
      this.recUtils.createElement(id,item)
      item.isPlay = true

    }

  }

async woman(item,id,event) {
    if (item.frr == "") {
      this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.fl)
    } else {

      if (item.selectedCtr == true) {
        if (item.ctfref == "NO") {
          this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.ct)
        } else {
          let contx = item.ct
         // this.utils.showAlert("", "Context Sentence...", contx.fontcolor("blue") + " (" + item.ctr + ")")
          this.platform.ready().then(() => {
            this.recUtils.downPlay(this.url + "/" + item.ctfref)
          })
          // this.audio.nativeElement.src = this.url + "/" + item.ctfref
        }
      } else {
        if (item.selectedSlow) {
          this.platform.ready().then(() => {
            this.recUtils.downPlay(this.url + "/" + item.fsr)
          })
        } else {
          let isFinished=this.recUtils.downPlay(this.url + "/" + item.frr)
          if (isFinished)
          console.log("items count frr " + item.id)
          return true
          //this.audio.nativeElement.src = this.url + "/" + item.frr
        }
      }
      console.log("items count " + item.id)
      //this.recUtils.createElement(id,item)
    }
    
  }
  record(item) {
    item.isRecord = true
    // in progress
    //this.newFile = this.newMedia.create('mySiteName/siteName + item.id.wav')
    //this.newFile.startRecord();
    //this.utils.fileSave(this.siteName,"myAudio" + item.id)
  }

  playRecord(item) {
    item.isRecord = false
  }

  clearPlayList() {
    this.db.remove(this.siteName[1] + 'Playlist')
    this.nav.pop()
  }

      
  async playList(){
     await Promise.all(this.items.map(async (item) => {
    let isFinished = this.woman(item,null,null);
     if(isFinished) {  
      setTimeout(() => {
      //this.woman(item,null,null);
          console.log("timeout set")
      }, 1000)}
    console.log("item.id");
  }));

  console.log('after foreach');



  
//       for (let item of this.items) {
//          await this.woman(item,null,null);
//          //await delay(item)
//        }
//        async function delay(item) {
//         return new Promise((resolve, reject) => {
//                 this.woman(item,null,null);
//                 console.log("timezxcxc " )
//         });
// }
       
  }
  

  nextTrack(){

    let index = this.items.indexOf(this.items[0]);
    index >= this.items.length - 1 ? index = 0 : index++;

    this.woman(this.items[index],null,null);

}

  presentRecord(item, idx) {
    //let index = this.items.indexOf(item)
    var filterItems: number = 100
    if (this.items.length < 100) {
      filterItems = this.items.length
    }
    this.nav.push(RecordPage, { item: item, items: this.items.slice(0, filterItems), siteName: this.siteName[1], index: idx, url: this.url });

    //let modal = this.modalCtrl.create(RecordPage, { item: item, items: this.items.slice(0, filterItems), siteName: this.siteName[1], index: idx });
    //modal.present();
  }

  detail() {
    //this.nav.push(RecordDetailPage)

  }

}
