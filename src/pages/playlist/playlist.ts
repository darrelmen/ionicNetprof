import { Component, ViewChild } from '@angular/core';
import { reorderArray, AlertController, NavController, Platform, Events } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { CommonUtils } from '../../utils/common-utils'
import { Storage } from '@ionic/storage';
import { RecordUtils } from '../../utils/record-utils';
import { RecordPage } from '../../pages/record/record';
import { Item } from '../../model/item'
import { Media, MediaObject, MEDIA_STATUS } from '@ionic-native/media'
import { File, FileEntry } from '@ionic-native/file';
//import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';


@Component({
  selector: 'page-playlist',
  templateUrl: 'playlist.html'
})
export class PlaylistPage {

  tracks: Array<Item> = [];
  playing: boolean = true;
  currentTrack: Item = new Item();
  progressInterval: any;
  url: any
  contents: any
  ifPlay = false

  siteName: any
  siteAudio: any
  duration: any=2000
  constructor(
    public utils: CommonUtils,
    public db: Storage,
    public auth: AuthService,
    public recUtils: RecordUtils,
    public platform: Platform,
    public nav: NavController,
    public file: File,
 //   public txfr: FileTransfer,
    private audio: Media
  ) {

    this.db.ready().then(() => {
      this.db.get('url').then(val => {
        this.url = val
        this.siteName = val.split("https://np.ll.mit.edu/npfClassroom", 2);

        this.db.get("latestSiteName").then(site => {
          this.siteName = site

          if (this.platform.is('core') || this.platform.is('mobileweb')
            || this.platform.is('android')) {
            this.siteAudio = this.url.split("https://np.ll.mit.edu", 2);
          } else {
            this.siteAudio = this.url
            console.log("site audio " + this.siteAudio)
          }

          this.getContentsFromDB()
        });
      })
    });
  }

  getContentsFromDB() {
    this.db.ready().then(() => {

      this.db.get(this.siteName + 'Playlist')
        .then((str) => {
          if (str !== null) {
            this.tracks = JSON.parse(str)
          }
          this.currentTrack = this.tracks[0];

        })
        .catch(err => console.error('DB error: ', err));
    });
  }

    // reorderArray
  reorderItems(indexes) {
    this.tracks = reorderArray(this.tracks, indexes);
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

  context(item, id, event) {
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

  man(item, id, event) {
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
      this.recUtils.createElement(id, item)
      item.isPlay = true

    }

  }

  woman(item, id, event) {
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
          this.recUtils.downPlay(this.url + "/" + item.fsr)
          console.log("items count frr " + item.id)
          let index = this.tracks.indexOf(this.currentTrack);
          index >= this.tracks.length - 1 ? index = 0 : index++;
          this.playTrack(this.tracks[index], this.duration);
        } else {
          this.recUtils.downPlay(this.url + "/" + item.frr)
          let index = this.tracks.indexOf(item);
          index >= this.tracks.length - 1  ? index = 0 : index++;
          this.playTrack(this.tracks[index], this.duration);
        }
      }
      console.log("items count " + item.id)
      //this.recUtils.createElement(id,item)
    }

  }

  playTrack(track, duration?) {
   // if (this.duration > 0) {
      // First stop any currently playing tracks
    for (let checkTrack of this.tracks) {
      if (checkTrack.playing) {
        this.pauseTrack(checkTrack);
      }
    }
      console.log("duration " + this.duration)
      track.playing = true;
      this.currentTrack = track;

      // Simulate track playing
      this.progressInterval = setInterval(() => {
      //  track.progress < 100 ? track.progress++ : track.progress = 0;
      //  if (track.progress = 100) {
          this.woman(track, null, null)
          // this.nextTrack()
    //    }
      }, this.duration);
//    }
  }

  

  pauseTrack(track) {
    track.playing = false;
    clearInterval(this.progressInterval);

  }

  nextTrack() {
    let index = this.tracks.indexOf(this.currentTrack);
    index >= this.tracks.length - 1 ? index = 0 : index++;
   this.playTrack(this.tracks[index]);
   clearInterval(this.progressInterval);
  }

  prevTrack() {
    let index = this.tracks.indexOf(this.currentTrack);
    index > 0 ? index-- : index = this.tracks.length - 1;
    this.playTrack(this.tracks[index]);
    clearInterval(this.progressInterval);

  }

  
  isPlaying=false
  async playList() {
  if (this.isPlaying==false) {
    this.isPlaying=true
    await Promise.all(this.tracks.map(async (item) => {
      await this.playTrack(item);
    }));
  } else {
    this.isPlaying=false
    this.pauseTrack(this.currentTrack)
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
    this.db.remove(this.siteName + 'Playlist')
    this.nav.pop()
  }

  presentRecord(item, idx) {
    //let index = this.items.indexOf(item)
    var filterItems: number = 100
    if (this.tracks.length < 100) {
      filterItems = this.tracks.length
    }
    this.nav.push(RecordPage, { item: item, items: this.tracks.slice(0, filterItems), siteName: this.siteName, index: idx, url: this.url });

    //let modal = this.modalCtrl.create(RecordPage, { item: item, items: this.items.slice(0, filterItems), siteName: this.siteName, index: idx });
    //modal.present();
  }

  detail() {
    //this.nav.push(RecordDetailPage)

  }

}