import { NavController, Events } from 'ionic-angular';
import { Component } from '@angular/core';
import { SearchListPage } from '../searchlist/searchlist';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  templateUrl: 'menuitems.html'
})
export class MenuItemsPage {


  constructor(
    public auth: AuthService,
    public nav: NavController,
    public events: Events
  ) {
    //multiple params ( params and callback)
    this.events.subscribe('params:callback', (params, callback) => {
      // this.isRtl = direction;
      this.lessonMenu = params.menu
      if (this.lessonMenu[0].sublesson.length == 0) {
        this.isSublesson = false
      }
      this.items = params.items
      this.allItems = this.items
      this.siteName = params.siteName
      this.callback = callback
    });
    this.activePage = 'playlist'
    this.theme = localStorage.getItem("theme")
    if(this.theme==null) this.theme="primary"

  }
  
  theme: string
  lessonMenu = []
  menuRoot = SearchListPage
  items = []
  allItems = []
  title: any
  params: any
  callback: any
  siteName: any
  activePage: any
  mainPage: any
  showLevel1 = null;
  isSublesson = true
  
  toggleLevel1(idx: string, index) {
    if (this.isLevel1Shown(idx)) {
      //close
      this.showLevel1 = null;
      this.mainPage = this.lessonMenu[index]
    } else {
      //open
      this.showLevel1 = idx;
    }


  };

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

  goToMain(){
    this.nav.push(SearchListPage)
  }

  getSearchMenu(menu?) {
    this.items = this.allItems
    var searchText, lastCorrect, lastIncorrect, res
    searchText = menu.type + " " + menu.name;
    //  searchText = item.lesson.type + " " + item.lesson.name + " " + item.type + " " + item.name
    //}
    // if the value is an empty string don't filter the items
    if (searchText && searchText.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.searchTopic.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
      })
      var lesson
      lesson = menu.type + "=" + menu.name
      // } else {
      //   lesson = item.lesson.type + "=" + item.lesson.name + "&" + item.type + "=" + item.name


      this.auth.getScores(lesson).then((lessonScores: any) => {
        //for deployment
        //this.auth.getScores(lesson).then((lessonScores: any) => {

        //this is how to combine 2 arrays with matching ids
        res = this.items.map(x => Object.assign(x, lessonScores.scores.find(y => y.ex == x.id)));

        //this is how to combine and update allItems 2 arrays with matching ids
        this.allItems = Array.from(new Set(res.concat(this.allItems)));

        lastCorrect = lessonScores.lastCorrect
        lastIncorrect = lessonScores.lastIncorrect
        console.log(" last Scored " + lastCorrect)
        let noRecording = this.items.length - Number(lastCorrect) - Number(lastIncorrect)

        this.params = { items: res, lastCorrect: lastCorrect, lastIncorrect: lastIncorrect, noRecording: noRecording, isViewAll: false }
        this.callback(this.params).then(() => {
        })
      })
    }
    else {
      this.params = { items: this.allItems, isViewAll: true }
      this.callback(this.params).then(() => { })
    }
    this.activePage = menu
  }

  checkActivePage(menu) {
    return menu == this.activePage
  }

  checkMainPage(menu) {
    return menu == this.mainPage
  }

  filterPlayList() {
    let filteritems = this.items.filter((item) => {
      return (item.isAddPlaylist)
    })
    if (filteritems.length>0) {
      this.params = { items: filteritems, isViewAll: false,isPlayList:true }
    } else {
      this.params = { items: this.allItems, isViewAll: true }
    }
    this.callback(this.params).then(() => { })
  }
}
