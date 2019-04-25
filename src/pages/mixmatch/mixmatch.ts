

//-----------------------------------------------------------------------------
// demonstrate standard HTML5 drag/drop.
// this is based on the html5rocks tutorial published here:
// http://www.html5rocks.com/en/tutorials/dnd/basics/

import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { Item } from '../../model/item';
//import { Answer } from '../../model/answer';
//import { Question } from '../../model/question';
import { Storage } from '@ionic/storage';
import { CommonUtils } from '../../utils/common-utils';
import {MixMatchGamePage} from '../../pages/mixmatchgame/mixmatchgame'
@Component({
    selector: 'page-mixematch',
    templateUrl: 'mixmatch.html',
})
export class MixMatchPage {
    items = [];
    testItems: number = 5
    testMax=20
    siteName: string
    quizSection='All items'

    constructor(public db: Storage, public utils: CommonUtils,public navCtrl:NavController) {
        this.db.get("latestSiteName").then((site) => {
            this.db.get("items").then((items: Array<Item>) => {

                if (items.length > 20) {
                    this.testMax = 20
                } else {
                    this.testMax = items.length
                }
                this.items=[]
               this.items=items
                this.siteName = site
            })
        })
        this.theme=localStorage.getItem("theme")    
        this.db.get("quizSection").then((quiz) => this.quizSection = quiz)       
    }
   theme:string

     ionViewWillEnter(){
        this.db.get("latestSiteName").then((site) => {
            this.db.get("items").then((items: Array<Item>) => {

                if (items.length > 20) {
                    this.testMax = 20
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

    startSlide() {
        let items= this.utils.randomizeItems(this.items).slice(0,this.testItems)
         // for (let item of this.itemsRandom) {
        //     if (item.ct == "" && this.siteName != "Japanese") continue;
        //     var wordsRightOrder;
        //     if (this.siteName == "Mandarin" || this.siteName == "Korean") {
        //         wordsRightOrder = item.ct.split('')
        //         // } else if (site == "MSA" || site == "Egyptian" || site == "Levantine" || site == "Pashto1" || site == "Pashto2" || site == "Pashto3"
        //         //   || site == "Dari" || site == "Farsi" || site == "Urdu" || site == "Iraqi" || site == "Sudanese") {
        //         //   wordsRightOrder = this.randomizeAnswers(item.ct.split(','))
        //     }else if (this.siteName == "Japanese"){
        //         wordsRightOrder = item.fl.split('')
        //     } else {
        //         wordsRightOrder = item.ct.split(" ")
        //     }
        //     if (this.testLevel == 1) {
        //         levelName = "EASY"
        //         if (wordsRightOrder.length > 4) continue;
                
        //     } else if (this.testLevel == 2) {
        //         levelName = "MID"
        //         if (wordsRightOrder.lengthlength < 4) continue
        //         if (wordsRightOrder.length > 8) continue;
        //     } else if (this.testLevel == 3) {
        //         levelName = "HARDEST"
        //         if (wordsRightOrder.length < 8) continue;
        //     }
        //     if (count == this.testItems) break;
        //     let wordsAnswers: Array<Answer> = new Array<Answer>()
        //     count++

        //     var wordsRandom;
        //     if (this.siteName == "Mandarin" || this.siteName == "Korean") {
        //         wordsRandom = this.utils.randomizeItems(item.ct.split(''))
        //         //It will break for some multibyte characters like 𠀁: '𠀁'.split('') --- outputs ["", ""] (array of 2 empty strings) 
        //     }else if (this.siteName == "Japanese"){
        //         wordsRandom = this.utils.randomizeItems(item.fl.split(''))
        //     } else {
        //         wordsRandom = this.utils.randomizeItems(item.ct.split(" "))
        //     }
        //     for (let item of wordsRandom) {
        //         let ans: Answer = new Answer()
        //         ans.answer = item
        //         wordsAnswers.push(ans)
        //     }
        //     let q: Question = new Question
        //     q.answers = wordsAnswers
        //     q.wordsRightOrder = wordsRightOrder
        //     q.item=item
        //     this.questions.push(q)

        // }
        
        let params={items:this.items,itemsRandom:items,testItems:this.testItems,siteName:this.siteName}
        this.navCtrl.push(MixMatchGamePage,{params:params})
       
    }

    
}