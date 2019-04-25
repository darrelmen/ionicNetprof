import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Question } from '../../model/question';
import { Item } from '../../model/item';
import { Answer } from '../../model/answer';
import { Storage } from '@ionic/storage';
import { RecordUtils } from '../../utils/record-utils';
import { CommonUtils } from '../../utils/common-utils';

@Component({
	selector: 'page-quizFill',
	templateUrl: 'quizFill.html'
})
export class QuizFillPage {
	@ViewChild("audio") audio;
	@ViewChild('slides') slides: any;
	hasAnswered: boolean = false;
	score: number = 0;
	testItems = 5
	testMax: number
	slideOptions: any;
	quizSection: string = ''
	questions: Array<Question> = []
	url: string
	items: Array<Item>;
	
	constructor(public navCtrl: NavController, public db: Storage, public recUtils: RecordUtils, public utils: CommonUtils) {

		this.db.get("items").then((items: Array<Item>) => {
			this.items = []
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
		this.db.get("quizSection").then((quiz) => this.quizSection = quiz)


		this.theme = localStorage.getItem("theme")
		if (this.theme == null) this.theme = "primary"
	}
	theme: string

	ionViewWillEnter() {
			this.db.get("items").then((items: Array<Item>) => {
				this.items = []
				this.items = items
				if (items.length > 100) {
					this.testMax = 100
				} else {
					this.testMax = items.length
				}
				console.log(" items length " + this.items.length)
				this.db.get("url").then((url) => this.url = url)
			})
			this.db.get("latestSiteName").then((site) => {
				console.log("latest " + site)
				this.siteName = site
			})
			this.db.get("quizSection").then((quiz) => this.quizSection = quiz)


	}

	ionViewDidLoad() {

		this.theme = localStorage.getItem("theme")
		if (this.theme == null) this.theme = "primary"
		this.slides.lockSwipes(true);
		this.slides.lockSwipeToNext(true)
	}

	siteName: string


	startSlide() {
		this.randomQuiz(this.items)
		this.slides.lockSwipes(false);
		this.slides.slideNext();
		this.slides.lockSwipes(true);
	}

	selectAnswer(answer, question) {
		this.theme="dark";
		this.hasAnswered = true;
		answer.selected = true;
		question.flashCardFlipped = true;
		
		this.recUtils.createElement(question.item.id,question.item)
		if (answer.correct) {
			this.score++;
		}	
		this.recUtils.downPlay(this.url + "/" + question.flashCardAudio)
		
		let tDelay=3500
		if (question.type=='Fill') tDelay=8000
		this.myInter=setInterval(() => {
			this.theme = localStorage.getItem("theme")
			this.hasAnswered = false;
			this.slides.lockSwipes(false);
			this.slides.slideNext();
			this.slides.lockSwipes(true);
			answer.selected = false;
			question.flashCardFlipped = false;
			clearInterval(this.myInter)
		}, tDelay);
	}
	myInter=null;

	 moveNext(question){
		clearInterval(this.myInter)
		this.theme = localStorage.getItem("theme")
		this.hasAnswered = false;
		this.slides.lockSwipes(false);
		this.slides.slideNext();
		this.slides.lockSwipes(true);
		question.flashCardFlipped = false;
	 }


	restartQuiz() {
		this.questions = []
		this.score = 0;
		this.slides.lockSwipes(false);
		this.slides.slideTo(1, 1000);
		this.slides.lockSwipes(true);
		this.randomQuiz(this.items)
	}

	quizType: string = "context"
	randomQuiz(items) {
		let count = 0
		items = this.utils.randomizeItems(items)

		for (let item of items) {
			if (item.ct == "" && this.quizType == "context") continue
			if (count === this.testItems) break
			let q = new Question();
			q.id = item.id
			q.flashCardBack = item.fl.toUpperCase().trim()
			q.flashCardBackEng = item.en.toUpperCase().trim()
			q.flashCardAudio = item.frr
			q.item = item
			let answers: Array<Answer> = []
			if (this.quizType == "context") {
				let ct = item.ct.toUpperCase().trim().replace("’", "'")
				let searchText = item.fl.toUpperCase().trim().replace("’", "'")
				let newCt: string = ct.replace(searchText, "_______")
				q.flashCardFront = newCt
				if (newCt.search("_______") == -1) continue
				q.type = "Fill"
				q.questionText = "Guess the missing word..."
			} else {
				q.flashCardFront = item.fl
				q.type = "Match"
				q.questionText = "Guess the matching word..."
			}
			let choice: Array<{
				fl: string
				en: string
			}> = []
			let ctr = 0
			let itemChoice = this.utils.randomizeItems(items)
			for (let it of itemChoice) {
				if (ctr === 4) break
				if (it.fl === item.fl) continue
				choice.push({ "fl": it.fl.toUpperCase(), "en": it.en.toUpperCase() })
				ctr++
			}
			answers.push({ "answer": item.fl.toUpperCase(), "answerEn": item.en, "correct": true, "selected": false })
			answers.push({ "answer": choice[0].fl.toString(), "answerEn": choice[0].en.toString(), "correct": false, "selected": false })
			answers.push({ "answer": choice[1].fl.toString(), "answerEn": choice[1].en.toString(), "correct": false, "selected": false })
			answers.push({ "answer": choice[2].fl.toString(), "answerEn": choice[2].en.toString(), "correct": false, "selected": false })

			q.answers = this.utils.randomizeItems(answers)
			this.questions.push(q)
			count++
		}
	}
	btnLang: string = "English"
	selectEnglish() {
		if (this.btnLang == "English") {
			this.btnLang = this.siteName
		} else {
			this.btnLang = "English"
		}
		if (this.quizType == "vocab") {
			this.randomQuiz(this.questions)
		}
	}

	addPlaylist() {

		this.questions.forEach((q) => {
			this.items.filter(x => {
				if (x.id == q.id) {
					x.isAddPlaylist = true
				}
			})

		})
		this.db.set("items", this.items)
		this.utils.presentToast('Quiz list added to Study list.', 1500)
	}


	sendEmail() {

		let data = {
			email: '', subject: this.quizSection,quizType:"quizfill", body: this.questions, html: false,
			username: localStorage.getItem('username'), siteName: this.siteName, score: this.score
		}
		this.utils.sendEmail(data)
	}
}