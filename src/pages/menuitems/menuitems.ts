import { NavController, Events } from 'ionic-angular';
import { Component } from '@angular/core';
import { SearchListPage } from '../searchlist/searchlist';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  templateUrl: 'menuitems.html'
})
export class MenuItemsPage  {

  
  constructor(
    public auth: AuthService,
    public nav: NavController,
    public events: Events
  ) {
    //multiple params ( params and callback)
    this.events.subscribe('params:callback', (params,callback) => {
      // this.isRtl = direction;
      this.lessons = params.lessons
      this.sublessons = params.sublessons
      this.items = params.items
      this.allItems=this.items
      this.siteName=params.siteName
      this.callback = callback
      if(this.sublessons.length!=0) {
        this.title =this.sublessons[0].lesson.type + " - " + this.sublessons[0].type
        this.lessons=this.sublessons
       
      } else {
       this.title =this.lessons[0].type
      }
     });
  }
  lessons = []
  sublessons = []
  menuRoot = SearchListPage
  items=[]
  allItems=[]
  title:any
  params:any
  callback:any
  siteName:any
 
  getSearchItems(item?) {
     this.items=this.allItems
    var searchText, lastCorrect, lastIncorrect, res
    if (this.sublessons.length == 0) {
      searchText = item.type + " " + item.name;
    } else {
      searchText = item.lesson.type + " " + item.lesson.name + " " + item.type + " " + item.name
    }
    // if the value is an empty string don't filter the items
    if (searchText && searchText.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.searchTopic.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
      })
      var lesson
      if (this.sublessons.length == 0) {
        lesson = item.type + "=" + item.name
      } else {
        lesson = item.lesson.type + "=" + item.lesson.name + "&" + item.type + "=" + item.name
      }

      this.auth.getScores(lesson).then((lessonScores:any) => {

        //this is how to combine 2 arrays with matching ids
        res = this.items.map(x => Object.assign(x, lessonScores.scores.find(y => y.ex == x.id)));

        lastCorrect = lessonScores.lastCorrect
        lastIncorrect = lessonScores.lastIncorrect
        console.log(" last Scored " + lastCorrect)
        let noRecording = this.items.length - Number(lastCorrect) - Number(lastIncorrect)

        this.params = { items: res, lastCorrect: lastCorrect, lastIncorrect: lastIncorrect, noRecording: noRecording,isViewAll:false }
        this.callback(this.params).then(() => {
        })
      })
    } else {
      this.params =  { items: this.allItems,isViewAll:true}
        this.callback(this.params).then(() => {})
    }
  }
}
