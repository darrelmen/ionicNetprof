import { NavController, Events } from 'ionic-angular';
import { Component } from '@angular/core';
import { SearchListPage } from '../searchlist/searchlist';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'menuitems.html'
})
export class MenuItemsPage {

  constructor(
    public auth: AuthService,
    public nav: NavController,
    public events: Events,
    public db: Storage

  ) {
    this.events.subscribe('params:callback', (params, callback) => {
      // this.isRtl = direction;
      //faceted menu
      this.lessonMenu = params.menu
      if (this.lessonMenu[0].sublesson.length == 0) {
        this.isSublesson = false
      } else {
        this.isSublesson = true
      }
      this.grammar = params.grammar
      if (this.grammar.length == 0) {
        this.isGrammar = false
      } else {
        this.isGrammar = true
      }
      this.topic = params.topic
      if (this.topic.length == 0) {
        this.isTopic = false
      } else {
        this.isTopic = true
      }

      this.items = params.items
      this.allItems = this.items
      this.siteName = params.siteName
      this.callback = callback

    });

  }
  ionViewDidEnter() {

    this.db.get("latestSiteName").then(site => {
      this.siteName = site
      this.db.get(site).then((items) => {
        this.allItems = items
        this.items = items

        // this.db.get(this.siteName + 'Playlist').then(str => {
        //   if (str != null) { this.playlists = JSON.parse(str) }
        // })

        //this is needed to be able to display initial data
      })
      this.db.get(site + "menu").then((menu) => {
        this.lessonMenu = menu
      })
      this.db.get(site + "grammar").then((grammar) => {
        this.grammar = grammar
      })
      this.db.get(site + "topic").then((topic) => {
        this.topic = topic

      })

    });
    //multiple params ( params and callback)

    this.activePage = 'playlist'
    this.theme = localStorage.getItem("theme")
    if (this.theme == null) this.theme = "primary"

  }

  ionViewDidLoad() {

  }




  theme: string

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
  showGrammar1 = null;
  showTopic1 = null
  showTopic2 = null
  isSublesson = false
  isGrammar = false
  isTopic = false
  lessonMenu = []
  topic = []
  grammar = []

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


  toggleGrammar1(idx: string, index) {
    if (this.isGrammar1Shown(idx)) {
      //close
      this.showGrammar1 = null;
      this.mainPage = this.grammar[index]
    } else {
      //open
      this.showGrammar1 = idx;
    }
  };

  isGrammar1Shown(idx) {
    return this.showGrammar1 === idx;
  };



  toggleTopic1(idx: string, index) {
    if (this.isTopic1Shown(idx)) {
      //close
      this.showTopic1 = null;
      this.mainPage = this.topic[index]
    } else {
      //open
      this.showTopic1 = idx;
    }
  };
  isTopic1Shown(idx) {
    return this.showTopic1 === idx;
  };

  toggleTopic2(idx: string, i1, i2) {
    if (this.isTopic2Shown(idx)) {
      this.showTopic1 = null;
      this.showTopic2 = null;
      this.mainPage = this.topic[i1].subtopic[i2]

    } else {
      this.showTopic1 = idx;
      this.showTopic2 = idx;
    }
  }
  isTopic2Shown(idx) {
    return this.showTopic2 === idx;
  };

  goToMain() {
    this.nav.push(SearchListPage)
  }

  getSearchMenu(menu?, selection?) {
    this.items = this.allItems
    var searchText, lastCorrect, lastIncorrect, filterItems
    if (menu.type == undefined) {
      searchText = menu.name;
    } else {
      searchText = menu.type + " " + menu.name
    }
    console.log("search text " + searchText)
    //  searchText = item.lesson.type + " " + item.lesson.name + " " + item.type + " " + item.name
    //}
    // if the value is an empty string don't filter the items
    if (searchText.trim() != '') {
      this.items = this.items.filter((item) => {
        //  return (item.searchTopic.toLowerCase().indexOf(searchText.toLowerCase().trim()) > -1)
        // if (menu.type==undefined) {
        //   return (item.searchTopic.toLowerCase().includes(searchText.toLowerCase().trim() ))
        // }else 
        if (selection == 'sub') {
          return (item.sublesson == menu.type && item.sublessonId == menu.name)
        } else if (selection == 'menu') {
          return (item.lesson == menu.type && item.lessonId == menu.name)
        } else if (selection == 'stopic') {
          return item.subtopic == searchText
        } else if (selection == 'grammar') {
          return item.Grammar == searchText
        }
      })
      var lesson
      //used for http request params
      if (menu.type == undefined) {
        lesson = "undefined=" + encodeURIComponent(searchText.trim())
      } else {
        lesson = menu.type + "=" + encodeURIComponent(menu.name.trim())
      }
      // } else {
      //   lesson = item.lesson.type + "=" + item.lesson.name + "&" + item.type + "=" + item.name

      this.auth.getScores(lesson).then((lessonScores: any) => {
        //for deployment
        //this.auth.getScores(lesson).then((lessonScores: any) => {
        //this is how to combine 2 arrays with matching ids
        filterItems = this.items.map(x => Object.assign(x, lessonScores.scores.find(y => y.ex == x.id)));

        //this is how to combine and update allItems 2 arrays with matching ids
        this.allItems = Array.from(new Set(filterItems.concat(this.allItems)));

        lastCorrect = lessonScores.lastCorrect
        lastIncorrect = lessonScores.lastIncorrect
        console.log("search text count res " + filterItems.length)

        let noRecording = this.items.length - Number(lastCorrect) - Number(lastIncorrect)
        this.params = { items: filterItems, filterTitle: searchText, lastCorrect: lastCorrect, lastIncorrect: lastIncorrect, noRecording: noRecording, isViewAll: false }
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
    if (filteritems.length > 0) {
      this.params = { items: filteritems, isViewAll: false, isPlayList: true }
    } else {
      this.params = { items: this.allItems, isViewAll: true }
    }
    this.callback(this.params).then(() => { })
  }
}
