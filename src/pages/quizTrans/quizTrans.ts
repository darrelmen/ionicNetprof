import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { Item } from '../../model/item';
import { Storage } from '@ionic/storage';
import { RecordUtils } from '../../utils/record-utils';
import { CommonUtils } from '../../utils/common-utils';
import WaveSurfer from 'wavesurfer.js';
import { File, FileEntry } from '@ionic-native/file';

@Component({
	selector: 'page-quizTrans',
	templateUrl: 'quizTrans.html'
})
export class QuizTransPage {

	@ViewChild('slides') slides: any;
	hasAnswered: boolean = false;
	score: number = 0;
	testItems = 5
	testMax=100
	slideOptions: any;
	public questions = []
	url: string
	items: Array<Item>;
	transOpt: any = "scribeContext"
	isNotPlay:boolean = true

	constructor(public navCtrl: NavController, public db: Storage, public recUtils: RecordUtils, public alertCtrl: AlertController,
		public utils: CommonUtils, public platform: Platform,public file:File) {

		this.db.get("items").then((items: Array<Item>) => {
			this.items = items
			if (items.length > 100) {
				this.testMax = 100
			} else {
				this.testMax = items.length
			}
			this.db.get("url").then((url) => this.url = url)
		})
		this.db.get("latestSiteName").then((site) => {
			console.log("latest " + site)
			this.siteName = site
		})
		this.theme = localStorage.getItem("theme")
	}
	theme: string

	flash: any;
	createTitle(index) {

		try {
		
		//this.flash=str;
		if (index > 0 && index < this.questions.length) {
			var el = document.getElementById('flashMsg' + index);
			var str: string = null

			var inst = "( Red means - error. ".fontcolor("red") + "Green - correct. ".fontcolor("green") + "Black - missing. )".fontcolor("black");

			if (this.transOpt == "translaVocab") {
				str = "Translate the " + this.testItems + " vocabulary word/s to English. " + inst
			} else if (this.transOpt == "translaContext") {
				str = "Translate the " + this.testItems + " context sentences to English. " + inst
			} else if (this.transOpt == "scribeVocab") {
				str = "Transcribe the " + this.testItems + " vocabulary word/s. " + inst
			} else if (this.transOpt == "scribeContext") {
				str = "Transcribe the " + this.testItems + " context sentences. " + inst
			}
			el.style.fontSize = "15px"
			el.innerHTML = str
		}
	
	} catch (error) {
		console.error("create title " + error)	
	}
	}

	isCorrect = 1
	inputValue = ""
	checkFlashCard(inputTxt, itemVal, index) {
		try {
			if (inputTxt != "") {
				let inpCleantxt = inputTxt.replace(/[.!?,@+&$#*-=]/gi, " ").split(" ")
				let arrItem = itemVal.replace(/[.!?,@+&$#*-=]/gi, " ").split(" ")

				if (this.siteName == "Mandarin" || this.siteName == "Korean" || this.siteName == "Japanese") {
					inpCleantxt = inputTxt.replace(/[.!?,@+&$#*-=]/gi, " ").split("")
					arrItem = itemVal.replace(/[.!?,@+&$#*-=]/gi, " ").split("")
				}

				var answer = ""
				//this.answer.nativeElement
				var el = document.getElementById(index);
				if (itemVal != "") {
					// inpCtxt.forEach(function (item, index) {
					//   if (arrItem[index].toLowerCase() != item.toLowerCase()) {
					//     //TODO item
					//     answer = answer + item.fontcolor("red") + " "
					//   } else {
					//     answer = answer + item + " "
					//   }
					// })
					let inpTotal = inpCleantxt.length
					this.isCorrect = 0
					let x = 0
					arrItem.forEach(function (item, index) {

						if (index < inpTotal) {
							if (inpCleantxt[index].toLowerCase() != item.toLowerCase()) {
								answer = answer + inpCleantxt[index].fontcolor("red") + " "
								x++
							} else {
								answer = answer + item.fontcolor("green") + " "
							}
						} else {
							answer = answer + " (" + item + ") "
						}
					})
					this.isCorrect = x
				}
				el.innerHTML = answer
			}
		} catch (error) {
			console.error("waveForm error " + error)
		}
	}




	ionViewDidLoad() {
		this.slides.slideTo(0, 1000)
		this.slides.lockSwipeToNext(true)
		this.slides.lockSwipes(true);
	}

	siteName: string

	startSlide() {
		this.restartQuiz()
	}

	nextSlide(inputValue, item, i) {

		this.checkFlashCard(inputValue, item, i)

		if (this.isCorrect == 0) {
			this.score++
		}
		this.isNotPlay = true
		this.inputValue = ""
		this.createTitle(i + 1)
		this.slides.lockSwipes(false);
		this.slides.slideNext();
		this.slides.lockSwipes(true);


	}


	restartQuiz() {
		this.questions = []
		this.score = 0;
		var count = 0
		this.items = this.utils.randomizeItems(this.items)

		for (let item of this.items) {
			if ((item.ct == "" && this.transOpt == "scribeContext") || (item.ct == "" && this.transOpt == "translaContext")) continue;
			if (count == this.testItems) break;
			count++
			//  q.wordsRightOrder = wordsRightOrder
			this.questions.push(item)
		}
		this.slides.lockSwipes(false);
		this.slides.slideTo(1, 1000);
		this.slides.lockSwipes(true);
	}

	showAnswer(item) {
		let words: string = ""
		if (this.transOpt == "scribeContext" || this.transOpt == "translaContext") {
			words = item.ct
		} else {
			words = item.fl
		}

		this.utils.presentToast(words, 2000)
		this.db.get("url").then((url) => {
            this.recUtils.downPlay(url + "/" + words)
        })
	}

	
	// context(item, id, event?) {
	// 	if (item.ctmref == "NO") {
	// 		this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.ct)
	// 	} else {

	// 		//if (this.opts == "search") {
	// 		//  let contx = item.ct
	// 		//  this.utils.showAlert("", "Context Sentence...", contx.fontcolor("blue") + " (" + item.ctr + ")")
	// 		//}
	// 		// //if (this.activeItem != item.ctmref) {
	// 		this.platform.ready().then(() => {
	// 			this.recUtils.downPlay(this.url + "/" + item.ctmref)
	// 		})
	// 		//this.newFile = new MediaPlugin(this.url + "/" + item.ctmref)
	// 		//  this.activeItem = item.ctmref
	// 		//}
	// 		//his.audio.nativeElement.src = this.url + "/" + item.ctmref
	// 		//this.audio.nativeElement.play();
	// 	}
	// 	this.recUtils.createElement(id, item)

	// }

	
	playWave() {
		//this.wavesurfer.on('ready', function () {
			console.log("wave ")
			this.wavesurfer.play()
		//});
		
		this.isNotPlay = false
			this.wavesurfer.on('finish', function ()  {
				//this.isNotPlay = true
				console.log("wave end ")
				return true
			});
		
		
	}
	pauseWave() {
		this.wavesurfer.pause();
		this.isNotPlay = true
	}

	wavesurfer: any
	loadWaveform() {

		let index = this.slides.getActiveIndex() - 1
		let waveid = '#waveform' + index
		if (this.transOpt == "scribeContext" && index < this.testItems) {
			let options = {
				container: waveid,
				waveColor: 'violet',
				progressColor: 'blue'
			}
			try {
				let item = this.questions[index]
				this.wavesurfer = WaveSurfer.create(options);

				this.platform.ready().then(() => {
					if (this.platform.is("iphone") || this.platform.is("ipad")) {
						this.recUtils.downLoadAudio(this.url + "/" + item.ctmref).then((url) => {
							this.wavesurfer.load(url);
						})
					} else if (this.platform.is("core") || this.platform.is("mobileweb")) {
						console.log("scribe Context " + "/" + item.ctmref)

						this.wavesurfer.load( "/" + item.ctmref)
					} else {
						
						this.recUtils.downLoadAudio(this.url + "/" + item.ctmref).then((url) => {
					  		this.wavesurfer.load(url);
						})
					}
				})

			} catch (error) {
				console.error("waveForm error " + error)
			}
		} else if (this.transOpt == "scribeVocab" && index < this.testItems) {
			let options = {
				container: waveid,
				waveColor: 'violet',
				progressColor: 'green'
			}
			try {
				let item = this.questions[index]
				this.wavesurfer = WaveSurfer.create(options);
				this.platform.ready().then(() => {
					if (this.platform.is("ios") || this.platform.is("iphone") || this.platform.is("ipad")) {
						this.recUtils.downLoadAudio(this.url + "/" + item.mrr).then((url) => {
							this.wavesurfer.load(url);
						})
					} else if (this.platform.is("core") || this.platform.is("mobileweb")) {
						this.wavesurfer.load("/" + item.mrr)
					} else {
						this.recUtils.downLoadAudio(this.url + "/" + item.mrr).then((url) => {
							this.wavesurfer.load(url);
						})
					}
				})
			} catch (error) {
				console.error("waveForm error " + error)
			}

		}

	}


	// duration: any = 0
	// man(item, id, event?) {
	// 	if (item.mrr == "") {
	// 		this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.fl)
	// 	} else {

	// 		if (item.selectedCtr == true) {
	// 			if (item.ctmref == "NO") {
	// 				this.utils.showAlert("", "Audio not Found!", "There is no audio recording for : " + item.ct)
	// 			} else {
	// 				let contx = item.ct
	// 				// this.utils.showAlert("", "Context Sentence...", contx.fontcolor("blue") + " (" + item.ctr + ")")
	// 				//this.newFile = new MediaPlugin(this.url + "/" + item.ctmref)
	// 				this.platform.ready().then(() => {
	// 					this.recUtils.downPlay(this.url + "/" + item.ctmref)
	// 				})
	// 				//this.audio.nativeElement.src = this.url + "/" + item.ctmref
	// 			}

	// 		} else {
	// 			// if (this.activeItem != item.msr) {
	// 			if (item.selectedSlow) {
	// 				this.platform.ready().then(() => {
	// 					this.recUtils.downPlay(this.url + "/" + item.msr)
	// 				})

	// 			} else {
	// 				this.platform.ready().then(() => {
	// 					this.recUtils.downPlay(this.url + "/" + item.mrr)
	// 				})
	// 			}
	// 			//   this.activeItem = item.msr
	// 			// }
	// 		}
	// 		this.recUtils.createElement(id, item)
	// 		//this.audio.nativeElement.play();
	// 		item.isPlay = true

	// 	}

	// }
}