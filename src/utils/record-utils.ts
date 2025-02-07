import { LoadingController, Platform, NavParams, normalizeURL, ItemSliding } from 'ionic-angular'
import { Injectable, ViewChild } from '@angular/core'
import { CommonUtils } from './common-utils'
import { Media, MediaObject, MEDIA_STATUS } from '@ionic-native/media'
import { File, FileEntry } from '@ionic-native/file';
//import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http'
//import * as wavRecorder from '../assets/js/WavAudioEncoder.min.js'
declare var cordova: any;

//declare var wavRecorder

@Injectable()
export class RecordUtils {
  constructor(
    public loadingCtrl: LoadingController,
    public platform: Platform,

    public utils: CommonUtils,
    private audio: Media,
    private newMedia: Media,

    public file: File,
    // public txfr: FileTransfer,
    private tts: TextToSpeech,
    public db: Storage,
    public httpNative: HTTP


  ) {

    // this.item = this.nav.get("item")
    // this.siteName=this.nav.get("siteName")
    // this.items= this.nav.get("items")
    // this.index=this.nav.get("index")
    // this.url = localStorage.getItem("url")

  }

  //newFile:MediaObject =null

  siteName: string
  item: any
  currentItem: any
  items = []
  index: number
  newFile: MediaObject
  nav: NavParams

  downPlay(url: string,item?:any,autoPlay?:boolean) {
    if (this.platform.is("mobileweb") || this.platform.is("core")) {
      this.playDesk(url,item,autoPlay)

    } else {
      this.playMobile(url,item,autoPlay)
      //this.playDesk(url)
      // this.playHTTP(url)
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
      // var x = document.createElement("AUDIO");
      // console.log("success play " + url.replace("https://netprof.ll.mit.edu/netprof", ""))

      //   x.setAttribute("src",url.replace("https://netprof.ll.mit.edu/netprof", ""));

      //   x.setAttribute("autoplay","true")

    } catch (error) {
      console.log("err play " + error)
    }

  }

  playCheckQuiz(correct: boolean) {
    let song: MediaObject = null
    let src = ''
    if (correct) {
      src = "assets/sounds/Correct.wav"
    } else {
      src = "assets/sounds/Incorrect.wav"
    }
    console.log("success play not " + src)
    if (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is("iphone")) {
      // console.log("fe to int url " + fe.toInternalURL())
      song = this.audio.create(src);
      song.play({ numberOfLoops: 1 });
      console.log("success play " + src)
    } else {
      song = this.audio.create(src);
      //for android needed to release first before play
      console.log("success play " + src)
      song.play();
    }
    song.setVolume(1.0)
    // this.showHighlights(song,id,item)
    song.onError.subscribe((err) => console.log('Play Error ' + err.toString(1)));

    song.onSuccess.subscribe(() => {
      song.release()
    },
      err => {
        console.log("Audio Play Error " + JSON.stringify(err));
      }
    );
  
  }

  playMobile(url: string,item?:any, autoPlay?:boolean,audio?: any) {
    let bestAudioDir = this.checkPlatform()
    this.db.get("latestSiteName").then((str) => {
      this.siteName = str

     // let audioPath = url.split("https://10.10.3.215/netprof/", 2);

      let audioPath = url.split("https://netprof.ll.mit.edu/netprof/", 2);
      //let fn = bestAudioDir + audioPath[1];
      //let fn = url
      let audioName = url.substring(url.lastIndexOf('/') + 1);
      console.log("siteName url " + url)
      console.log("siteName path " + audioPath[1])
      console.log("siteName name " + audioName)
      console.log("siteName best " + bestAudioDir)

      let dir = audioPath[1].substr(0, audioPath[1].length - audioName.length)
      console.log("siteName dir " + audioPath[1].substr(0, audioPath[1].length - audioName.length - 1))
      this.platform.ready().then(() => {
        this.file.resolveLocalFilesystemUrl(bestAudioDir + this.siteName + "BestAudio/" + audioName).then((fe) => {

          let sound: MediaObject = null

          if (this.platform.is('ios')) {
            sound = this.audio.create(normalizeURL(bestAudioDir + this.siteName + "BestAudio/" + audioName));

            sound.play();

          } else {
            sound = this.audio.create(fe.toURL());
            sound.play();
          }
          // var mediaTimer = setInterval(()=> {
          //   sound.getCurrentPosition().then((pos)=>{
          //     console.log("duration pos " + pos)
          //   })
          // },400)
          sound.setVolume(1.0)
          //this.showHighlights(sound,id,item)
          sound.onStatusUpdate.subscribe((status) => {
            if (status==4) {
              if (autoPlay){
                this.tts.speak({ text: item.en, locale: 'en-US', rate: 1.5 }).then(()=>{console.log(" speak english ")})
              }  
            console.log('Use existing file ' + (sound.getDuration() * 1000).toFixed(0).toString())
            //if (this.audio.MEDIA_STOPPED) {
            // to return the the value of the duration 
            // this is the only way to get the duration on until i can figure how to do a chain promise

            let duration = (sound.getDuration() * 1000).toFixed(0).toString()
            //  let duration = "11"
            // console.log("duration " + duration)
            localStorage.setItem("duration", duration)    
            }
          })
          sound.onSuccess.subscribe(()=>{
            sound.release()
          })
        }).catch(() => {  // when audio is not saved yet, get from url and download file
          // let ft: FileTransferObject = this.txfr.create();
          let siteId: string = localStorage.getItem('siteid')
          this.file.checkDir(bestAudioDir, this.siteName + 'BestAudio').then((isExist) => {
            this.httpNative.setDataSerializer('urlencoded');
            //this.httpNative.acceptAllCerts(true)
           // this.httpNative.setCookie("cookie",localStorage.getItem("session")) -- causing error ...no need
            this.httpNative.setSSLCertMode("nocheck")
            this.httpNative.downloadFile(url, {}, { "Content-Type": "application/x-www-form-urlencoded", "projid": siteId },
              bestAudioDir + this.siteName + "BestAudio/" + audioName)
              .then((data) => {
                //return string JSON 
                //    JSON.parse(data.data)
                console.log("site2 " + this.siteName)
                console.log("site2 " + audioName)

                let song: MediaObject = null

                if (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is("iphone")) {
                  // console.log("fe to int url " + fe.toInternalURL())
                  song = this.audio.create(normalizeURL(bestAudioDir + this.siteName + "BestAudio/" + audioName));
                  // song.play({ numberOfLoops: 1 });
                  song.play();
                } else {
                  song = this.audio.create(normalizeURL(bestAudioDir + this.siteName + "BestAudio/" + audioName));
                  //for android needed to release first before play
                  
                  song.play();

                }
                song.setVolume(1.0)
                // this.showHighlights(song,id,item)
                song.onError.subscribe((err) => {
                  console.log('Play Error ' + err.toString(1))
                  song.release()
                 });
                song.onStatusUpdate.subscribe((status) => {
                   if (status==4) {
                      if (autoPlay){
                        this.tts.speak({ text: item.en, locale: 'en-US', rate: 1.5 }).then(()=>{console.log(" speak english ")})
                      }  
                   console.log('Save new audio file 0 ' + (song.getDuration() * 1000).toFixed())
                 
                  let duration = (song.getDuration() * 1000).toFixed(0).toString()
                  //  let duration = "11"
                  localStorage.setItem("duration", duration)
                   }
                },
                  err => {
                    console.log("Audio Play Error " + JSON.stringify(err));
                  }
                );
                song.onSuccess.subscribe(()=>{
                  song.release()
                })
               }).catch(() => {
                console.log("errrrr download file" + this.siteName)
              })
          }).catch((err) => {
            console.log("No dir found, creating one " + this.siteName)
           this.file.createDir(bestAudioDir, this.siteName + "BestAudio", false).then((dirEntry) => {
         //   this.file.createFile(bestAudioDir, this.siteName + "BestAudio", true).then((dirEntry) => {

              console.log("dire " + dirEntry.toURL() + audioName)
              this.httpNative.setDataSerializer('urlencoded');
              this.httpNative.setSSLCertMode("nocheck")
              //this.httpNative.acceptAllCerts(true)
           //   this.httpNative.setCookie("cookie",localStorage.getItem("session"))
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
                    song.play();
                  } else {
                    song = this.audio.create(normalizeURL(bestAudioDir + this.siteName + "BestAudio/" + audioName));
                    //for android needed to release first before play
                    song.play();
                   
                  }
                  song.setVolume(1.0)
                  // this.showHighlights(song,id,item)
                  song.onError.subscribe((err) => {
                    console.log('Play Error ' + err.toString(1))
                    song.release()
                   });

                  song.onStatusUpdate.subscribe((status) => {
                    if (status==4){
                    console.log('Save new audio file ' + (song.getDuration() * 1000).toFixed())
                     if (autoPlay){
                        this.tts.speak({ text: item.en, locale: 'en-US', rate: 1.5 }).then(()=>{console.log(" speak english ")})
                      }  
                    let duration = (song.getDuration() * 1000).toFixed(0).toString()
                    //let duration = "11"
                    localStorage.setItem("duration", duration)
                    // song.play({ numberOfLoops: 1 });
                    }
                  },
                    err => {
                      console.log("Audio Play Error " + JSON.stringify(err));
                    }
                  );
                  // this.showHighlights(this.newFile)
                  //       })
                  song.onSuccess.subscribe(()=>{
                    song.release()
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


  downLoadAudio(url: string) {
    return new Promise((resolve, reject) => {
      let bestAudioDir = this.checkPlatform()
      this.db.get("latestSiteName").then((str) => {
        this.siteName = str
        // let audioPath = url.split("https://netprof.ll.mit.edu/netprof/", 2);
        //let fn = bestAudioDir + audioPath[1];
        let audioName = url.substring(url.lastIndexOf('/') + 1);
        console.log("siteName url " + bestAudioDir + this.siteName + "BestAudio/" + audioName)
        let siteId: string = localStorage.getItem('siteid')
        this.file.resolveLocalFilesystemUrl(bestAudioDir + this.siteName + "BestAudio/" + audioName).then((fe) => {

          if (this.platform.is("ios") || this.platform.is("iphone") || this.platform.is("ipad")) {
            resolve(normalizeURL(bestAudioDir + this.siteName + "BestAudio/" + audioName));
          } else {
            console.log(" audio oldload")
            resolve(this.file.readAsDataURL(bestAudioDir + this.siteName + "BestAudio/", audioName));
          }
        }).catch(() => {  // when audio is not saved yet, get from url and download file

          this.httpNative.setDataSerializer('urlencoded');
          this.httpNative.setSSLCertMode("nocheck")
          //this.httpNative.acceptAllCerts(true)
          this.httpNative.downloadFile(url, {}, { "Content-Type": "application/x-www-form-urlencoded", "projid": siteId },
            bestAudioDir + this.siteName + "BestAudio/" + audioName)
            .then((data) => {
              if (this.platform.is("ios") || this.platform.is("iphone") || this.platform.is("ipad")) {
                resolve(normalizeURL(bestAudioDir + this.siteName + "BestAudio/" + audioName));
              } else {
                console.log(" audio load")
                resolve(this.file.readAsDataURL(bestAudioDir + this.siteName + "BestAudio/", audioName));
              }
            })
        })
      })
    })
  }


  checkPlatform() {
    if (this.platform.is("ios") || this.platform.is("iphone") || this.platform.is("ipad")) {  //|| this.platform.is("android") -- for emulator and livereload
      return this.file.dataDirectory;
    } else {
      return this.file.externalDataDirectory;

    }
  }
  textToSpeech(item) {

    if (this.platform.is('core')) {
      return new Promise((resolve, reject) => {
        if ('speechSynthesis' in window) {
          var msg = new SpeechSynthesisUtterance(item.en);
          window.speechSynthesis.speak(msg);
        }
        resolve(true)
      })
    } else {
      return new Promise((resolve, reject) => {
        this.tts.speak({ text: item.en, locale: 'en-US', rate: 1.5 })
          .then((ret) => { resolve(true) })
          .catch((reason: any) => console.log("tts err reason" + reason))
      })
    }
  }

  changeSpeed(item) {
    if (item.selectedSlow) {
      item.selectedSlow = false
    } else {
      item.selectedSlow = true
    }
  }
  record(item) {
    const fs: string = cordova.file.dataDirectory;
    console.log("fs " + fs)
    //let dir = fs + "/" + this.siteName[1]

    this.newFile = this.newMedia.create("documents://audio.wav")
    this.newFile.startRecord();
    item.isRecord = true
  }

  stopRecord(item) {
    this.newFile.stopRecord();
    console.log("stop rec dur " + this.newFile.getDuration())
    let filename = item.id + "_rec.wav"
    let dir = cordova.file.dataDirectory + this.siteName + "/"
    this.platform.ready().then(() => {
      this.file.checkDir(cordova.file.dataDirectory, this.siteName).then((isExist) => {
        this.file.checkFile(dir + "/", filename).then((istrue) => {
          this.file.removeFile(dir + "/", filename).then(() => {
            this.file.copyFile(cordova.file.documentsDirectory, "audio.wav", dir, filename).then(val => { val })
          })
        }).catch(() => {
          this.file.copyFile(cordova.file.documentsDirectory, "audio.wav", dir, filename).then(val => val)
        })
      }).catch(() => {
        this.file.createDir(cordova.file.dataDirectory, this.siteName, false).then((val) => {
          this.file.copyFile(cordova.file.documentsDirectory, "audio.wav", dir, filename).then(val => val)
        })
      })
    })
    item.isRecord = false

  }

  playRecord(item, siteName, recordId?: string) {
    item.isPlay = true
    let bestAudioDir = this.checkPlatform()
    console.log("playrecord replace i " +item.id )
    console.log("playrecord replace r " +recordId )
   
    if (recordId == undefined || recordId == null) {
      recordId = item.id
    }
    
    recordId = item.id
    if (item.selectedCtr && item.isRecordCtx) {
      recordId = item.ctid
    }
    
    let filename = recordId + "_rec.wav"
    let dir = bestAudioDir + siteName + "/"
    this.platform.ready().then((read) => {
      try {
        // this.newObject = this.newFile.create(urlRec + item.id + "_rec.wav")
        let sound: MediaObject = null
        if (this.platform.is("ios") || this.platform.is("iphone") || this.platform.is("ipad")) {
          console.log("playrecord replace" + dir.replace(/^file:\/\//, '') + filename)
          console.log("playrecord split" + dir.split("file://")[1] + filename)
          console.log("playrecord normalize " + normalizeURL(dir.replace(/^file:\/\//, '') + filename))
          sound = this.audio.create(normalizeURL(dir + filename))
          sound.play();
        } else {
          console.log("playrecord normalize " + normalizeURL(dir.replace(/^file:\/\//, '') + filename))
          sound = this.audio.create(dir + filename)
         
          sound.play()
        }
        sound.setVolume(1.0)


        sound.onStatusUpdate.subscribe(() => {
          console.log('Action is successful new file')

          let duration = (sound.getDuration() * 1000).toFixed(0).toString()
          console.log("position dura " + duration);

          sound.getCurrentPosition().then((position) => {
            console.log("position " + position);
          })
        })
        sound.onSuccess.subscribe(()=>{
          sound.release()
        })
       
      } catch (e) {
        console.log('Error with setup media: ' + e);
      }
      //this.newObject.stop()
      //this.newObject.release()

    })
    //this.newFile =new MediaPlugin(cordova.file.dataDirectory  + this.siteName +"/" + item.id +"_rec.wav")
  }

  stopPlay(item) {
    this.newFile.stop()
    item.isPlay = false
  }

  pause(item) {
    this.newFile.pause()
  }

  showHighlights(audio: MediaObject, id, item) {

    // var startPos = 0
    //var endPos, curPos, duration

    // get current playback position
    //duration=audio.getDuration()
    // for (var i = 0; i < wordCount.length; i++) {
    //   audio.getCurrentPosition().then((position) => {
    //     curPos=position
    //     syncData.push({"end": curPos,"start":startPos,"text":wordCount[i]})
    //     startPos=curPos
    //     console.log("pos start " + startPos)
    //     console.log("pos end " + endPos)
    //     console.log("pos " + curPos)
    //     console.log("pos text " + wordCount[i])
    //   });
    // }
    // console.log("syn: dure" + duration)
    // console.log("syn:" + syncData[0].end)
    // console.log("syn:" + syncData[0].start)
    // console.log("syn:" + syncData[0].text)

    this.createElement(id, item)

    var setBackground = (element, color) => element.style.backgroundColor = color,
      last = undefined;
    Array.from(document.getElementsByTagName("SPAN")).forEach((spn) => {
      console.log("spn " + spn)
      // setTimeout(() => {
      //   let pos = audio.getCurrentPosition().then((pos) => {

      //     console.log("spn pos " + pos)

      //     last && setBackground(last, "white");
      //     setBackground((last = spn), "red");
      //     console.log("highlight works")

      //   })
      // }, 300);
      console.log("highlight not works")
    })
  }

  createElement(id, item) {
    try {

      if (this.platform.is("android") || this.platform.is("ios")) {
        let wordCount = []
        let flCount = []
        if (item.ct != "") {
          if (this.siteName == "Mandarin" || this.siteName == "Korean" || this.siteName == "Japanese") {
            wordCount = item.ct.split('')
            flCount = item.fl.split('""')
          } else {
            wordCount = item.ct.split(" ")
            flCount = item.fl.split(" ")
          }
          var subtitles = document.getElementById(id);
          if (subtitles!=null) {
          subtitles.innerText = ""
          var element;
          for (var i = 0; i < wordCount.length; i++) {
            element = document.createElement('span');
            element.setAttribute("id", "c_" + i);
            element.innerText = wordCount[i] + " ";

            for (var j = 0; j < flCount.length; j++) {
              // for arabic
              if (this.siteName == "MSA" || this.siteName == "Urdu" || this.siteName == "Egyptian" || this.siteName == "Pashto1") {
                wordCount[i] = this.removeDhabt(wordCount[i])
                flCount[j] == this.removeDhabt(flCount[j])
              }
              if (this.removePuctuations(wordCount[i]) == this.removePuctuations(flCount[j])) {
                element.style.color = "green";
                element.fontSize = "35px"
                break
              } else {
                element.style.color = "blue";
              }
            }
            subtitles.appendChild(element);
          }
        }
          // change font size and color when audio is played
        }
      }
    } catch (error) {
      console.log(" createElement " + error)
    }
  }


  removePuctuations(str: string) {
    // return str.replace(/(?!\w|).\s/g,"").toLowerCase();
    return str.replace(/(?!\w|\s)./g, '').toLowerCase()

    //return str.replace(/[.,?\/#!$\^\*;:{}=\-_`~()]/g,"").toLowerCase();
  }


  removeSpecialChars(str: string) {

    return str.replace(/(?!\w|\s)./g, '')
      .replace(/\s+/g, ' ')
      .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2')
      .replace(/ِ|ُ|ٓ|ٰ|ْ|ٌ|ٍ|ً|ّ|َ/g, '').toLocaleLowerCase();
  }


  removeDhabt(s) {

    //unicode
    //  /Ѐ-ӾԀ-\u052e\u0600-۾\u08a0-\u08fe\u2de0-\u2dfe\u3000-〾\u3040-ゞ゠-ヾꙀ-\ua69e/g
    return s.replace(/ِ|ُ|ٓ|ٰ|ْ|ٌ|ٍ|ً|ّ|َ/g, '')
      .replace("«", '')
      .replace("»", '')
      .replace("'", '')
      .replace(",", '')
      .replace(".", '')
      .replace("!", '')
      .replace("?", '')
      .replace("@", '')
      .replace('"', '').toLocaleLowerCase()
   }
  
//   startRecordingProcess() {
//     var audioContext = new AudioContext;
//   let processor = audioContext.createScriptProcessor(1024, 2, 2);
//   input.connect(processor);

//   processor.connect(audioContext.destination);
//   if (encodingProcess === 'direct') {
//     let encoder = new wavRecorder(audioContext.sampleRate, 2);
//     processor.onaudioprocess = function(event) {
//       encoder.encode(getBuffers(event));
//     };
//   } else {
//     worker.postMessage({
//       command: 'start',
//       process: encodingProcess,
//       sampleRate: audioContext.sampleRate,
//       numChannels: 2
//     });
//     processor.onaudioprocess = function(event) {
//       worker.postMessage({ command: 'record', buffers: getBuffers(event) });
//     };
//   }
// }

// function stopRecordingProcess(finish) {
//   input.disconnect();
//   processor.disconnect();
//   if (encodingProcess === 'direct')
//     if (finish)
//       saveRecording(encoder.finish());
//     else
//       encoder.cancel();
//   else
//     worker.postMessage({ command: finish ? 'finish' : 'cancel' });
// }

// // recording buttons interface
// var startTime = null    // null indicates recording is stopped

// function minSecStr(n) { return (n < 10 ? "0" : "") + n; }

// function updateDateTime() {
//   $dateTime.html((new Date).toString());
//   if (startTime != null) {
//     var sec = Math.floor((Date.now() - startTime) / 1000);
//     $timeDisplay.html(minSecStr(sec / 60 | 0) + ":" + minSecStr(sec % 60));
//   }
// }

//   }
// window.setInterval(updateDateTime, 200);
}