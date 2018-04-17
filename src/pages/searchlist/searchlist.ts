import { Component, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms'
import {
  NavController, reorderArray, AlertController, Platform,
  ModalController, PopoverController, ViewController,
  Events
} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';
//import {Content} from '../../model/content'
import { Item } from '../../model/item'
//import { Contents } from '../../model/contents'
//import { Child } from '../../model/child'
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';

import { CommonUtils } from '../../utils/common-utils';
import { RecordUtils } from '../../utils/record-utils';

import { RecordPage } from '../../pages/record/record';
import { OthersoverPage } from '../../pages/othersover/othersover';

import { SortoverPage } from '../../pages/sortover/sortover';
import { AutoPlayPage } from '../../pages/autoplay/autoplay';

import 'rxjs/add/operator/debounceTime';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

//import { VirtualScrollModule, VirtualScrollComponent } from 'angular2-virtual-scroll';

import { VirtualListComponent } from 'angular-virtual-list';
//import { MenuController } from 'ionic-angular';


//import * as _ from 'lodash';
/*
  Generated class for the SearchListPage page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


@Component({
  templateUrl: 'searchlist.html'
})


export class SearchListPage implements OnInit {
  public jwtHelper: JwtHelper = new JwtHelper();

  //loginVal = this.params.get('logVals')
  username: string
  public url: string
  rtl: string
  searchQuery: string = ''
  items: Array<Item> = []
  allItems: Array<Item> = []
  playlists: Array<Item> = []
  tempPlaylists: Array<Item> = []

  //content = this.params.get('contents')
  public content: any;
  ifPlay = false
  ifActive = true
  siteName: any
  siteAudio: any
  activeItem: any = ''
  lesson: Array<{
    type: string
    name: string
    count: number
  }> = []
  sublesson: Array<{
    type: string
    name: string
    count: number
    lesson?: {
      type: any
      name: any
    }
  }> = []


  scrollItems: Array<Item> = [];
  filteredList: Array<Item> = [];
  items$ = new BehaviorSubject<Array<Item>>(null);

  @ViewChild(VirtualListComponent)
  private virtualList: VirtualListComponent;

  progress = 0;
  slow = false
  isPressed = false
  isContext = false
  sortOrder = 'A'
  opts = "search"
  isViewAll = true
  indices?: any

  lastCorrect: any
  lastIncorrect: any
  noRecording: any
  lessonItems = []

  //public newFile: MediaPlugin = null
  public recordPage: RecordPage
  searchTerm: string = ''
  user: string;
  searchControl: FormControl
  constructor(
    public nav: NavController,
    public auth: AuthService,
    public alertCtrl: AlertController,
    public db: Storage,
    public utils: CommonUtils,
    public recUtils: RecordUtils,
    public platform: Platform,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public events: Events
  ) {

  }

  // Apparently, on entering into the page view the sequence is:
  // 1)ionViewCanEnter
  // 2)ionViewDidLoad
  // 3)ionViewWillEnter
  // 4)ionViewDidEnter

  // On exit from page view the sequence is:
  // 1)ionViewWillLeave
  // 2)ionViewDidLeave


  ngOnInit() {
    this.db.ready().then(() => {
      this.db.get('url').then(val => {
        this.url = val
        // this.siteName = val.split("https://np.ll.mit.edu/npfClassroom", 2);

        //to use proxy or not || this.platform.is('android') --add this for android emulator livereload
        if (this.platform.is('core') || this.platform.is('mobileweb') || this.platform.is('android')) {
          this.siteAudio = this.url.split("https://np.ll.mit.edu", 2);
        } else {
          this.siteAudio = this.url
          console.log("site audio " + this.siteAudio)
        }
        this.db.get("latestSiteName").then(site => {
          this.siteName = site

          this.db.get(site).then((items) => {
            this.allItems = items
            this.items = items

            this.db.get(this.siteName + 'Playlist').then(str => {
              if (str != null) { this.playlists = JSON.parse(str) }
            })
            this.indices = { "start": 0, "end": 6 }

            //this is needed to be able to display initial data
            this.items$.next(this.items)
          })
          this.db.get(site + "lesson").then((lesson) => this.lesson = lesson)
          this.db.get(site + "sublesson").then((sublesson) => {
            this.sublesson = sublesson
            this.filterItems()
          })
          
        });
      })
      this.db.get('username').then(val => this.username = val)
      this.db.get('rtl').then(val => {
        if (val) this.rtl = 'rtl'
        //      this.changeLanguage()
      })
      this.db.get(this.siteName + 'Playlist').then(str => {
        if (str != null) { this.playlists = JSON.parse(str) }
      })
    })
    this.searchControl = new FormControl()
  }
  filterItems() {
    //this.menuCtrl.open();
    let params = { lessons: this.lesson, sublessons: this.sublesson, items: this.allItems, siteName: this.siteName + " - (" + this.allItems.length + ")" ,isViewAll:false}
    this.events.publish('params:callback', params, this.filterCallbackFunction);
  }

  //only being called after selecting from the menu
  filterCallbackFunction = (params) => {
    return new Promise((resolve, reject) => {
      this.params = params;
      this.lastCorrect = this.params.lastCorrect
      this.lastIncorrect = this.params.lastIncorrect
      this.noRecording = this.params.noRecording;
      this.items = this.params.items
      this.items$.next(this.items)
      //to be used for display of footerfilteri
      this.lessonItems = this.params.items
      this.isViewAll = this.params.isViewAll
      resolve();
    });
  }
  focusOnAnItem() {
    this.virtualList.scrollInto(this.items[1]);
  }

  itemHeader(record, recordIndex, records) {
    if (recordIndex === 0) {
      return record.lesson;
    } else {
      let recComp = recordIndex + 1
      if (recComp < records.length) {
        if (record.lesson != records[recComp].lesson) {
          if (record.sublesson != records[recComp].sublesson) {
            return record.sublesson
          }
          return record.lesson;
        }
      }
    }
    return null;
  }

  changeLanguage() {
    if (this.rtl) {
      this.platform.setDir('rtl', true);
      //this.translate.setDefaultLang(languageId);
    } else {
      this.platform.setDir('ltr', true);
      //this.translate.setDefaultLang(languageId);
    }
  }

  ionViewCanEnter() {
    this.auth.authenticated()
    
  }

  ionViewDidLoad() {
    
    this.getSearchItems();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.shouldShowCancel = true
      this.getSearchItems();
    });

  }


  searching: any

  showSearch() {
    this.opts = "search"
  }

  onSearchInput() {
    this.searching = true;
  }
  // for filtering search
  shouldShowCancel = false
  onCancel() {
    this.shouldShowCancel = false
    this.searchTerm = ""
    this.isViewAll = true
    this.items = this.allItems
  }

  showAll() {
    this.items = this.allItems
    this.items$.next(this.items)
    this.virtualList.refreshList()
    this.searchTerm = ""
    this.isViewAll = true
  }

  getSearchItems() {
    //if (this.searching) {
    console.log("search text " + this.searchTerm)
    this.items.length == this.allItems.length ? this.isViewAll = true : this.isViewAll = false
    this.items = this.items.filter((item) => {
      return (item.searchTopic.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)

    })
    this.lastCorrect = 0
    this.lastIncorrect = 0
    this.noRecording = 0
    this.lessonItems = this.items
    this.items$.next(this.items);
    this.virtualList.refreshList()
  }

  getSearchRecordings(searchRecord) {
    this.items = this.lessonItems
    if (searchRecord == 'correct' && this.lastCorrect > 0) {
      this.items = this.items.filter((item) => {
        // how to get the last element of an array
        return (item.h[item.h.length - 1] == "Y")
      })
    } else if (searchRecord == 'inCorrect' && this.lastIncorrect > 0) {
      this.items = this.items.filter((item) => {
        return (item.h[item.h.length - 1] == "N")
      })
    } else if (searchRecord == 'noRecord' && this.noRecording < this.lessonItems.length) {
      this.items = this.items.filter((item) => {
        return (item.h.length == 0)
      })
    }
    this.items$.next(this.items)
  }
  // reorderArray
  reorderItems(indexes) {
    this.items = reorderArray(this.items, indexes);
  }


  showOthersPopover(event) {
    let popover = this.popoverCtrl.create(OthersoverPage);
    popover.present({
      ev: event
    });
    //dismiss is done on the popover
  }

  sortTitle: any
  showSortByPopover(myEvent, sortOrder) {
    let sortType = ["English", this.siteName, "Scored"]
    let popover = this.popoverCtrl.create(SortoverPage, { sortOrder: sortOrder, types: sortType, items: this.items });
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(data => {
      if (data != null) {
        this.items = data[0]  //items
        this.items$.next(this.items)
        this.sortOrder = data[1]  //sortOrder
        this.sortTitle = data[2]  // sortTitle
        console.log("total lesson items " + this.items.length)
        this.virtualList.refreshList()
      }
    })
  }

  changeSpeed(item, id, event) {
    if (item.selectedSlow) {
      item.selectedSlow = false
    } else {
      item.selectedSlow = true
    }
    this.man(item, id, event)
  }

  contextItem(item, id, event) {
    if (item.selectedCtr) {
      item.selectedCtr = false
    } else {
      item.selectedCtr = true
      this.context(item, id, event)
    }
  }

  context(item, id, event?) {
    if (item.ctmref == "NO") {
      this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.ct)
    } else {
      this.platform.ready().then(() => {
        this.recUtils.downPlay(this.url + "/" + item.ctmref)
      })
    }
    this.recUtils.createElement(id, item)

  }

  man(item, id, event?) {
    if (item.mrr == "") {
      this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.fl)
    } else {

      if (item.selectedCtr == true) {
        if (item.ctmref == "NO") {
          this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.ct)
        } else {
          this.platform.ready().then(() => {
            this.recUtils.downPlay(this.url + "/" + item.ctmref)
            this.duration = localStorage.getItem("duration")
          })
        }

      } else {
        if (item.selectedSlow) {
          this.platform.ready().then(() => {
            this.recUtils.downPlay(this.url + "/" + item.msr)
          })

        } else {
          this.platform.ready().then(() => {
            this.recUtils.downPlay(this.url + "/" + item.mrr)
          })
        }
        this.duration = localStorage.getItem("duration")
      }
      this.recUtils.createElement(id, item)
      item.isPlay = true

    }

  }

  currentDisplay: any
  woman(item, id, event?) {

    if (item.frr == "") {
      this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.fl)
    } else {
      if (item.selectedCtr == true) {
        if (item.ctfref == "NO") {
          this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.ct)
        } else {
          let contx = item.ct
          //  this.utils.showAlert("", "Context Sentence...", contx.fontcolor("blue") + " (" + item.ctr + ")")
          this.platform.ready().then(() => {
            this.recUtils.downPlay(this.url + "/" + item.ctfref)
            this.duration = localStorage.getItem("duration")
          })
        }
      } else {
        if (item.selectedSlow) {
          this.platform.ready().then(() => {
            this.recUtils.downPlay(this.url + "/" + item.fsr)
            this.duration = localStorage.getItem("duration")
            if (this.isPlaying) {
              let index = this.items.indexOf(item);
              index >= this.items.length - 1 ? index = 0 : index++;
              this.autoPlayTrack(this.items[index], this.duration);
              this.currentDisplay = this.items[index]
            }
          })
        } else {
          this.recUtils.downPlay(this.url + "/" + item.frr)
          this.duration = localStorage.getItem("duration")
          if (this.isPlaying) {
            let index = this.items.indexOf(item);
            console.log("index of " + index)
            index >= this.items.length - 1 ? index = 0 : index++;
            this.autoPlayTrack(this.items[index], this.duration);
            this.currentDisplay = this.items[index]
          }
        }
      }
      this.recUtils.createElement(id, item)
    }
  }

  playEnglish(item) {
    this.recUtils.textToSpeech(item)
  }

  pause(item) {
    item.isPlay = false
  }

  params: any
  presentRecord(item) {
    //if no filtering
    if (this.isViewAll) this.items = this.allItems
    this.params = {
      item: item, items: this.items, siteName: this.siteName, url: this.url
      , lastIncorrect: this.lastIncorrect, noRecording: this.noRecording, rtl: this.rtl
    }
    this.items$.next(this.items)
    // will use a callback to update info
    this.nav.push(RecordPage, { _params: this.params, callback: this.recordCallbackFunction });

  }

  recordCallbackFunction = (_params) => {
    return new Promise((resolve, reject) => {
      this.params = _params;
      this.lastCorrect = this.params.lastCorrect
      this.lastIncorrect = this.params.lastIncorrect
      this.noRecording = this.params.noRecording;
      resolve();
    });
  }

  playRecord(item, idx) {
    this.recUtils.playRecord(item, this.siteName)
  }

  addPlayList() {
    this.db.remove(this.siteName + 'Playlist')
    this.db.set(this.siteName + 'Playlist', JSON.stringify(this.tempPlaylists)).then(() => { })
    this.tempPlaylists = []
    //find all match then loop thru to change value 
    this.items.filter(item => item.isAddPlaylist == true).forEach(it => it.isAddPlaylist = false)
    this.utils.presentToast('Selected items added to Playlist.', 1500)
  }


  currentTrack: any = this.items[0]
  idxStart: any
  idxEnd: any
  duration: any = 1500
  progressInterval: any

  selectList(event, item, start, end) {
    this.idxStart = start
    this.idxEnd = end
    if (!item.isAddPlayList) {
      item.isAddPlaylist = true
      if (this.tempPlaylists.length == 0) this.utils.presentToast('Press the RED circle + button to Add Selected items to Playlist.', 2000)
      this.utils.addItem(this.tempPlaylists, item)
    } else {
      item.isAddPlaylist = false
      this.utils.removeItem(this.tempPlaylists, item)
    }

  }

  startAutoPlay() {
    let popover = this.popoverCtrl.create(AutoPlayPage);
    popover.present();
  }
  autoPlayModal() {
    let modal = this.modalCtrl.create(AutoPlayPage, { items: this.items, url: this.url });
    modal.present();

  }

  isPlaying = false

  async autoPlay() {
    if (this.isPlaying == false) {
      this.isPlaying = true
      await this.items.forEach(async (item) => {
        await this.autoPlayTrack(item, this.duration);
      });
      // await Promise.all(this.items.map(async (item) => {
      //   await this.autoPlayTrack(item, this.duration);
      // }));
    } else {
      this.isPlaying = false
      this.pauseTrack(this.currentTrack)
    }
  }


  autoPlayTrack(item, duration?) {
    // First stop any currently playing tracks
    for (let checkTrack of this.items) {
      if (checkTrack.playing) {
        this.pauseTrack(checkTrack);
      }
    }
    console.log("duration " + this.duration)
    item.playing = true;

    this.currentTrack = item

    // Simulate track playing
    this.progressInterval = setInterval(() => {
      //  track.progress < 100 ? track.progress++ : track.progress = 0;
      //  if (track.progress = 100) {
      this.woman(item, null, null)

      // this.nextTrack()
      //    }
    }, this.duration);

  }

  pauseTrack(track) {
    track.playing = false;
    clearInterval(this.progressInterval);

  }

  nextTrack() {
    clearInterval(this.progressInterval);

    let index = this.items.indexOf(this.currentTrack);
    console.log("next track index " + index)
    index >= this.items.length - 1 ? index = 0 : index++;
    this.woman(this.items[index], null, null);
    console.log("next track index after " + index)

  }

  prevTrack() {
    clearInterval(this.progressInterval);
    let index = this.items.indexOf(this.currentTrack);
    index > 0 ? index-- : index = this.items.length - 1;
    this.woman(this.items[index], null, null);
    this.currentTrack = this.items[index + 1]

  }



  showCreateQuiz() {
    // this.nav.push(QuizPage, { items: this.items})
    this.db.set("items", this.items)
  }

  segmentChanged(event) {
    if (event.value == 'quizfill' || event.value == 'mixmatch' || event.value == 'quizdrop') {
      this.showCreateQuiz()
    } else if (event.value == 'quiztrans') {
      this.showCreateQuiz()
    } else {
    }

  }

  // little animation
  myAnime(myString) {
    let myArray = myString.split("");
    var loopTimer;
    frameLooper();
    function frameLooper() {
      if (myArray.length > 0) {
        document.getElementById("flashMsg").innerHTML += myArray.shift();
      } else {
        clearTimeout(this.loopTimer);
        return false;
      }
      loopTimer = setTimeout('frameLooper()', 70);
    }
  }

}
