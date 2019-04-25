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
      // make sure there is no error in the code otherwise event will not fire

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
      this.dialect=params.dialect
      if (this.dialect.length == 0) {
        this.isDialect = false
      } else {
        this.isDialect = true
      }
      this.topic = params.topic
      if (this.topic.length == 0) {
        this.isTopic = false
      } else {
        this.isTopic = true
        if (this.topic[0].subtopic==null) {
            this.isSubTopic = false
          } else {
            this.isSubTopic = true
          }
      }

      // if (this.topic[0].subtopic.length==0) {
      //   this.isSubTopic = false
      // } else {
      //   this.isSubTopic = true
      // }
      this.items = params.items
      this.allItems = this.items
      this.siteName = params.siteName
      this.callback = callback
console.log( " event feedback success")
    });
    this.events.subscribe('enableSplitPanel', (isEnable) => {
      this.enablePanel=isEnable
      console.log (" is enable split panel " + isEnable)
  })
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
      this.db.get(site + "dialect").then((dialect) => {
        this.dialect = dialect

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
  enablePanel:boolean=true
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
  showDialect1 = null;
  showTopic1 = null
  showTopic2 = null
  isSublesson = false
  isGrammar = false
  isDialect=false
  isTopic = false
  isSubTopic=false
  lessonMenu = []
  topic = []
  grammar = []
  dialect = []

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


  toggleDialect1(idx: string, index) {
    if (this.isDialect1Shown(idx)) {
      //close
      this.showDialect1 = null;
      this.mainPage = this.dialect[index]
    } else {
      //open
      this.showDialect1 = idx;
    }
  };

  isDialect1Shown(idx) {
    return this.showDialect1 === idx;
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

  getSearchMenu(menu?, selection?,main?) {
    this.items = this.allItems
    var searchText, lastCorrect, lastIncorrect, filterItems,filterTitle
    if (menu.type == undefined) {
      searchText = menu.name;
    } else {
      searchText = menu.type + " " + menu.name
    }
    console.log("search text " + searchText + " leng " + this.items.length)
    //  searchText = item.lesson.type + " " + item.lesson.name + " " + item.type + " " + item.name
    //}
    // if the value is an empty string don't filter the items
    if (searchText.trim() != '') {
      this.items = this.items.filter((item) => {
        //  return (item.searchTopic.toLowerCase().indexOf(searchText.toLowerCase().trim()) > -1)
        // if (menu.type==undefined) {
        //   return (item.searchTopic.toLowerCase().includes(searchText.toLowerCase().trim() ))
        // }else 
        
        if (selection == 'submenu') {
          filterTitle=main.type + ' ' + main.name + ' - ' + menu.type + ' ' + menu.name 
          return (item.sublesson == menu.type && item.sublessonId == menu.name && item.lesson == main.type && item.lessonId == main.name)
        } else if (selection == 'menu') {
          filterTitle=menu.type + ' ' + menu.name
          return (item.lesson == menu.type && item.lessonId == menu.name)
        } else if (selection == 'topic') {
          filterTitle=searchText
           return item.Topic == searchText
        } else if (selection == 'subtopic') {
          filterTitle=searchText
          return item.subtopic == searchText
        } else if (selection == 'grammar') {
          filterTitle=searchText
          return item.Grammar == searchText
       } else if (selection == 'dialect') {
        filterTitle=searchText
        return item.Dialect == searchText
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
      console.log("search text count res1 " + this.items.length  + " lesson " + lesson)  
     // this.auth.getScores(lesson).subscribe((lessonScores: any) => {
        //for deployment
        this.auth.getScores(lesson).then((lessonScores: any) => {
        //this is how to combine 2 arrays with matching ids
        console.log("search text count res lesson " + lessonScores.scores.length)
        filterItems = this.items.map(x => Object.assign(x, lessonScores.scores.find(y => y.ex == x.id)));

        //this is how to combine and update allItems 2 arrays with matching ids
        this.allItems = Array.from(new Set(filterItems.concat(this.allItems)));

        lastCorrect = lessonScores.lastCorrect
        lastIncorrect = lessonScores.lastIncorrect
        console.log("search text count res3 " + filterItems.length)

        let noRecording = this.items.length - Number(lastCorrect) - Number(lastIncorrect)
        this.params = { items: filterItems, filterTitle: filterTitle, lastCorrect: lastCorrect, lastIncorrect: lastIncorrect, noRecording: noRecording, isViewAll: false }
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
