import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Question} from '../../model/question';
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

	@ViewChild('slides') slides: any;
	hasAnswered: boolean = false;
	score: number = 0;
	testItems=10
	testMax:number
	slideOptions: any;
	public questions:Array<Question>=[]
	url:string
	items:Array<Item>;
	constructor(public navCtrl: NavController, public db:Storage,public recUtils:RecordUtils,public utils:CommonUtils) {
		this.db.get("items").then((items:Array<Item>) => {
			this.items=items
			if(items.length>100) {
				this.testMax=100
			} else {
			  this.testMax=items.length
			}
			this.db.get("url").then((url)=>this.url=url)
		})
		this.db.get("latestSiteName").then((site)=>{
			console.log ("latest " + site)
			this.siteName= site})  
	}
	
	ionViewDidLoad(){
		this.slides.lockSwipes(true);
		this.slides.lockSwipeToNext(true)
	}
	
	siteName:string
	

	startSlide(){
		this.randomQuiz(this.items)
		this.slides.lockSwipes(false);
		this.slides.slideNext();
		this.slides.lockSwipes(true);
	}

	selectAnswer(answer, question){
		this.hasAnswered = true;
		answer.selected = true;
		question.flashCardFlipped = true;
		if(answer.correct){
			this.score++;
		}
		this.recUtils.downPlay(this.url + "/" + question.flashCardAudio)
		console.log ("audio " + this.url + "/" + question.flashCardAudio)
		setTimeout(() => {
			this.hasAnswered = false;
			this.slides.lockSwipes(false);
			this.slides.slideNext();
			this.slides.lockSwipes(true);
			answer.selected = false;
			question.flashCardFlipped = false;
		}, 2500);
	}


	restartQuiz() {
		this.questions=[]
		this.score = 0;
		this.slides.lockSwipes(false);
		this.slides.slideTo(1, 1000);
		this.slides.lockSwipes(true);
		this.randomQuiz(this.items)
	}

	randomQuiz(items){
		let count = 0
		items = this.utils.randomizeItems(items)
	
		for (let item of items) {
			if (item.ct=="") continue
			if (count === this.testItems ) break
			let q = new Question();
			q.id = item.id
			q.flashCardBack = item.fl
			q.flashCardBackEng = item.en
			q.flashCardAudio=item.frr
			
			let answers: Array<Answer> = []
			let ct = item.ct.toLocaleLowerCase().trim().replace("’", "'")
			let searchText = item.fl.toLocaleLowerCase().trim().replace("’", "'")
			let newCt:string = ct.replace(searchText, "_______")
			q.flashCardFront = newCt
			if (newCt.search("_______")==-1) continue
			q.type = "Fill"
			q.questionText = "Guess the missing word... "
			let choice: Array<{
				fl: string
				en: string
			  }> = []
			let ctr = 0
			let itemChoice = this.utils.randomizeItems(items)
			for (let it of itemChoice) {
				if (ctr === 3) break
				if (it.fl === item.fl) continue
				choice.push({"fl":it.fl,"en":it.en})
				ctr++
			}
			answers.push({ "answer": item.fl,"answerEn": item.en, "correct": true, "selected": false})
			answers.push({ "answer": choice[0].fl.toString(),"answerEn": choice[0].en.toString(), "correct": false, "selected": false })
			answers.push({ "answer": choice[1].fl.toString(),"answerEn": choice[1].en.toString(), "correct": false, "selected": false })

			q.answers = this.utils.randomizeItems(answers)
			this.questions.push(q)
			count++
		}
	}
	btnName:string="English"
   	selectEnglish(){
		if(this.btnName=="English"){
			this.btnName=this.siteName
		} else {
			this.btnName="English"
	    }
	}
}