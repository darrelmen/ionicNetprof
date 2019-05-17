import { Component, ViewChild, NgModule, ElementRef } from '@angular/core';
import { ViewController, Slides, Platform, NavParams, NavController, normalizeURL, Events, ItemSliding } from 'ionic-angular';
import { CommonUtils } from '../../utils/common-utils'
import { RecordUtils } from '../../utils/record-utils';
import { AuthService } from '../../providers/auth-service/auth-service';
//import { RecordUtils } from '../../utils/record-utils'
import { File } from '@ionic-native/file';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { Media, MediaObject } from '@ionic-native/media';
import { Item } from '../../model/item'
import Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import { HTTP } from '@ionic-native/http'
//import { TextToSpeech } from '@ionic-native/text-to-speech';

More(Highcharts);


//declare var cordova: any;
/*
  Generated class for the Record page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


@Component({
  selector: 'page-record',
  templateUrl: 'record.html'
})




export class RecordPage {
  items: Array<Item> = []
  allItems: Array<Item> = []
  allWithChangedItems: Array<Item> = []
  sliceItems: number = 20
  url: string
  siteName: string
  item: Item
  currentItem: any
  index: number
  itemLength = 0

  selectedSlow = false
  selectedCtx = false
  duration: any
  isShuffle = false
  isAutoPlay = false
  isAudioOn = true
  isShowAll = false
  isBoth = true
  isEnglish = false
  isContext = true
  isRecord = false
  recordType: string
  isLastPlayMan = false
  // check whether a recording was done when visiting the page
  didRecording = false
  filterTitle: string
  newObject: MediaObject = null
  recObject: MediaObject = null
  @ViewChild('mySlider') slider: Slides;
  // @ViewChild("audioHtml") audioHtml;
  //@ViewChild("container", { read: ElementRef }) container: ElementRef;

  recordIcon = "mic";
  recordColor = "danger"
  recordColorCtx = "danger"

  rtl: string
  params: any
  theme: string
  constructor(
    public utils: CommonUtils,
    //public recUtils: RecordUtils,
    public platform: Platform,
    public navParam: NavParams,
    public nav: NavController,
    public viewCtrl: ViewController,
    public newFile: Media,
    public recFile: Media,
    public auth: AuthService,
    public recUtils: RecordUtils,
    public events: Events,
    // public transfer: FileTransfer,
    public httpNative: HTTP,
    public file: File,
    // public tts: TextToSpeech,
    public audio: Media,
    private androidPermissions: AndroidPermissions) {

    this.params = this.navParam.get("_params")
    this.item = this.params.item
    this.siteName = this.params.siteName
    this.items = this.params.items
    this.allWithChangedItems = this.params.allWithChangedItems
    this.rtl = this.params.rtl
    this.allItems = this.items
    this.isLastPlayMan = this.params.isLastPlayMan
    this.filterTitle = this.params.filterTitle

    this.index = this.items.indexOf(this.item)

    if (this.items.length > 20) {
      if (this.index > 20) {
        if (this.items.length == this.allItems.length) {
          this.items = this.allItems.slice(this.index - 19, this.index + 1)
          // this.sliceItems = this.index
        } else {
          this.items = this.allItems.slice(0, this.index + 1)
          this.sliceItems = this.index
        }
      } else {
        this.items = this.items.slice(0, this.sliceItems)
      }
    }
    // to set the initial slide based on selected item
    this.index = this.items.indexOf(this.item)


    this.itemLength = this.items.length
    //this.index = this.params.index
    this.url = this.params.url
    // this.item = this.navParam.get("item")
    // this.siteName = this.navParam.get("siteName")
    // this.items = this.navParam.get("items")
    // this.itemLength = this.items.length
    // this.index = this.navParam.get("index")
    // this.url = this.navParam.get("url")
    console.log("total items " + this.items.length)

    this.theme = localStorage.getItem("theme")
    if (this.theme == null) this.theme = "primary"

    platform.ready().then(() => {
      this.platform.pause.subscribe(() => {
        console.log('[INFO] App paused');
      });

      this.platform.resume.subscribe(() => {
        console.log('[INFO] App resumed');
      });
    });
  }
  callback: any
  ionViewDidLoad() {
    //if (this.platform.is("android")) {
    this.file.createFile(this.recUtils.checkPlatform(), 'dummy.wav', true).then((fe) => {
      this.platform.ready().then(() => {
        this.recObject = this.newFile.create(normalizeURL(fe.toURL()));
        this.recObject.startRecord()
        this.recObject.stopRecord()
        this.recObject.onSuccess.subscribe(() => {
          this.recObject.release()
          console.log(" err fe " + fe.toURL())
        })
        this.recObject.onError.subscribe((err) => {
          this.recObject.release()
          console.log(" err e " + err)
        })
      })
    })
    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
    //   result => console.log('Has permission write ', result.hasPermission),
    //   err => {
    //     this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    //     console.log('Grant permission write')
    //   }
    // );
    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
    //   result => console.log('Has permission record ', result.hasPermission),
    //   err => {
    //     // this.dummyRecord()
    //     this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.RECORD_AUDIO)
    //     this.recObject = this.newFile.create(normalizeURL(this.recUtils.checkPlatform() + 'dummy.wav'));
    //     this.recObject.startRecord()
    //     this.recObject.stopRecord()
    //     console.log('Grant permission rec err')

    //     this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.MICROPHONE)
    //     // this.recObject.stopRecord()
    //     console.log('Grant permission mic err')
    //     this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    //     console.log('Grant permission write')
    //   }
    // );

    // }
    //  this.utils.showAlert("","Press and Hold to record.","")
  }

  ionViewWillEnter() {
    this.callback = this.navParam.get("callback")
    //this.utils.presentToast('Tap once to start record then Tap again to end.', 3000)
    this.utils.presentToast('Press and Hold to Record.', 2000)

    //this.utils.showAlert("","Press and Hold to record.","")
  }
  close() {
    try {
      this.events.publish('enableSplitPanel', true)
      var lesson;
      if (this.item.sublesson == "" || this.item.sublesson == undefined) {
        lesson = this.item.lesson + "=" + this.item.lessonId
      } else {
        lesson = this.item.lesson + "=" + this.item.lessonId + "&" + this.item.sublesson + "=" + this.item.sublessonId
      }
      //make sure autoplay is stop before moving to the next page
      if (this.isAutoPlay) this.stopAutoPlay()
      // check to avoid unecessary processing /server call
      if (this.didRecording) {
        //this.auth.getScores(lesson).subscribe((lessonScores: any) => {
        // for deployment   
        this.auth.getScores(encodeURIComponent(lesson)).then((lessonScores: any) => {

          //filtered vs non filtered selection for the updated scores
          if (lessonScores.scores.length > 0) {
            //this is how to combine 2 arrays with matching ids
            this.items = this.items.map(x => Object.assign(x, lessonScores.scores.find(y => y.ex == x.id)));
          } else {
            this.items = this.allItems.map(x => Object.assign(x, this.items.find(y => y.id == x.id)));
          }
          this.allWithChangedItems = this.allWithChangedItems.map(x => Object.assign(x, this.items.find(y => y.id == x.id)));

          let lastCorrect = lessonScores.lastCorrect
          let lastIncorrect = lessonScores.lastIncorrect
          let noRecording = this.allItems.length - Number(lastCorrect) - Number(lastIncorrect)

          this.params = this.params = { items: this.items, allWithChangedItems: this.allWithChangedItems, lastCorrect: lastCorrect, lastIncorrect: lastIncorrect, noRecording: noRecording }
          this.callback(this.params).then(() => {
            this.nav.popToRoot();
          }).catch(() => {
            this.nav.popToRoot();
          })
        })
      } else {
        this.nav.popToRoot();
      }
    } catch (error) {
      this.nav.popToRoot();
    } finally {
      this.nav.popToRoot();
    }
  }


  ngAfterViewInit() {
    // this.downloadMultipleAudio()
    //this.slider.freeMode = true;
    this.slider.initialSlide = this.index
    this.slider.speed = 500
    this.slider.loop = true
    this.slider.paginationType = "fraction"
    // this.slider.paginationType = "bullets"
    this.slider.pager = true
    this.slider.shortSwipes = true
    this.slider.centeredSlides = true;
  }

  // downloadMultipleAudio() {
  //   this.items.forEach((item) => {
  //     console.log(" test" + this.file.dataDirectory + this.siteName + "/bestAudio/" + item.id)
  //     this.file.checkDir(this.file.dataDirectory, this.siteName + "/bestAudio/" + item.id)
  //       .then((isExist) => {
  //         if (isExist) {
  //         } else {
  //           console.log("is not exist  " + item.fl)
  //           this.downloadAudio(item.mrr)
  //         }
  //       })
  //       .catch(() => {
  //         console.log("copy audio ")
  //         this.downloadAudio(item.mrr)
  //       });

  //     this.file.checkDir(this.file.dataDirectory + this.siteName + "/bestAudio", item.id)
  //       .then((isExist) => {
  //         if (isExist) {
  //         } else {
  //           console.log("is exist  " + item.ct)
  //           this.downloadAudio(item.ctmref)
  //         }
  //       }).catch(() => {
  //         console.log("copy audio ")
  //         this.downloadAudio(item.ctmref)
  //       });
  //   })
  // }

  // downloadAudio(audio) {
  //   this.platform.ready().then(() => {
  //    // const fileTransfer: FileTransferObject = this.transfer.create();
  //     var audioLocation = this.url + "/" + audio;
  //     this.file.checkDir(this.file.dataDirectory, this.siteName).then((isExist) => {
  //       this.httpNative.downloadFile({},audioLocation, this.file.dataDirectory + this.siteName + "/" + audio).then((entry) => { }

  //         , (error) => {
  //           console.log("download  " + error)
  //         });

  //     }).catch(() => {
  //       this.file.createDir(this.file.dataDirectory, this.siteName, true).then((val) => {
  //         console.log("create dowload  " + this.file.dataDirectory, this.siteName)
  //         fileTransfer.download(audioLocation, this.file.dataDirectory + this.siteName + "/" + audio).then((entry) => { }
  //           , (error) => {
  //             console.log("dowload  " + error)
  //           });
  //       })
  //     })
  //   });
  // }

  x
  man(item, id) {
    if (this.isAudioOn) {
      if (this.selectedCtx == true) {
        if (item.ctmref == "NO") {
          this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.ct)
          item.selectedCtr == false
        } else {
          if (this.x) clearTimeout(this.x);
          this.x = setTimeout(() => {

            this.recUtils.downPlay(this.url + "/" + item.ctmref)
            //this.playAudio(item.ctmref, item.ctr)
          }, 2000)
        }
      } else {
        if (item.mrr == "") {
          this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.fl)
        } else {
          if (this.x) clearTimeout(this.x);
          this.x = setTimeout(() => {
            this.recUtils.createElement(item.id, item)
            if (this.selectedSlow) {
              // this.playAudio(item.msr, item.en)
              this.recUtils.downPlay(this.url + "/" + item.msr)

            } else {
              // this.playAudio(item.mrr, item.en)
              this.recUtils.downPlay(this.url + "/" + item.mrr)
            }
          }, 500)
        }
      }
    }
  }


  woman(item, id) {
    if (this.isAudioOn) {
      if (this.selectedCtx == true) {
        if (item.ctfref == "NO") {
          this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.ct)
          item.selectedCtr == false
        } else {
          this.playAudio(item.ctfref, item.ctr)
        }
      } else {
        if (item.mrr == "") {
          this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.fl)
        } else {
          if (this.x) clearTimeout(this.x);
          this.x = setTimeout(() => {
            this.recUtils.createElement(item.id, item)
            if (this.selectedSlow) {
              this.playAudio(item.fsr, item.en)
            } else {
              this.playAudio(item.frr, item.en)
            }
          }, 500)
        }
      }
    }
  }

  // woman(item, id) {
  //   if (item.frr == "") {
  //     //  this.man(item)
  //     // this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.fl)
  //   } else {
  //     this.recUtils.createElement(item.id, item)
  //     // this.recUtils.downPlay(this.url + "/" + item.frr).subscribe((duration)=> {
  //     //   this.duration =duration
  //     //   console.log("duration  " + duration)
  //     //  })
  //     if (this.selectedSlow) {
  //       this.recUtils.downPlay(this.url + "/" + item.fsr, this.audio)
  //       this.duration = localStorage.getItem("duration")
  //     } else {
  //       this.recUtils.downPlay(this.url + "/" + item.frr, this.audio)
  //       this.duration = localStorage.getItem("duration")
  //       //this.audio.nativeElement.src = this.url + "/" + item.frr
  //     }
  //   }
  // }

  playAudio(itemType, itemToSpeak) {
    this.platform.ready().then(() => {
      // this.recUtils.createElement(item.ctid, item)
      let url = this.url + "/" + itemType
      let bestAudioDir = this.recUtils.checkPlatform()
      // this.recUtils.db.get("latestSiteName").then((str) => {
      // this.siteName = str

      //let audioPath = url.split("https://10.10.3.215/netprof/", 2);

      let audioPath = url.split("https://netprof.ll.mit.edu/netprof/", 2);
      //let fn = bestAudioDir + audioPath[1];
      //let fn = url
      let audioName = url.substring(url.lastIndexOf('/') + 1);
      console.log("siteName url " + url)
      console.log("siteName path " + audioPath[1])
      console.log("siteName name " + audioName)
      console.log("siteName best " + bestAudioDir + " str  " + this.siteName)

      //  let dir = audioPath[1].substr(0, audioPath[1].length - audioName.length)
      this.platform.ready().then(() => {

        this.file.resolveLocalFilesystemUrl(bestAudioDir + this.siteName + "BestAudio/" + audioName).then((fe) => {

          let sound: MediaObject = null

          if (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is("iphone")) {

            sound = this.audio.create(normalizeURL(bestAudioDir + this.siteName + "BestAudio/" + audioName));
            sound.play({ numberOfLoops: 1 });

          } else {
            sound = this.audio.create(fe.toURL());
            sound.play();
          }

          sound.setVolume(1.0)
          sound.onSuccess.subscribe((dur) => {
            sound.release()
            if (this.isBoth) {
              // this.tts.speak({ text: itemToSpeak, locale: 'en-US', rate: 1.5 })
              //   .then((ret) => { })
              //   .catch((reason: any) => console.log("tts err reason" + reason))
            } else {

              //setTimeout(() => { console.log("timeout x") }, 1000)
            }
          })

          sound.onStatusUpdate.subscribe((status) => {
            if (status == 4) {
              console.log('Use existing file ' + (sound.getDuration() * 1000).toFixed(0).toString())
              let x
              let duration = (sound.getDuration() * 1000).toFixed(0).toString()

              if (this.isAutoPlay) {
                if (duration == undefined || duration == null) {
                  duration = '2500'
                }
                clearTimeout(x)
                x = setTimeout(() => {
                  this.slider.autoplay = parseInt(duration) + 1000;
                  console.log("timeout xxx" + duration)
                }, 1000)
                //   if (this.isBoth) {
                //     this.slider.autoplay = parseInt(duration) + 5000

                // } else {
                //     this.slider.autoplay = parseInt(duration) + 1000;
                //   }
              }
            }
          })

          //this.showHighlights(sound,id,item)

        }).catch(() => {  // when audio is not saved yet, get from url and download file
          // let ft: FileTransferObject = this.txfr.create();
          let siteId: string = localStorage.getItem('siteid')
          console.log("site " + this.siteName)
          console.log("site " + audioName)
          this.file.checkDir(bestAudioDir, this.siteName + "BestAudio").then((isExist) => {
            this.httpNative.setDataSerializer('urlencoded');
            //this.httpNative.acceptAllCerts(true)
            this.httpNative.setSSLCertMode("nocheck")
            this.httpNative.downloadFile(url, {}, { "Content-Type": "application/x-www-form-urlencoded", "projid": siteId },
              bestAudioDir + this.siteName + "BestAudio/" + audioName)
              .then((data) => {
                //return string JSON 
                //    JSON.parse(data.data)
                let song: MediaObject = null

                if (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is("iphone")) {
                  // console.log("fe to int url " + fe.toInternalURL())
                  song = this.audio.create(normalizeURL(bestAudioDir + this.siteName + "BestAudio/" + audioName));
                  song.play({ numberOfLoops: 1 });
                } else {
                  song = this.audio.create(normalizeURL(bestAudioDir + this.siteName + "BestAudio/" + audioName));
                  //for android needed to release first before play

                  song.play();
                  song.release()
                }
                song.setVolume(1.0)
                // this.showHighlights(song,id,item)
                song.onError.subscribe((err) => console.log('Play Error ' + err.toString(1)));
                song.onSuccess.subscribe((dur) => {
                  if (this.isBoth) {
                    // this.tts.speak({ text: itemToSpeak, locale: 'en-US', rate: 1.5 })
                    //   .then((ret) => { })
                    //   .catch((reason: any) => console.log("tts err reason" + reason))
                  } else {

                    setTimeout(() => {
                      console.log("timeout ")
                    }, 1000)
                  }
                })
                song.onStatusUpdate.subscribe((status) => {
                  if (status == 4) {
                    console.log('Save new audio file ' + (song.getDuration() * 1000).toFixed(0).toString())
                    let duration = (song.getDuration() * 1000).toFixed(0).toString()

                    if (this.isAutoPlay) {
                      if (duration == undefined || duration == null) {
                        duration = '2500'
                      }
                      console.log("autoplay " + duration)

                      // if (this.isBoth) {
                      //  this.slider.autoplay = parseInt(duration) + 5000
                      //  } else {
                      //   this.slider.autoplay = parseInt(duration) + 1000;
                      // }
                    }
                  }
                })
              })
          }).catch((err) => {
            console.log("errrrr " + this.siteName)
            this.file.createDir(bestAudioDir, this.siteName + "BestAudio", false).then((dirEntry) => {

              console.log("dire " + dirEntry.toURL() + audioName)
              this.httpNative.setDataSerializer('urlencoded');
              this.httpNative.setSSLCertMode("nocheck")
              //this.httpNative.acceptAllCerts(true)
              this.httpNative.downloadFile(url, {}, { "Content-Type": "application/x-www-form-urlencoded", "projid": siteId },
                bestAudioDir + this.siteName + "BestAudio/" + audioName)
                .then((data) => {
                  //return string JSON 
                  //    JSON.parse(data.data)
                  console.log(" dowb " + data.url)
                  let song: MediaObject = null

                  if (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is("iphone")) {
                    // console.log("fe to int url " + fe.toInternalURL())
                    song = this.audio.create(normalizeURL(bestAudioDir + this.siteName + "BestAudio/" + audioName));
                    // song.play({ numberOfLoops: 1 });
                  } else {
                    song = this.audio.create(dirEntry.toURL() + audioName);

                    //for android needed to release first before play

                    song.play();
                    song.release();
                  }
                  song.setVolume(1.0)
                  // this.showHighlights(song,id,item)
                  song.onError.subscribe((err) => console.log('Play Error ' + err.toString(1)));
                  song.onSuccess.subscribe((dur) => {
                    if (this.isBoth) {
                      // this.tts.speak({ text: itemToSpeak, locale: 'en-US', rate: 1.5 })
                      //   .then((ret) => { })
                      //   .catch((reason: any) => console.log("tts err reason" + reason))
                    }
                  })
                  song.onStatusUpdate.subscribe((dur) => {
                    console.log('Use existing file  err' + (song.getDuration() * 1000).toFixed(0).toString())

                    let duration = (song.getDuration() * 1000).toFixed(0).toString()

                    if (this.isAutoPlay) {
                      if (duration == undefined || duration == null) {
                        duration = '2500'
                      }
                      console.log("autoplay " + duration)

                      if (this.isBoth) {
                        this.slider.autoplay = parseInt(duration) + 5000
                      } else {
                        this.slider.autoplay = parseInt(duration) + 1000;
                      }
                    }
                  })

                }).catch((err) => {
                  console.log("creare " + err)
                })
            })

          })
        })
      })
    })
  }


  contextItem() {
    this.isShowAll = false
    if (this.selectedCtx) {
      this.selectedCtx = false
    } else {
      this.selectedCtx = true
    }
    this.playSlide()
  }

  changeSpeed() {
    this.isShowAll = false
    if (this.selectedSlow) {
      this.selectedSlow = false
    } else {
      this.selectedSlow = true
    }
    this.playSlide()
  }
  both() {
    this.isShowAll = false
    if (this.isBoth == true) {
      this.isBoth = false
    } else {
      this.isBoth = true
    }
    this.playSlide()
  }


  englishLabel = "Show English"
  contextLabel = "Hide Context"
  toggleEnglish() {
    this.isShowAll = false
    if (this.isEnglish) {
      this.isEnglish = false
      this.englishLabel = "Show English"
    } else {
      this.isEnglish = true
      this.englishLabel = "Hide English"
    }
  }

  toggleContext() {
    this.isShowAll = false
    if (this.isContext) {
      this.isContext = false
      this.contextLabel = "Show Context"
    } else {
      this.isContext = true
      this.contextLabel = "Hide Context"
    }
  }
  toggleAudio() {
    if (this.isAudioOn) {
      this.isAudioOn = false
    } else {
      this.isAudioOn = true
    }
  }

  toggleShowAll() {
    if (this.isShowAll) {
      this.isShowAll = false
      this.selectedCtx = false
    } else {
      this.isShowAll = true
      this.selectedCtx = true
    }
  }


  playEnglish(item) {
    this.recUtils.textToSpeech(item)
  }

 
  record(item, recType) {
    // settimeout is needed because of issue with longpress do not remove
    if (this.x) clearTimeout(this.x);
          this.x = setTimeout(() => {
      this.recordIcon = "radio-button-on"
      let filename = ''
      if (recType == 'context') {
        filename = item.ctid + '_rec.wav'
        this.recordColorCtx = "light"
      } else {
        this.recordColor = "light"
        filename = item.id + '_rec.wav'
      }
      let bestAudioDir = this.recUtils.checkPlatform()
      let dir = bestAudioDir + this.siteName + "/"

      this.file.checkDir(bestAudioDir, this.siteName).then((isExist) => {
        this.file.createFile(dir, filename, true).then(() => {
          if (this.platform.is("ios")) {
            this.recObject = this.newFile.create((bestAudioDir + this.siteName + "/").replace(/^file:\/\//, '') + filename);
            console.log(" file name " + (bestAudioDir + this.siteName + "/").replace(/^file:\/\//, '') + filename)
          } else {
            this.recObject.release()
            this.recObject = this.newFile.create(normalizeURL(bestAudioDir + this.siteName + "/" + filename));
            console.log(" file name " + normalizeURL(bestAudioDir + this.siteName + "/" + filename))

          }
          item.isScored = true

          if (recType == 'context') {
            item.isRecordCtx = true
          } else {
            item.isRecord = true
          }
          this.isRecord = true
          this.didRecording = true
          this.slider.lockSwipes(true);
          this.platform.ready().then(() => {
            this.recObject.startRecord();
            console.log(" start record succ has per " + dir + filename)

          })
        })
      }).catch((err) => {
        this.platform.init()
        this.file.createDir(bestAudioDir, this.siteName, true).then((val) => {
          console.log(" file name err val " + val.toURL())
          this.file.createFile(dir, filename, true).then((fe) => {
            console.log(" file name err fe " + fe.toURL())

            if (this.platform.is("ios")) {
              this.recObject = this.newFile.create((bestAudioDir + this.siteName + "/").replace(/^file:\/\//, '') + filename);
              console.log(" file name err " + (bestAudioDir + this.siteName + "/").replace(/^file:\/\//, '') + filename)
            } else {
              this.recObject = this.newFile.create(normalizeURL(fe.toURL()));
              console.log(" file name err " + normalizeURL(dir + filename))
            }
            item.isScored = true

            if (recType == 'context') {
              item.isRecordCtx = true
            } else {
              item.isRecord = true
            }
            this.isRecord = true
            this.didRecording = true
            this.slider.lockSwipes(true);
            this.recObject.onSuccess.subscribe(() => {
              this.recObject.startRecord();
              console.log(" start record err " + dir + filename)
            })
            // this.isRecord = false
            // item.isRecord = false
            // this.recordColor = "danger"
            // this.recordColorCtx = "danger"
            // this.recordIcon = "mic"
            //     this.slider.lockSwipes(false);
          });
        })
      })
    }, 300)
  }

  onPressing(item: Item, recType: string) {

    console.log("interval ")
  }

  isSpinner = false
  endRecord(item: Item, recType: string) {
    //Donot remove. this if condition is needed so that the record button is not executed multiple times and the end record is not executed by swiping the text or moving next
    // because of the long-press directive


    if (this.isRecord) {
      this.recObject.stopRecord()
      this.recObject.release()

      console.log("Stop Recording " + recType)
      this.isRecord = false

      this.recordIcon = "mic"
      let bestAudioDir = this.recUtils.checkPlatform()
      let filename = ''
      let recordId = item.id
      this.recordType = recType
      if (recType == 'context') {
        this.recordColorCtx = "danger"
        filename = item.ctid + '_rec.wav'
        recordId = item.ctid
        //    this.recordTitle="Context"
        //     item.isRecordCtx = false
      } else {
        this.recordColor = "danger"
        //     item.isRecord = false
        filename = item.id + "_rec.wav"
        //   this.recordTitle="Vocab"
      }
      let filePath = bestAudioDir + this.siteName + "/"
      // let ft: FileTransferObject = this.transfer.create();
      //this.isSpinner = false


      this.file.resolveLocalFilesystemUrl(filePath + filename).then(fe => {

        //    this.file.readAsDataURL(filePath, filename).then((dir) => {
        // console.log(" feeed 1 nat " + fe.nativeURL) 
        //      console.log(" feeed 1 nat " + dir) 
        //    // var blob = new Blob([new Uint8Array(dir)], { type: "audio/wav" });
        let fileup = fe.toURL()
        //   if (this.platform.is("ios")) {
        //fileup=fe.nativeURL.substring(7,fe.nativeURL.length)
        fileup = normalizeURL(fe.toURL())
        //  }
        console.log(" file Internal Url " + fileup)

        this.isSpinner = true
        this.auth.postRecording(fileup, recordId, filename)
          // .subscribe((test:any) => {
          //  console.log("Post Record status0 " + test.exid)

          .then((test) => {
            // only execute this if 

            if (test.valid == "OK") {
              this.isSpinner = false
              item.s = (test.score * 100).toFixed(0)
              if (test.isCorrect) {
                item.h.push('Y')
              } else {
                item.h.push('N')
              }
              item.scores.push(test.score)
              console.log("date " + item.timeRecord)
              item.timeRecord = Date.now().toString()
              console.log("date " + item.timeRecord)
              // this.createElement("recordFl" + item.id, test.WORD_TRANSCRIPT)
              this.createElement("recordPh" + recordId, test.PHONE_TRANSCRIPT)
              if (recType == 'context') {
                document.getElementById("recordPh" + item.ctid).hidden = false
                document.getElementById("recordPh" + item.ctid).focus()
              } else {
                document.getElementById("recordPh" + item.id).hidden = false
                document.getElementById("recordPh" + item.id).focus()
              }
              this.scoreGauge(parseInt(item.s), recordId)
              this.playRecord(item, recordId)
              console.log("test score " + test.score)
            } else if (test.valid == "TOO_LOUD") {
              this.isSpinner = false
              this.utils.showAlert("", "Recording too loud.", "Please adjust your microphone and try again ... ")
            } else if (test.valid == "TOO_SHORT") {
              this.isSpinner = false
              this.utils.showAlert("", "Recording too short.", "Please try again ... ")
            } else if (test.valid == "SNR_TOO_LOW") {
              this.isSpinner = false
              this.utils.showAlert("", "Recording volume too low.", "Please try again ... ")
            } else if (test.valid == "TOO_QUIET") {
              this.isSpinner = false
              this.utils.showAlert("", "Recording volume too low.", "Please try again ... ")
            } else if (test.valid == "MIC_DISCONNECTED") {
              this.isSpinner = false
              this.utils.showAlert("", "Please check microphone.", "If still not working restart phone. ")
            } else if (test.valid == "TOO_LONG") {
              this.isSpinner = false
              this.utils.showAlert("", "Recording Too Long", "Please try again. ")
            } else {
              this.isSpinner = false
              this.utils.showAlert("", "Im not sure about the error", "Please try again. ")
            }
            this.slider.lockSwipes(false);
            console.log("Post Record status " + test.valid)

          })
        // .catch((error) => {
        //   this.isSpinner = false
        //   this.slider.lockSwipes(false);
        //   console.error(" Error postRecord " + error)
        // })
      }).catch((error) => {
        this.isSpinner = false
        this.slider.lockSwipes(false);
        console.error("Error scoring recording..." + error)
      })
    }
  }


  // recordTest(item: Item, recType: string){
  //   console.log("Stop Recording " + recType)
  //   this.isRecord = false

  //   this.recordIcon = "mic"
  //  // let bestAudioDir = this.recUtils.checkPlatform()
  //   let filename = ''
  //   let recordId = item.id
  //   this.recordType = recType
  //   if (recType == 'context') {
  //     this.recordColorCtx = "danger"
  //     filename = item.ctid + '_rec.wav'
  //     recordId = item.ctid
  //     //    this.recordTitle="Context"
  //   //  item.isRecordCtx = false
  //   } else {
  //     this.recordColor = "danger"
  //  //   item.isRecord = false
  //     filename = item.id + "_rec.wav"
  //     //   this.recordTitle="Vocab"
  //   }
  //  // let filePath = bestAudioDir + this.siteName + "/"
  //   // let ft: FileTransferObject = this.transfer.create();
  //   this.isSpinner = false

  //   //this.file.resolveLocalFilesystemUrl(filePath + filename).then(fe => {
  // //    console.log(" file Internal Url " + fe.toInternalURL())

  //     //    this.file.readAsDataURL(filePath, filename).then((dir) => {
  //     // console.log(" feeed 1 nat " + fe.nativeURL) 
  //     //      console.log(" feeed 1 nat " + dir) 
  //     //    // var blob = new Blob([new Uint8Array(dir)], { type: "audio/wav" });
  //   //  let fileup = fe.toURL()
  //     //   if (this.platform.is("ios")) {
  //     //fileup=fe.nativeURL.substring(7,fe.nativeURL.length)
  //  //   fileup = normalizeURL(fe.toURL())
  //     //  }
  //     this.isSpinner = true
  //     this.auth.postRecording("", recordId, filename)
  //     //.subscribe((test:any) => {
  //     //  console.log("Post Record status0 " + test.exid)

  //     .then((test) => {
  //         // only execute this if 
  //         this.isSpinner = false
  //         if (test.valid == "OK") {
  //           item.s = (test.score * 100).toFixed(0)
  //           if (test.isCorrect) {
  //             item.h.push('Y')
  //           } else {
  //             item.h.push('N')
  //           }
  //           item.scores.push(test.score)
  //           // this.createElement("recordFl" + item.id, test.WORD_TRANSCRIPT)
  //       //    this.createElement("recordPh" + recordId, test.PHONE_TRANSCRIPT)

  //           //document.getElementById("recordPh" + item.id).hidden = false
  //           //document.getElementById("recordPh" + item.id).focus()
  //     //      this.scoreGauge(parseInt(item.s), recordId)
  //    //       this.playRecord(item, recordId)
  //           console.log("test score " + test.score)
  //         } else if (test.valid == "TOO_LOUD") {
  //           this.utils.showAlert("", "Recording too loud.", "Please adjust your microphone and try again ... ")
  //         } else if (test.valid == "TOO_SHORT") {
  //           this.utils.showAlert("", "Recording too short.", "Please try again ... ")
  //         } else if (test.valid == "SNR_TOO_LOW") {
  //           this.utils.showAlert("", "Recording volume too low.", "Please try again ... ")
  //         } else if (test.valid == "TOO_QUIET") {
  //           this.utils.showAlert("", "Recording volume too low.", "Please try again ... ")
  //         }
  //         this.slider.lockSwipes(false);
  //         console.log("Post Record status " + test.valid)

  //       })
  //       // .catch((error) => {
  //       //   this.isSpinner = false
  //       //   this.slider.lockSwipes(false);
  //       //   console.error(" Error postRecord " + error)
  //       // })

  // }




  playRecord(item, recordId?: string) {
    setTimeout(() => {
      this.recUtils.playRecord(item, this.siteName, recordId)
    }, 300)
  }

  createElement(id, transcript) {
    var subtitles = document.getElementById(id);
    if (subtitles != null) {
      subtitles.innerHTML = ""
      var element;
      try {
        if (transcript != null) {
          for (var i = 0; i < transcript.length; i++) {
            if (transcript[i].event == "sil") continue
            element = document.createElement('span');
            element.setAttribute("id", "c_" + i);
            element.innerHTML = transcript[i].event;
            element.fontSize = "30px"
            if (transcript[i].score < 0.1) {
              element.style.background = "#FF0000";
            } else if (transcript[i].score < 0.2) {
              element.style.background = "#FF5500";
            } else if (transcript[i].score < 0.3) {
              element.style.background = "#FFAA00";
            } else if (transcript[i].score < 0.4) {
              element.style.background = "#FFFF00";
            } else if (transcript[i].score < 0.6) {
              element.style.background = "#88FF00";
            } else if (transcript[i].score < 0.8) {
              element.style.background = "#33FF00";
            } else if (transcript[i].score > 0.8) {
              element.style.background = "#00FF00";
            }
            subtitles.appendChild(element);
          }
        }
      } catch (error) {
        console.log("error create element " + error)
      }
    }

    // change font size and color when audio is played
  }



  stopPlay(item) {
    this.newObject.stop()
    this.newObject.release()
    item.isPlay = false
  }

  pause(item) {
    this.newObject.pause()
  }



  playSlide() {
    //setTimeout(() => {
    if (this.slider) {
      this.slider.freeMode = false;
      var indx = this.slider.getActiveIndex()
      // if more than default 20 items
      if (indx > this.items.length) {
        indx = 1
      } else if (indx == 0) {
        indx = this.itemLength
      }

      var item: Item = this.items[indx - 1]

      if (this.isLastPlayMan) {
        this.man(item, indx)
      } else {
        this.woman(item, indx)
      }
      //  this.scoreGauge(parseInt(item.s), item.id)
    }
  }


  shuffle() {
    this.isShuffle = true
    let indx = this.slider.getActiveIndex()
    this.items = this.utils.randomizeItems(this.items)
    this.slider.initialSlide = indx
    this.slider.loop = true
    this.slider.autoplay = 2000
    this.slider.startAutoplay()
    this.isBoth = false
  }


  //ttsComplete: any
  // textToSpeech(item, id) {
  //   if (this.isLastPlayMan) {
  //    this.man(item, id)
  //   } else {
  //       this.woman(item, id)
  //   }

  // if (this.isBoth) {
  //   //setTimeout(() => {
  //     this.recUtils.textToSpeech(item).then((ret) => {
  //       console.log("Tts complete " + ret)
  //       this.ttsComplete = ret
  //     })
  // //  }, parseInt(this.duration) + 400)
  // }
  //}

  stopShuffle() {
    this.isShuffle = false
    this.slider.stopAutoplay()
  }


  startAutoPlay() {
    this.isAutoPlay = true
    this.slider.freeMode = false;
    this.slider.slidesPerColumn = 1
    //this.slider.startAutoplay()
    if (this.duration == undefined || this.duration == null) {
      this.duration = 1500
    }
    // if (this.selectedCtx) {
    //   this.duration = 4000
    // } else {
    //   this.duration = 2500
    // }
    if (this.isBoth) {
      //  if(this.ttsComplete==true) {
      this.slider.autoplay = parseInt(this.duration) + 1000
      //  } else {
      //     this.slider.stopAutoplay()
      //   }
    } else {

      this.slider.autoplay = parseInt(this.duration) + 300;
    }
    this.utils.presentToast("Please wait while audio being loaded ... ", 2000)
    this.slider.loop = true;
    this.slider.startAutoplay()

    console.log("start autoplay " + this.duration)
  }


  stopAutoPlay() {
    this.isAutoPlay = false
    this.slider.stopAutoplay()
  }

  slideNext() {
    //this.slider.loop = true
    this.slider.slideNext(300)
  }


  swipeEvent(e, item, id) {
    if (e.offsetDirection == 4) {
      this.slidePrevious()
      console.log("slidePrevious")
    } else if (e.offsetDirection == 2) {
      this.slideNext()
      console.log("slideNext")
    }

  }


  // when reach end of items/slides
  getNextItem() {
    let slideIdx = this.slider.getActiveIndex()
    if (this.slider.getActiveIndex() == this.items.length) {
      if (this.allItems.length - this.sliceItems > 20) {
        console.log("sliceitem " + this.sliceItems)
        slideIdx = this.slider.getActiveIndex()
        this.items = this.allItems.slice(0, this.sliceItems + 20)
        this.sliceItems = this.sliceItems + 20
      } else {
        console.log("all sliceitem " + this.sliceItems)

        this.items = this.allItems
      }
    }
    let item: any = this.items[slideIdx]
    console.log(" slide index " + slideIdx + this.items.length)
    if (slideIdx > this.items.length) {
      item = this.items[slideIdx - 2]
    } else if (this.items == this.allItems) {
      item = this.items[slideIdx - 1]
    }
    if (item.s > 0) {
      if (item.scoreJson != "") {
        if (item.scoreJson.words.length != 0) {
          this.createHistoryElement("recordFl" + item.id, item.scoreJson.words)

          this.createHistoryElement("recordPh" + item.id, item.scoreJson.words[0].phones)
          // this.createElement("recordPh" + id, test.PHONE_TRANSCRIPT)
          console.log(" item " + this.items[this.items.indexOf(item)].en)
        }
      }
    }
    console.log("getNextItem")
  }

  slidePrevious() {

    // this.slider.loop = true
    this.slider.slidePrev(300)
  }



  score: any
  createHistoryElement(id: string, transcript) {
    var subtitles = document.getElementById(id);
    subtitles.innerHTML = ""
    var element;
    try {
      for (var i = 0; i < transcript.length; i++) {
        element = document.createElement('span');
        element.setAttribute("id", "c_" + i);
        element.innerHTML = transcript[i].p;
        if (id.startsWith("recordFl")) {
          element.innerHTML = transcript[i].w;
          this.score = (transcript[i].s * 100).toFixed(0)

        }
        element.fontSize = "25px"
        if (transcript[i].s < .1) {
          element.style.background = "#FF0000";
        } else if (transcript[i].s < .2) {
          element.style.background = "#FF5500";
        } else if (transcript[i].s < .3) {
          element.style.background = "#FFAA00";
        } else if (transcript[i].s < .4) {
          element.style.background = "#FFFF00";
        } else if (transcript[i].s < .6) {
          element.style.background = "#88FF00";
        } else if (transcript[i].s < .8) {
          element.style.background = "#33FF00";
        } else if (transcript[i].s > .8) {
          element.style.background = "#00FF00";
        }
        subtitles.appendChild(element);
      }
    } catch (error) {
      console.log("createHistoryElement " + error)
    }

    // change font size and color when audio is played
  }

  // Display the score
  scoreGauge(score: number, id) {

    Highcharts.chart("container" + id, {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: "120px"
      },

      title: {
        text: null
      },

      pane: {
        startAngle: -120,
        endAngle: 120,
        background: [{
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#FFF'],
              [1, '#333']
            ]
          },
          borderWidth: 0,
          outerRadius: '59%'
        }, {
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#333'],
              [1, '#FFF']
            ]
          },
          borderWidth: 1,
          outerRadius: '57%'
        }, {
          // default background
        }, {
          backgroundColor: '#DDD',
          borderWidth: 0,
          outerRadius: '55%',
          innerRadius: '53%'
        }]
      },

      // the value axis
      yAxis: {
        min: 0,
        max: 100,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
          step: 2,
          rotation: 'auto'
        },
        // title: {
        //   text: 'km/h'
        // },
        plotBands: [{
          from: 0,
          to: 30,
          color: '#DF5353'  // red
        }, {
          from: 30,
          to: 60,
          color: '#DDDF0D' // yellow
        }, {
          from: 60,
          to: 100,
          color: '#55BF3B' // green 
        }]
      },

      series: [{
        name: 'Score',
        data: [score],
        tooltip: {
          valueSuffix: '%'
        }
      }]
    })
    //,
    // Add some life
    // function (chart) {
    //   if (!chart.renderer.forExport) {
    //     setInterval(function () {
    //       var point = chart.series[0].points[0],
    //         newVal,
    //         inc = Math.round((Math.random() - 0.5) * 20);

    //       newVal = point.y + inc;
    //       if (newVal < 0 || newVal > 200) {
    //         newVal = point.y - inc;
    //       }

    //       point.update(newVal);

    //     }, 3000);
    //   }
    // })
    console.log("score gauge")
  }
}



