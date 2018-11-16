//-----------------------------------------------------------------------------
// demonstrate standard HTML5 drag/drop.
// this is based on the html5rocks tutorial published here:
// http://www.html5rocks.com/en/tutorials/dnd/basics/

import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { Answer } from '../../model/answer';
import { Question } from '../../model/question';
import { Storage } from '@ionic/storage';
import { CommonUtils } from '../../utils/common-utils';
import { RecordUtils } from '../../utils/record-utils';

@Component({
    selector: 'page-dropquiz',
    templateUrl: 'dropquiz.html',
})
export class DropQuizPage {
    items = [];
    testItems: number = 10
    testLevel = 1
    questions: Array<Question> = []
    question: any
    answer = []
    wordsRightOrder = []
    score: number = 0;
    siteName: string
    quizSection:string=''
    constructor(public db: Storage, public utils: CommonUtils, private nav: NavParams, private navCtrl: NavController, private recUtils: RecordUtils) {
        let params = this.nav.get("params")
        this.questions = params.questions
        this.testLevel = params.testLevel
        this.testItems = params.testItems
        this.question = this.questions[0]
        this.siteName = params.siteName
        this.items=params.items
        this.theme=localStorage.getItem("theme") 
        this.db.get("quizSection").then((quiz) => this.quizSection = quiz)     
    }
    theme:string

    ionViewWillEnter(){
        let params = this.nav.get("params")
        this.questions = params.questions
        this.testLevel = params.testLevel
        this.testItems = params.testItems
        this.question = this.questions[0]
        this.siteName = params.siteName
        this.items=params.items
        this.theme=localStorage.getItem("theme") 
        this.db.get("quizSection").then((quiz) => this.quizSection = quiz)    
    }

    ionViewDidLoad() {
        this.dragdrop()
    }


    dragdrop() {
        // hook up event handlers
        var cols = document.querySelectorAll('#columns .column');
        [].forEach.call(cols, function (col) {
            col.addEventListener('dragstart', handleDragStart, false);
            col.addEventListener('dragenter', handleDragEnter, false)
            col.addEventListener('dragover', handleDragOver, false);
            col.addEventListener('dragleave', handleDragLeave, false);
            col.addEventListener('drop', handleDrop, false);
            col.addEventListener('dragend', handleDragEnd, false);
        });

        var dragSrcEl = null;
        function handleDragStart(e) {
            if (e.target.className.indexOf('column') > -1) {
                dragSrcEl = e.target;
                dragSrcEl.style.opacity = '0.4';
                var dt = e.dataTransfer;
                dt.effectAllowed = 'move';
                dt.setData('text', dragSrcEl.innerHTML);

                // customize drag image for one of the panels
                if (dt.setDragImage instanceof Function && e.target.innerHTML.indexOf('X') > -1) {
                    var img = new Image();
                    img.src = 'dragimage.jpg';
                    dt.setDragImage(img, img.width / 2, img.height / 2);
                }
            }
        }
        function handleDragOver(e) {
            if (dragSrcEl) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            }
        }
        function handleDragEnter(e) {
            if (dragSrcEl) {
                e.target.classList.add('over');
            }
        }
        function handleDragLeave(e) {
            if (dragSrcEl) {
                e.target.classList.remove('over');
            }
        }
        function handleDragEnd(e) {
            dragSrcEl = null;
            [].forEach.call(cols, function (col) {
                col.style.opacity = '';
                col.classList.remove('over');
            });
        }
        function handleDrop(e) {
            if (dragSrcEl) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
                if (dragSrcEl != this) {
                    dragSrcEl.innerHTML = e.target.innerHTML;
                    this.innerHTML = e.dataTransfer.getData('text');
                }
                console.log("drop")
            }
        }
    }


    testCount = 0
    nextQuestion(answer: Array<Answer>, rightWords) {

        this.checkAnswer(answer, rightWords).then(() => {
            // for accumulating scores
            let correct = 1
            for (let ans of answer) {
                if (ans.color == 'danger') {
                    correct = 0
                    break;
                }
            }
            if (correct == 1) {
                this.score++
            }
            this.testCount++
            if (this.testCount < this.testItems) {
                this.question = this.questions[this.testCount]
                setTimeout(() =>
                    this.dragdrop(), 300)
            }
        })
    }

    checkAnswer(answers: Array<Answer>, wordsRightOrder) {
        return new Promise((resolve, reject) => {
            var cols: any = document.querySelectorAll('#columns .column');
            console.log("cols " + cols)
            for (let index = 0; index < cols.length; index++) {
                answers[index].answer = cols[index].innerText.trim()
            }
            var ansIndx = 0
            for (let answer of answers) {
                var rightIndex = 0
                for (let rightWord of wordsRightOrder) {
                    if (rightWord.toLowerCase() == answer.answer.toLowerCase()) {
                        if (rightIndex == ansIndx) {
                            answer.color = 'secondary'
                            break
                        } else {
                            answer.color = 'danger'
                        }
                    }
                    rightIndex++
                }
                ansIndx++
            }
            setTimeout(() => this.dragdrop(), 300)
            resolve(true)
            this.db.get("url").then((url) => {
                this.recUtils.downPlay(url + "/" + this.question.item.ctmref)
            })
        })

    }



    showAnswer(wordsRightOrder) {
        let words: string = ""
        for (let word of wordsRightOrder) {
            words = words + word + " "
        }
        // this.utils.presentToast(words, 2000)
        this.db.get("url").then((url) => {
            this.recUtils.downPlay(url + "/" + this.question.item.ctmref)
        })
    }

    restartQuiz() {
        this.questions = []
        this.score = 0;
        this.testCount = 0
        this.navCtrl.pop()
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
		this.utils.presentToast('Quiz list added to Playlist.', 1500)
	}


	sendEmail() {

		let data = {
			email: '', subject: this.quizSection,quizType:"quizdrop", body: this.questions, html: false,
			username: localStorage.getItem('username'), siteName: this.siteName, score: this.score
		}
		this.utils.sendEmail(data)
	}
}