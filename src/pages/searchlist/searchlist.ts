import { Component, ViewChild, OnInit,  ChangeDetectorRef, NgZone } from '@angular/core';
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
//import { JwtHelper, tokenNotExpired } from 'angular2-jwt';

import { CommonUtils } from '../../utils/common-utils';
import { RecordUtils } from '../../utils/record-utils';

import { RecordPage } from '../../pages/record/record';
import { OthersoverPage } from '../../pages/othersover/othersover';
import { LanguagePage } from '../../pages/language/language';

import { SortoverPage } from '../../pages/sortover/sortover';
import { AutoPlayPage } from '../../pages/autoplay/autoplay';

import 'rxjs/add/operator/debounceTime';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

//import { VirtualScrollModule, VirtualScrollComponent } from 'angular2-virtual-scroll';

import { VirtualListComponent } from 'angular-virtual-list';

import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { AndroidPermissions } from '@ionic-native/android-permissions';

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
  //public jwtHelper: JwtHelper = new JwtHelper();

  //loginVal = this.params.get('logVals')
  username: string
  public url: string
  rtl: string
  searchQuery: string = ''
  items: Array<Item> = []
  allItems: Array<Item> = []
  //playlists: Array<Item> = []
  //tempPlaylists: Array<Item> = []

  //content = this.params.get('contents')
  public content: any;
  ifPlay = false
  ifActive = true
  siteName: any
  siteAudio: any
  activeItem: any = ''
  lessonMenu: Array<{
    type: string
    name: string
    count: number
    sublesson?: Array<{
      type: any
      name: any
      count: number
    }>
    topic?: Array<{
      type: any
      name: any
      count: number
      subtopic?: Array<{
        type: any
        name: any
        count: number
      }>
    }>
  }> = []
  topic: Array<{
    name: string
    count?: number
    subtopic?: Array<{
      name: string
      count?: number
    }>
  }> = []
  subtopic?: Array<{
    name: string
    count?: number
  }> = []
  grammar?: Array<{
    name: string
    count?: number
  }> = []


  scrollItems: Array<Item> = [];
  filteredList: Array<Item> = [];
  items$ = new BehaviorSubject<Array<Item>>(null);
  zone = new NgZone({ enableLongStackTrace: false })

  @ViewChild("audio") audio;
  
  @ViewChild(VirtualListComponent)
  private virtualList: VirtualListComponent;

  progress = 0;
  slow = false
  isPressed = false
  isContext = false
  sortOrder = 'A'
  opts = "search"
  isViewAll = true
  isPlayList = false
  indices?: any
  filterTitles: string

  lastCorrect: any
  lastIncorrect: any
  noRecording: any
  lessonItems = []
  theme: String = 'primary';
  flag: string


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
    public events: Events,
    private cd: ChangeDetectorRef,
    private speechRecognition: SpeechRecognition,
    private androidPermissions: AndroidPermissions
  ) {

    this.theme = localStorage.getItem("theme")
    if (this.theme == null) this.theme = "primary"
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
          //this.siteAudio = this.url.split("https://np.ll.mit.edu", 2);
          this.siteAudio = this.url
        } else {
          this.siteAudio = this.url
          console.log("site audio " + this.siteAudio)
        }
        this.db.get("latestSiteName").then(site => {
          this.siteName = site
          this.flag = localStorage.getItem("cc")
          this.db.get(site).then((items) => {
            this.allItems = items
            this.items = items

            // this.db.get(this.siteName + 'Playlist').then(str => {
            //   if (str != null) { this.playlists = JSON.parse(str) }
            // })
            this.indices = { "start": 0, "end": 6 }

            //this is needed to be able to display initial data
            this.items$.next(this.items)
          })
          this.db.get(site + "menu").then((menu) => {
            this.lessonMenu = menu
            // needed to call the events for the menu lessons
            this.filterItems()
          })
          this.db.get(site + "grammar").then((grammar) => {
            this.grammar = grammar
          })
          this.db.get(site + "topic").then((topic) => {
            this.topic = topic

          })

        });
      })
      this.db.get('username').then(val => this.username = val)
      this.db.get('rtl').then(val => {
        if (val) {
          this.rtl = 'rtl'
        } else {
          this.rtl = "ltr"
        }  //      this.changeLanguage()
      })
      // this.db.get(this.siteName + 'Playlist').then(str => {
      //   if (str != null) { this.playlists = JSON.parse(str) }
      // })
    })
    this.searchControl = new FormControl()
  }
  callback
  ionViewDidLoad() {

    this.getSearchItems();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      //this.searching = false;
      this.shouldShowCancel = true
      this.getSearchItems();
    });
    this.events.subscribe('theme:toggle', (theme) => {

      if (theme == "ionic.theme.default") {
        localStorage.setItem("theme", 'primary')
        this.theme = "primary"
      } else {
        localStorage.setItem("theme", theme)
      }
    });
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {

        if (!hasPermission) {
          this.speechRecognition.requestPermission()
            .then(

              () => {
                console.log('Granted Speech')
                if (this.platform.is("android")) {
                  this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
                  console.log('Grant permission write')

                  this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.RECORD_AUDIO)
                  // this.recObject.stopRecord()
                  console.log('Grant permission rec ')
                }
              }
              ,
              () => console.log('Denied')
            )
        }
      });
    this.db.get("latestSiteName").then(site => {
      this.siteName = site
      this.flag = localStorage.getItem("cc")
      this.db.get(site).then((items) => {
        this.allItems = items
        this.items = items

        // this.db.get(this.siteName + 'Playlist').then(str => {
        //   if (str != null) { this.playlists = JSON.parse(str) }
        // })
        this.indices = { "start": 0, "end": 6 }

        //this is needed to be able to display initial data
        this.items$.next(this.items)
      })
      this.db.get(site + "menu").then((menu) => {
        this.lessonMenu = menu
      })
      this.db.get(site + "grammar").then((grammar) => {
        this.grammar = grammar
      })
      this.db.get(site + "topic").then((topic) => {
        this.topic = topic

      })
    });

  }


  // for the menu of lessons
  filterItems() {
    
    this.searchTerm = ""
    let params = {
      menu: this.lessonMenu, grammar: this.grammar, topic: this.topic, items: this.allItems,
      siteName: this.siteName + " - (" + this.allItems.length + ")", isViewAll: false
    }
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
      this.items$.next(this.params.items)
     
      //to be used for display of footerfilteri
      this.lessonItems = this.params.items
      this.opts = 'search'
      this.isViewAll = this.params.isViewAll
      this.isPlayList = this.params.isPlayList
      if (this.items.length > 0) {
        this.filterTitles = this.params.filterTitle
        // this.items[0].lesson + ' ' + this.items[0].lessonId + '  ' + this.items[0].sublesson + ' ' + this.items[0].sublessonId
      }
      this.virtualList.refreshList()
     
      resolve();
    });
  }
  focusOnAnItem() {
    this.virtualList.scrollInto(this.items[1]);
  }

  clearPlayList() {
    this.allItems.map(item => { item.isAddPlaylist = false })
    this.items = this.allItems
    this.isPlayList = false
    this.isViewAll = true
    this.items$.next(this.items)
  }
  // itemHeader(record, recordIndex, records) {
  //   if (recordIndex === 0) {
  //     return record.lesson;
  //   } else {
  //     let recComp = recordIndex + 1
  //     if (recComp < records.length) {
  //       if (record.lesson != records[recComp].lesson) {
  //         if (record.sublesson != records[recComp].sublesson) {
  //           return record.sublesson
  //         }
  //         return record.lesson;
  //       }
  //     }
  //   }
  //   return null;
  // }


  changeLanguage() {
    if (this.rtl) {
      this.platform.setDir('rtl', true);
      //this.translate.setDefaultLang(languageId);
    } else {
      this.platform.setDir('ltr', true);
      //this.translate.setDefaultLang(languageId);
    }
  }

  callbackLang
  ionViewCanEnter() {
    this.auth.authenticated()

  }



  searching: any

  showSearch() {
    this.opts = "search"
  }

  onSearchInput() {
    //this.searching = true;
    //this.items=this.allItems
    //  this.items$.next(this.allItems)
    //  console.log("input searxh")
  }
  // for filtering search
  shouldShowCancel = false
  onCancel() {
    this.shouldShowCancel = false
    this.showAll()
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
    this.cd.detectChanges();
    this.lessonItems = this.items
    this.items$.next(this.items);
    this.virtualList.refreshList()

  }


  supportedLang =
    {
      android: [
        { code: "ph", desc: "fil-PH" },
        { code: "br", desc: "pt-BR" },
        { code: "kr", desc: "ko-KR" },
        { code: "ru", desc: "ru-RU" },
        { code: "es", desc: "es-ES" },
        { code: "us", desc: "en-US" },
        { code: "jp", desc: "ja-JP" },
        { code: "fr", desc: "fr-FR" },
        { code: "eg", desc: "ar-EG" },
        { code: "ir", desc: "fa-IR" },
        { code: "de", desc: "de-DE" },
        { code: "cn", desc: "cmn-Hans-CN" }
      ],
      ios: [
        { code: "br", desc: "pt-PT" },
        { code: "kr", desc: "ko-KR" },
        { code: "ru", desc: "ru-RU" },
        { code: "es", desc: "es-ES" },
        { code: "us", desc: "en-GB" },
        { code: "jp", desc: "ja-JP" },
        { code: "fr", desc: "fr-FR" },
        { code: "de", desc: "de-DE" }
      ]
    }

  isSpeak = false
  getSearchSpeech() {
    this.items = this.allItems
    this.items$.next(this.allItems)
    let lang = []
    let speech: string
    let flagSpeak = localStorage.getItem("spk")
    if (flagSpeak == null) flagSpeak = 'us'
    if (this.platform.is('ios')) {
      lang = this.supportedLang.ios.filter((obj) => { return obj.code === flagSpeak });

      if (lang.length == 0) {
        speech = "en-GB"
      } else {
        speech = lang[0].desc
      }
    } else {
      lang = this.supportedLang.android.filter((obj) => { return obj.code === flagSpeak });
      if (lang.length == 0) {
        speech = "en-US"
      } else {
        speech = lang[0].desc
      }
    }

    let options = {
      language: speech,
      matches: 5,
      prompt: "",      // Android only
      showPopup: true,  // Android only
      showPartial: false
    }
    // this.speechRecognition.isRecognitionAvailable()
    //   .then((available: boolean) => console.log(available))

    // Start the recognition process
    this.speechRecognition.startListening(options)
      .subscribe(
        (matches: Array<string>) => {
          this.searchTerm = matches[0]
          console.log('match words ' + matches[0])
          this.getSearchItems()
          //useful to update ui if there are changes on the input placement of code is critical
          this.cd.detectChanges();

        }
        ,
        (onerror) => console.log('error:', onerror)
      )
    if (this.platform.is('ios')) {
      this.isSpeak = true
    }

    // Stop the recognition process (iOS only)

    // Get the list of supported languages
    // this.speechRecognition.getSupportedLanguages()
    //   .then(
    //     (languages: Array<string>) => console.log(languages),
    //     (error) => console.log(error)
    //   )

    // getSupportedLanguages result on Android:


    //   let supportedLanguagesAndroid =
    //     ["af-ZA", "id-ID", "ms-MY", "ca-ES", "cs-CZ", "da-DK", "de-DE", "en-AU", "en-CA",
    //       "en-001", "en-IN", "en-IE", "en-NZ", "en-PH", "en-ZA", "en-GB", "en-US", "es-AR",
    //       "es-BO", "es-CL", "es-CO", "es-CR", "es-EC", "es-US", "es-SV", "es-ES", "es-GT",
    //       "es-HN", "es-MX", "es-NI", "es-PA", "es-PY", "es-PE", "es-PR", "es-DO", "es-UY",
    //       "es-VE", "eu-ES", "fil-PH", "fr-FR", "gl-ES", "hr-HR", "zu-ZA", "is-IS", "it-IT",
    //       "lt-LT", "hu-HU", "nl-NL", "nb-NO", "pl-PL", "pt-BR", "pt-PT", "ro-RO", "sl-SI",
    //       "sk-SK", "fi-FI", "sv-SE", "vi-VN", "tr-TR", "el-GR", "bg-BG", "ru-RU", "sr-RS",
    //       "uk-UA", "he-IL", "ar-IL", "ar-JO", "ar-AE", "ar-BH", "ar-DZ", "ar-SA", "ar-KW",
    //       "ar-MA", "ar-TN", "ar-OM", "ar-PS", "ar-QA", "ar-LB", "ar-EG", "fa-IR", "hi-IN",
    //       "th-TH", "ko-KR", "cmn-Hans-CN", "cmn-Hans-HK", "cmn-Hant-TW", "yue-Hant-HK",
    //       "ja-JP"];


    //   // getSupportedLanguages result on iOS:

    //   let supportedLanguagesIOS =
    //     ["nl-NL", "es-MX", "zh-TW", "fr-FR", "it-IT", "vi-VN", "en-ZA", "ca-ES", "es-CL", "ko-KR",
    //       "ro-RO", "fr-CH", "en-PH", "en-CA", "en-SG", "en-IN", "en-NZ", "it-CH", "fr-CA", "da-DK",
    //       "de-AT", "pt-BR", "yue-CN", "zh-CN", "sv-SE", "es-ES", "ar-SA", "hu-HU", "fr-BE", "en-GB",
    //       "ja-JP", "zh-HK", "fi-FI", "tr-TR", "nb-NO", "en-ID", "en-SA", "pl-PL", "id-ID", "ms-MY",
    //       "el-GR", "cs-CZ", "hr-HR", "en-AE", "he-IL", "ru-RU", "de-CH", "en-AU", "de-DE", "nl-BE",
    //       "th-TH", "pt-PT", "sk-SK", "en-US", "en-IE", "es-CO", "uk-UA", "es-US"];
  }

  stopSpeech() {
    this.speechRecognition.stopListening().then(() => {
      this.isSpeak = false
    })
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
    let popover = this.popoverCtrl.create(OthersoverPage, { items: this.allItems, siteName: this.siteName });
    popover.present({
      ev: event
    })
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
            this.recUtils.downPlay(this.url + "/" + item.ctmref, this.audio)
            this.duration = localStorage.getItem("duration")
          })
        }

      } else {
        if (item.selectedSlow) {
          this.platform.ready().then(() => {
            this.recUtils.downPlay(this.url + "/" + item.msr, this.audio)
          })

        } else {
          this.platform.ready().then(() => {
            this.recUtils.downPlay(this.url + "/" + item.mrr, this.audio)
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

            this.recUtils.downPlay(this.url + "/" + item.ctfref, this.audio)
            this.duration = localStorage.getItem("duration")
          })
        }
      } else {
        if (item.selectedSlow) {
          this.platform.ready().then(() => {
            // if (this.platform.is("core") || this.platform.is("mobileweb")) {
            //   this.audio.nativeElement.src = this.url + "/" + item.fsr
            //   this.audio.nativeElement.play()
            //  //   this.duration=this.audio.nativeElement.duration
            // } else {
            this.recUtils.downPlay(this.url + "/" + item.fsr, this.audio)
            this.duration = localStorage.getItem("duration")
            // if (this.isPlaying) {
            //   let index = this.items.indexOf(item);
            //   index >= this.items.length - 1 ? index = 0 : index++;
            //   this.autoPlayTrack(this.items[index], this.duration);
            //   this.currentDisplay = this.items[index]
            // }
            // }
          })
        } else {
          // if (this.platform.is("core") || this.platform.is("mobileweb")) {
          //   this.audio.nativeElement.src = this.url + "/" + item.frr
          //   this.audio.nativeElement.play()
          //   this.duration=this.audio.nativeElement.duration
          // } else {
          this.recUtils.downPlay(this.url + "/" + item.frr, this.audio)
          this.duration = localStorage.getItem("duration")
          // if (this.isPlaying) {
          //   let index = this.items.indexOf(item);
          //   console.log("index of " + index)
          //   index >= this.items.length - 1 ? index = 0 : index++;
          //   this.autoPlayTrack(this.items[index], this.duration);
          //   this.currentDisplay = this.items[index]
          // }
          // }
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

  // list all languages to select
  getLanguages() {

    // will use a callback to update info
    // needed to clear memory so that side menu will work
    this.nav.push(LanguagePage, { lang: this.getLangCallbackFunction });
  }


  //only being called after selecting from the language lists
  getLangCallbackFunction = (items?) => {
    return new Promise((resolve, reject) => {
      //this.ngOnInit()
      this.zone.run(() => {
        this.db.get("latestSiteName").then(site => {
          this.siteName = site
          this.flag = localStorage.getItem("cc")
          // this.db.get(this.siteName + 'Playlist').then(str => {
          //   if (str != null) { this.playlists = JSON.parse(str) }
          // })
          this.indices = { "start": 0, "end": 6 }
          this.db.get(site + "menu").then((menu) => {
            this.lessonMenu = menu
            this.filterItems()
          })
          this.db.get(site + "grammar").then((grammar) => {
            this.grammar = grammar
            this.filterItems()
          })
          this.db.get(site + "topic").then((topic) => {
            this.topic = topic
            this.filterItems()
          })

          this.items$.next(items)
          this.items = []
          this.items = items
          this.allItems = items
          this.isViewAll = true
          this.opts = 'search'
          this.searchTerm = ""

          this.db.get('rtl').then(val => {
            if (val) {
              this.rtl = 'rtl'
            } else {
              this.rtl = "ltr"
            }  //      this.changeLanguage()
          })
        }).catch((err) => {
          console.log("call err " + err)
        })

        resolve();
      })
    });
  }

  params: any
  goRecord(item) {
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

  // addPlayList() {
  //   this.db.remove(this.siteName + 'Playlist')
  //   this.db.set(this.siteName + 'Playlist', JSON.stringify(this.tempPlaylists)).then(() => { })
  //   // this.tempPlaylists = []
  //   //find all match then loop thru to change value 
  //   //this.items.filter(item => item.isAddPlaylist == true).forEach(it => it.isAddPlaylist = false)
  //   this.utils.presentToast('Selected items added to Playlist.', 1500)
  // }


  currentTrack: any = this.items[0]
  idxStart: any
  idxEnd: any
  duration: any = 1500
  progressInterval: any

  selectList(event, item, start, end) {
    this.idxStart = start
    this.idxEnd = end
    if (!item.isAddPlaylist) {
      item.isAddPlaylist = true
      let filteritems = this.items.filter((item) => {
        return (item.isAddPlaylist)
      })
      if (filteritems.length == 1) this.utils.presentToast('Selected item added to Study list.', 1500)
      //  this.utils.addItem(this.tempPlaylists, item)
    } else {
      item.isAddPlaylist = false
      //  this.utils.removeItem(this.tempPlaylists, item)
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
    this.db.set("quizSection", this.filterTitles)
    // this.db.get("items").then((items) => {
    //   this.items = items
    //   this.items$.next(items)
    // })
    // this.quizParams = {
    //   'quizSection':this.filterTitles,"quizItems":this.items}
  }

  segmentChanged(event) {
    if (event.value == 'quizfill' || event.value == 'mixmatch' || event.value == 'quizdrop') {
      this.showCreateQuiz()
    } else if (event.value == 'quiztrans') {
      // this.showCreateQuiz()
    } else if (event.value == 'search') {
      
      this.db.get("items").then((items) => {
        this.items = items
        //combine 2 arrays
        this.allItems.map(x => Object.assign(x, items.find(y => y.id == x.id)));

        this.items$.next(items)
      })
    }

  }

  // quizParams:any

  // quizCallbackFunction = (_params) => {
  //   return new Promise((resolve, reject) => {
  //     this.params = _params;
  //      resolve();
  //   });
  // }
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
