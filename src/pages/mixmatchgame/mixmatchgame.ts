//-----------------------------------------------------------------------------
// demonstrate standard HTML5 drag/drop.
// this is based on the html5rocks tutorial published here:
// http://www.html5rocks.com/en/tutorials/dnd/basics/

import { Component } from '@angular/core';
import { NavParams, NavController, Events } from 'ionic-angular';
import { Answer } from '../../model/answer';
import { Question } from '../../model/question';
import { Storage } from '@ionic/storage';
import { CommonUtils } from '../../utils/common-utils';
import { RecordUtils } from '../../utils/record-utils';

@Component({
    selector: 'page-mixmatchgame',
    templateUrl: 'mixmatchgame.html',
})
export class MixMatchGamePage {
    items = []
    itemsRandom = []
    testItems: number = 5

    score: number = 0;
    siteName: string
    btnSize:string

    constructor(public db: Storage, public utils: CommonUtils, private nav: NavParams, 
        private navCtrl: NavController, private recUtils: RecordUtils) {
        let params = this.nav.get("params")
        //Arrays are mutable so we need this to assign to a new array
        this.items = params.items.slice(0)
        this.testItems = params.testItems
        this.siteName = params.siteName
        this.itemsRandom = this.utils.randomizeItems(params.items)
        
    }

    ionViewDidLoad() {
        this.dragdrop()
        this.timer(this.testItems)
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
        var score=0
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
            // var score=0
            if (dragSrcEl) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
                if (dragSrcEl != this) {
                    if (dragSrcEl.id.toLowerCase() == e.target.innerText.trim().toLowerCase()) {
                         dragSrcEl.style.display = 'none'
                        e.target.style.display = 'none'
                        e.currentTarget.style.display = 'none'
                        score++
                        document.getElementById("score").innerHTML="Match: " + score.toString()
                      } else {
                        dragSrcEl.style.opacity = '1.0';
                        // dragSrcEl.innerHTML = e.target.innerHTML;
                        // this.innerHTML = e.dataTransfer.getData('text');
                    }
                }
            }

        }

    }

    interVl=0
    timer(testItems) {

         // Set the date we're counting down to
        var countDownDate = new Date().getTime();

        // Update the count down every 1 second
       //async functions
        this.interVl = setInterval(() =>{
            
            // Get todays date and time minus 2 minutes
            var now = new Date().getTime() - 1000 * 60 * 2;

            // Find the distance between now an the count down date
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in an element with id="demo"
            document.getElementById("timer").innerHTML = "Time remaining : " + 
                minutes + "m " + seconds + "s ";

            // If the count down is over, write some text 
            if (distance < 0) {
                clearInterval(this.interVl);
                this.interVl=0
                document.getElementById("timer").innerHTML = "TIME EXPIRED!";
            } else if (document.getElementById("score").innerText=="Match: " + testItems){
                document.getElementById("icard").style.display='none'
                document.getElementById("icard1").innerHTML =  "Well Done! You've matched all words in "  + ((1000 * 60 * 2)-(minutes*60*1000)-(seconds*1000))/1000 + "s."
                document.getElementById("icard1").style.textAlign="center"
                document.getElementById("icard1").style.color ="green"
                document.getElementById("icard1").style.fontWeight ="bold"
               
                clearInterval(this.interVl);
                this.interVl=0
            }
        }, 1000);
        
    }

    restartGame() {
        clearInterval(this.interVl)
        this.score = 0;
        this.navCtrl.pop()
    }
}