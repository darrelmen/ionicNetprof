import { Component, ViewChild,NgModule} from '@angular/core';
import { ViewController, Slides, Platform, NavParams, NavController, normalizeURL } from 'ionic-angular';
import { CommonUtils } from '../../utils/common-utils'
import { RecordUtils } from '../../utils/record-utils';
import { AuthService } from '../../providers/auth-service/auth-service';
//import { RecordUtils } from '../../utils/record-utils'
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Media, MediaObject } from '@ionic-native/media';
import { Item } from '../../model/item'
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
  sliceItems: number = 20

  url: string
  siteName: string
  item: Item
  currentItem: any
  index: number
  itemLength = 0

  selectedSlow = false
  isShuffle = false
  isAutoPlay = false
  isBoth = false
  isEnglish=false
  isContext=true
  isRecord = false
  // check whether a recording was done when visiting the page
  didRecording = false

  newObject: MediaObject
  recObject: MediaObject
  @ViewChild('mySlider') slider: Slides;
  recordIcon = "mic";
  recordColor = "danger"
  recordTitle = ""
  rtl: string
  params: any
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
    public transfer: FileTransfer,
    public file: File) {
    this.params = this.navParam.get("_params")
    this.item = this.params.item
    this.siteName = this.params.siteName
    this.items = this.params.items
    this.rtl = this.params.rtl
    this.allItems = this.items

    this.index = this.items.indexOf(this.item)

    if (this.items.length > 20) {
      if (this.index > 20) {
        this.items = this.allItems.slice(0, this.index + 1)
        this.sliceItems = this.index

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
  }
  callback: any
  ionViewWillEnter() {
    this.callback = this.navParam.get("callback")
  }
  close() {
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
      this.auth.getScores(lesson).then((lessonScores:any) => {
        //filtered vs non filtered selection
        if (lessonScores.scores.length > 0) {
          //this is how to combine 2 arrays with matching ids
          this.items = this.items.map(x => Object.assign(x, lessonScores.scores.find(y => y.ex == x.id)));
        } else {
          this.items = this.allItems.map(x => Object.assign(x, this.items.find(y => y.id == x.id)));
        }

        let lastCorrect = lessonScores.lastCorrect
        let lastIncorrect = lessonScores.lastIncorrect
        let noRecording = this.allItems.length - Number(lastCorrect) - Number(lastIncorrect)

        this.params = this.params = { items: this.items, lastCorrect: lastCorrect, lastIncorrect: lastIncorrect, noRecording: noRecording }
        this.callback(this.params).then(() => {
          this.nav.popToRoot();
        })
      })
    } else {
      this.nav.popToRoot();
    }
  }



  ngAfterViewInit() {
    // this.downloadMultipleAudio()
    this.slider.freeMode = true;
    this.slider.initialSlide = this.index
    this.slider.speed = 500
    this.slider.loop = true
    this.slider.paginationType = "fraction"
    this.slider.pager = true
    this.slider.shortSwipes = true
    this.slider.centeredSlides = true;
  }

  downloadMultipleAudio() {
    this.items.forEach((item) => {
      console.log(" test" + this.file.dataDirectory + this.siteName + "/bestAudio/" + item.id)
      this.file.checkDir(this.file.dataDirectory, this.siteName + "/bestAudio/" + item.id)
        .then((isExist) => {
          if (isExist) {
          } else {
            console.log("is not exist  " + item.fl)
            this.downloadAudio(item.mrr)
          }
        })
        .catch(() => {
          console.log("copy audio ")
          this.downloadAudio(item.mrr)
        });

      this.file.checkDir(this.file.dataDirectory + this.siteName + "/bestAudio", item.id)
        .then((isExist) => {
          if (isExist) {
          } else {
            console.log("is exist  " + item.ct)
            this.downloadAudio(item.ctmref)
          }
        }).catch(() => {
          console.log("copy audio ")
          this.downloadAudio(item.ctmref)
        });
    })
  }

  downloadAudio(audio) {
    this.platform.ready().then(() => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      var audioLocation = this.url + "/" + audio;
      this.file.checkDir(this.file.dataDirectory, this.siteName).then((isExist) => {
        fileTransfer.download(audioLocation, this.file.dataDirectory + this.siteName + "/" + audio).then((entry) => { }
          , (error) => {
            console.log("dowload  " + error)
          });

      }).catch(() => {
        this.file.createDir(this.file.dataDirectory, this.siteName, true).then((val) => {
          console.log("create dowload  " + this.file.dataDirectory, this.siteName)
          fileTransfer.download(audioLocation, this.file.dataDirectory + this.siteName + "/" + audio).then((entry) => { }
            , (error) => {
              console.log("dowload  " + error)
            });
        })
      })
    });
  }


  man(item, id) {
    var urlDown: any
    if (item.mrr == "") {
      this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.fl)
    } else {
      this.platform.ready().then((read) => {
        this.recUtils.createElement(item.id, item)
        if (this.selectedSlow) {
          this.recUtils.downPlay(this.url + "/" + item.fsr)
          this.duration = localStorage.getItem("duration")
        } else {
          this.recUtils.downPlay(this.url + "/" + item.frr)
          this.duration = localStorage.getItem("duration")
          //this.audio.nativeElement.src = this.url + "/" + item.frr
        }
      })
    }
  }

  woman(item, id) {
    if (item.frr == "") {
      //  this.man(item)
      // this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.fl)
    } else {
      this.recUtils.createElement(item.id, item)
      // this.recUtils.downPlay(this.url + "/" + item.frr).subscribe((duration)=> {
      //   this.duration =duration
      //   console.log("duration  " + duration)
      //  })
      if (this.selectedSlow) {
        this.recUtils.downPlay(this.url + "/" + item.fsr)
        this.duration = localStorage.getItem("duration")
      } else {
        this.recUtils.downPlay(this.url + "/" + item.frr)
        this.duration = localStorage.getItem("duration")
        //this.audio.nativeElement.src = this.url + "/" + item.frr
      }
    }
  }


  contextItem(item) {
    if (item.selectedCtr) {
      item.selectedCtr = false
    } else {
      item.selectedCtr = true
    }
  }

  context(item, id) {
    if (item.ctmref == "NO") {
      this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.ct)
    } else {
      // this.utils.showAlert("", "Context Sentence...", item.ct)
      //this.audio.nativeElement.src = this.url + "/" + item.ctmref
      this.recUtils.createElement(item.id, item)
      this.recUtils.downPlay(this.url + "/" + item.ctmref)
      this.duration = localStorage.getItem("duration")
    }
  }

  englishLabel="Show English"
  contextLabel="Hide Context"
  toggleEnglish() {
    if (this.isEnglish) {
      this.isEnglish = false
      this.englishLabel="Show English"
    } else {
      this.isEnglish = true
      this.englishLabel="Hide English"
    }
  }

  toggleContext() {
    if (this.isContext) {
      this.isContext = false
      this.contextLabel="Show Context"
    } else {
      this.isContext = true
      this.contextLabel="Hide Context"
    }
  }

  playEnglish(item) {
    this.recUtils.textToSpeech(item)
  }

  record(item) {
    this.recordColor = "light"
    this.recordIcon = "radio-button-on"
    this.recordColor = "light"
    this.recordTitle = ""
    let bestAudioDir = this.recUtils.checkPlatform()
    let filename = item.id + '_rec.wav'
    let dir = bestAudioDir + this.siteName + "/"
    this.platform.ready().then(() => {
      this.file.checkDir(bestAudioDir, this.siteName).then((isExist) => {
        this.file.createFile(dir, filename, true).then(() => {
          if (this.platform.is("ios")) {
            this.recObject = this.newFile.create((bestAudioDir + this.siteName + "/").replace(/^file:\/\//, '') + filename);
          } else {
            this.recObject = this.newFile.create(bestAudioDir + this.siteName + "/" + filename);

          }
          this.recObject.startRecord();
          console.log(" start record succ " + dir + filename)
        });
      }).catch(() => {
        this.file.createDir(bestAudioDir, this.siteName, false).then((val) => {
          this.file.createFile(dir, filename, true).then(() => {
            if (this.platform.is("ios")) {
              this.recObject = this.newFile.create(dir.replace(/^file:\/\//, '') + filename);
            } else {
              this.recObject = this.newFile.create(dir + filename);
            }
            this.recObject.startRecord();
            console.log(" start record err " + dir + filename)
          });
        })
      })
    })
    item.isScored = true
    item.isRecord = true
    this.isRecord = true
    this.didRecording = true
    this.slider.lockSwipes(true);
  }

 

  pressRecord() {
    console.log("Start record")
    this.recordColor = "light"
    this.recordIcon = "radio-button-on"
    this.recordColor = "light"
    this.recordTitle = ""
  }

  recordIos(item: Item) {
    // let bestAudioDir = this.recUtils.checkPlatform()
    // let filename = item.id + "_rec.wav"
    // let dir = bestAudioDir + this.siteName + "/"
    // this.platform.ready().then(() => {
    //   this.file.checkDir(bestAudioDir, this.siteName).then((isExist) => {
    //     this.file.createFile(this.file.tempDirectory, 'my_file.wav', true).then(() => {
    //       this.recObject = this.newFile.create(this.file.tempDirectory.replace(/^file:\/\//, '') + 'my_file.wav');
    //       this.recObject.startRecord();
    //     });
    //     // this.file.createFile(dir, filename, true).then(() => {
    //     //   this.recObject = this.newFile.create(dir + filename);
    //     //   console.log (" start record succ " + dir + filename)
    //     //   this.recObject.startRecord();
    //     // });
    //   }).catch(() => {
    //     this.file.createDir(bestAudioDir, this.siteName, false).then((val) => {
    //       this.file.createFile(this.file.tempDirectory, 'my_file.wav', true).then(() => {
    //         this.recObject = this.newFile.create(this.file.tempDirectory.replace(/^file:\/\//, '') + 'my_file.wav');
    //         this.recObject.startRecord();
    //       });
    //     })
    //   })
    // })

    this.recObject = this.newFile.create("documents://audio.wav")

    this.recObject.startRecord();
    this.isRecord = true
    item.isScored = true
    item.isRecord = true
    //for IOS
    //  this.file.createFile(this.file.tempDirectory, 'my_file.wav', true).then(() => {
    //   this.recObject = this.newFile.create(this.file.tempDirectory.replace(/^file:\/\//, '') + 'my_file.wav');
    //   this.recObject.startRecord();
    //  // window.setTimeout(() => mediaObj.stopRecord(), 10000);
    //});

  }


  isSpinner = false
  endRecord(item: Item) {
    //  this.recObject.stopRecord();
    //   console.log("stop rec dur " + this.newObject.getDuration())
    //   let filename = item.id + "_rec.wav"
    //   let dir = this.file.dataDirectory + this.siteName + "/"
    //   this.platform.ready().then(() => {
    //     this.file.checkDir(this.file.dataDirectory, this.siteName).then((isExist) => {
    //       this.file.checkFile(dir + "/", filename).then((istrue) => {
    //         this.file.removeFile(dir + "/", filename).then(() => {
    //           this.file.copyFile(this.file.documentsDirectory, "audio.wav", dir, filename).then(val => { val })
    //         })
    //       }).catch(() => {
    //         this.file.copyFile(this.file.documentsDirectory, "audio.wav", dir, filename).then(val => val)
    //       })
    //     }).catch(() => {
    //       this.file.createDir(this.file.dataDirectory, this.siteName, false).then((val) => {
    //         this.file.copyFile(this.file.documentsDirectory, "audio.wav", dir, filename).then(val => val)
    //       })
    //     })
    //   })
    //this.recObject.onSuccess.subscribe(() => {
    //  if (item.isRecord) {

    this.recObject.stopRecord()
    //released done on WavRecorder on custom cordova
    console.log("Stop Recording")
    this.isRecord = false
    item.isRecord = false
    this.isSpinner = true
    this.recordColor = "danger"
    this.recordIcon = "mic"
    this.recordTitle = ""
    let bestAudioDir = this.recUtils.checkPlatform()
    let filename = item.id + "_rec.wav"
    let filePath = bestAudioDir + this.siteName + "/"
    let ft: FileTransferObject = this.transfer.create();
    this.file.resolveLocalFilesystemUrl(filePath + filename).then(fe => {
      this.file.readAsBinaryString(filePath, filename).then((dir) => {
        this.auth.postRecording(fe.toURL(), item.id, dir.length.toString(), filename)
          .then((test) => {
            item.s = (test.score * 100).toFixed(0)
            if (test.isCorrect) {
              item.h.push('Y')
            } else {
              item.h.push('N')
            }
            this.isSpinner = false
            item.scores.push(test.score)
            this.createElement("recordFl" + item.id, test.WORD_TRANSCRIPT)
            this.createElement("recordPh" + item.id, test.PHONE_TRANSCRIPT)
            console.log(" test " + test.score)

            this.slider.lockSwipes(false);
          })
      })
    })

    //  }
    // let bestAudioDir = this.recUtils.checkPlatform()
    // let filename = item.id + "_rec.wav"
    // let dir = bestAudioDir + this.siteName + "/"
    // console.log('Action is successful record ' + dir + filename)
    // this.file.readAsDataURL(dir, filename).then((file) => {
    //   console.log( "file " + dir + filename)
    //    this.auth.postRecording(dir + filename, item.id)
    //     .subscribe((test) => {
    //       console.log(" test " + test)
    //     })
    //   })
    // file upload can also be used but slower
    // const fileTransfer: FileTransferObject = this.transfer.create();
    // let options: FileUploadOptions = {
    //   fileKey: 'file',
    //   fileName: 'name.wav',
    //   headers: {"Content-Type": "undefined","user": "171","deviceType":"Android","device": "1221","exercise": item.id,"request": "decode","reqid": "1"},
    //   mimeType:"audio/x-wav", 
    // var recordFile = dir + filename
    // fileTransfer.upload(recordFile,"https://np.ll.mit.edu/npfClassroomCM/scoreServlet",options,true).then((data) => {
    //   console.log(" data upload " + data)
    // }, (err) => {
    //   console.log(" data upload err " + err)
    //   // error
    // })
    // })
  }


  playRecord(item) {
    this.recUtils.playRecord(item, this.siteName)

  }

  createElement(id, transcript) {
    var subtitles = document.getElementById(id);
    subtitles.innerHTML = ""
    var element;
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

      var indx = this.slider.getActiveIndex()
      if (indx > this.itemLength) {
        indx = 1
      } else if (indx == 0) {
        indx = this.itemLength
      }
      // to get the duration during autoplay
      if (this.isAutoPlay) {
        this.slider.autoplay = parseInt(this.duration) + 500
        console.log("autoplay " + this.duration)
      }
      var item: Item = this.items[indx - 1]
      this.textToSpeech(item, indx)
    }
  }

  shuffle() {
    this.isShuffle = true
    let indx = this.slider.getActiveIndex()
    this.items = this.utils.randomizeItems(this.items)
    this.slider.initialSlide = indx
    this.slider.loop = true
    this.slider.autoplay = 1000
    this.slider.startAutoplay()
    this.isBoth = false
  }

  duration: any
  ttsComplete: any
  textToSpeech(item, id) {
    this.woman(item, id)
    if (this.isBoth) {
      setTimeout(() => {
        this.recUtils.textToSpeech(item).then((ret) => {
          console.log("Tts complete " + ret)
          this.ttsComplete = ret
        })
      }, parseInt(this.duration) + 100)
    }
  }

  stopShuffle() {
    this.isShuffle = false
    this.slider.stopAutoplay()
  }


  startAutoPlay() {
    this.isAutoPlay = true
    this.slider.freeMode = true;
    //this.slider.startAutoplay()
    if (this.isBoth) {
      //  if(this.ttsComplete==true) {
      this.slider.autoplay = parseInt(this.duration) + 3000
      //  } else {
      //     this.slider.stopAutoplay()
      //   }
    } else {
      this.slider.autoplay = parseInt(this.duration) + 300;
    }
    if (this.duration == undefined) 2500
    this.slider.loop = true;
    this.slider.startAutoplay()
    console.log("start autoplay " + this.duration)
  }

  stopAutoPlay() {
    this.isAutoPlay = false
    this.slider.stopAutoplay()
  }

  slideNext() {
    //this.newObject.stop()
    // this.newObject.release()
    // this.getNextItem()
    this.slider.loop = true
    this.slider.slideNext(300)
  }


  swipeEvent(e) {
    if (e.offsetDirection == 4) {
      this.slidePrevious()
      console.log("slidePrevious")
    } else if (e.offsetDirection == 2) {
      this.slideNext()
      console.log("slideNext")
    }

  }

  getNextItem() {
    if (this.slider.getActiveIndex() == this.items.length) {
      if (this.allItems.length - this.sliceItems > 20) {
        this.items = this.items.slice(0, this.sliceItems + 20)
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
    // this.newObject.stop()
    //   this.newObject.release()
    // let item: any = this.items[this.slider.getActiveIndex()]
    // if (item.s > 0) {
    //   if (item.scoreJson != "") {
    //     if (item.scoreJson.words.length != 0) {
    //       this.createHistoryElement("recordFl" + this.slider.getActiveIndex(), item.scoreJson.words)

    //       this.createHistoryElement("recordPh" + this.slider.getActiveIndex(), item.scoreJson.words[0].phones)
    //       // this.createElement("recordPh" + id, test.PHONE_TRANSCRIPT)
    //       console.log(" item " + this.items[this.slider.getActiveIndex()].en)
    //     }
    //   }
    // }
    this.slider.loop = true
    this.slider.slidePrev(300)
  }

  changeSpeed() {
    if (this.selectedSlow) {
      this.selectedSlow = false
    } else {
      this.selectedSlow = true
    }
    this.playSlide()
  }
  both() {
    if (this.isBoth == true) {
      this.isBoth = false
    } else {
      this.isBoth = true
    }
    this.playSlide()
  }

  score: any
  createHistoryElement(id: string, transcript) {
    var subtitles = document.getElementById(id);
    subtitles.innerHTML = ""
    var element;

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


    // change font size and color when audio is played
  }

}



