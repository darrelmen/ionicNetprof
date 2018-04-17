import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { SearchListPage } from '../searchlist/searchlist';

/*
  Generated class for the Popover page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sortover',
  templateUrl: 'sortover.html'
})
export class SortoverPage {
  items: any
  title: string
  sortOrder:string
  sortTypes:any
  constructor(public viewCtrl: ViewController, public params: NavParams) {
    this.sortOrder = params.get("sortOrder")
    this.items = params.get("items")
    //this.allItems=this.items
    this.sortTypes = params.get("types")
    if (this.sortOrder == 'A') {
     this.title="Sort A-Z by ... " 
    } else {
      this.title="Sort Z-A by ... " 
    }
  }

  sortAscDesc(sortBy) {
    if (sortBy == 'English') {
      if (this.sortOrder == 'A') {
        this.sortOrder = 'D'
        // update your data 
        this.items = [].concat(this.items || []).sort((a, b) => -(a.en.replace("(","").toLowerCase() < b.en.replace("(","").toLowerCase()) || +(a.en.replace("(","").toLowerCase() !== b.en.replace("(","").toLowerCase()));
      } else {
        this.sortOrder = 'A'
        this.items = [].concat(this.items || []).sort((a, b) => +(a.en.replace("(","").toLowerCase() < b.en.replace("(","").toLowerCase()) || -(a.en.replace("(","").toLowerCase() !== b.en.replace("(","").toLowerCase()));

      }
    } else if (sortBy == "Scored") {
      if (this.sortOrder == 'A') {
        this.sortOrder = 'D'
        // update your data 
        this.items = [].concat(this.items || []).sort((a, b) => -(a.s < b.s) || +(a.s !== b.s));
      } else {
        this.sortOrder = 'A'
        this.items = [].concat(this.items || []).sort((a, b) => +(a.s < b.s) || -(a.s !== b.s));
      }
   } else  {
      if (this.sortOrder == 'A') {
        this.sortOrder = 'D'
        // update your data 
        this.items = [].concat(this.items || []).sort((a, b) => -(a.fl.toLowerCase() < b.fl.toLowerCase()) || +(a.fl.toLowerCase() !== b.fl.toLowerCase()));
      } else {
        this.sortOrder = 'A'
        this.items = [].concat(this.items || []).sort((a, b) => +(a.fl.toLowerCase() < b.fl.toLowerCase()) || -(a.fl.toLowerCase() !== b.fl.toLowerCase()));
      }
  }
    let data =[]
    data.push(this.items)
    data.push(this.sortOrder)
    if (this.sortOrder == 'A') {
      this.title= sortBy + "...Z-A" 
     } else {
       this.title=sortBy + "...A-Z" 
     }
    data.push(this.title)
    console.log("sort a " + this.sortOrder)
    // data to return to searchlist view
    this.viewCtrl.dismiss(data);
  }
}
