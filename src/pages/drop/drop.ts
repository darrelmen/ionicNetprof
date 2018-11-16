

//-----------------------------------------------------------------------------
// demonstrate standard HTML5 drag/drop.
// this is based on the html5rocks tutorial published here:
// http://www.html5rocks.com/en/tutorials/dnd/basics/

import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { Item } from '../../model/item';
import { Answer } from '../../model/answer';
import { Question } from '../../model/question';
import { Storage } from '@ionic/storage';
import { CommonUtils } from '../../utils/common-utils';
import {DropQuizPage} from '../../pages/dropquiz/dropquiz'

@Component({
    selector: 'page-drop',
    templateUrl: 'drop.html',
})
export class DropPage {
    items = [];
    testItems: number = 10
    testLevel = 1
    testMax=100
    questions: Array<Question> = []
    answer = []
    wordsRightOrder = []
   url: any
    score: number = 0;
    siteName: string
    itemsRandom: any


    constructor(public db: Storage, public utils: CommonUtils,public navCtrl:NavController) {
        this.db.get("latestSiteName").then((site) => {
            this.db.get("items").then((items: Array<Item>) => {

                if (items.length > 100) {
                    this.testMax = 100
                } else {
                    this.testMax = items.length
                }
                this.items=[]
                this.items=items
                this.siteName = site
            })
        })
      this.theme=localStorage.getItem("theme")      
    }
    theme:string

    ionViewCanEnter() {
        this.db.get("latestSiteName").then((site) => {
            this.db.get("items").then((items: Array<Item>) => {

                if (items.length > 100) {
                    this.testMax = 100
                } else {
                    this.testMax = items.length
                }
                this.items=[]
                this.items=items
                this.siteName = site
            })
        })
      this.theme=localStorage.getItem("theme")      
        this.questions=[]
      }

    startSlide() {
        var count = 0
        this.questions=[]
        let levelName:string
        this.itemsRandom = this.utils.randomizeItems(this.items)
        for (let item of this.itemsRandom) {
            if (item.ct == "" && this.siteName != "Japanese") continue;
            var wordsRightOrder;
            if (this.siteName == "Mandarin" || this.siteName == "Korean") {
                wordsRightOrder = item.ct.split('')
                // } else if (site == "MSA" || site == "Egyptian" || site == "Levantine" || site == "Pashto1" || site == "Pashto2" || site == "Pashto3"
                //   || site == "Dari" || site == "Farsi" || site == "Urdu" || site == "Iraqi" || site == "Sudanese") {
                //   wordsRightOrder = this.randomizeAnswers(item.ct.split(','))
            }else if (this.siteName == "Japanese"){
                wordsRightOrder = item.fl.split('')
            } else {
                wordsRightOrder = item.ct.split(" ")
            }
            if (this.testLevel == 1) {
                levelName = "EASY"
                if (wordsRightOrder.length > 4) continue;
                
            } else if (this.testLevel == 2) {
                levelName = "MID"
                if (wordsRightOrder.lengthlength < 4) continue
                if (wordsRightOrder.length > 8) continue;
            } else if (this.testLevel == 3) {
                levelName = "HARDEST"
                if (wordsRightOrder.length < 8) continue;
            }
            if (count == this.testItems) break;
            let wordsAnswers: Array<Answer> = new Array<Answer>()
            count++

            var wordsRandom;
            if (this.siteName == "Mandarin" || this.siteName == "Korean") {
                wordsRandom = this.utils.randomizeItems(item.ct.split(''))
                //It will break for some multibyte characters like 𠀁: '𠀁'.split('') --- outputs ["", ""] (array of 2 empty strings) 
            }else if (this.siteName == "Japanese"){
                wordsRandom = this.utils.randomizeItems(item.fl.split(''))
            } else {
                wordsRandom = this.utils.randomizeItems(item.ct.toUpperCase().split(" "))
            }
            for (let item of wordsRandom) {
                let ans: Answer = new Answer()
                ans.answer = item
                wordsAnswers.push(ans)
            }
            let q: Question = new Question
            q.answers = wordsAnswers
            q.wordsRightOrder = wordsRightOrder
            q.item=item
            this.questions.push(q)

        }
        if(this.questions.length==0) {
            this.utils.presentToast("No context sentences for level " + levelName + " !",2000)
        }else {
        let params={items:this.items,questions:this.questions,testLevel:this.testLevel,testItems:this.testItems,siteName:this.siteName}
        this.navCtrl.push(DropQuizPage,{params:params})
        }
       
    }

    
}