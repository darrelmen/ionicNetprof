import { Component } from '@angular/core';
import { NavController, MenuController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import Highcharts from 'highcharts';


@Component({
  templateUrl: 'progress.html',
})

export class ProgressPage {
  constructor(public auth: AuthService, public nav: NavController, public menu: MenuController, private db: Storage, private navParams: NavParams) {

    this.theme = localStorage.getItem("theme")
    
  }

  ionViewDidLoad(){
    this.scoreChart()
  }
  theme: string

  scoreChart() {
    Highcharts.chart('container', {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Vocabulary Average Scores'
      },
      subtitle: {
        text: 'Source: This is a Dummy Data.'
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
        title: {
          text: 'Score %'
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: false
        }
      },
      series: [{
        name: 'Scored Vocab',
        data: [47.0, 46.9, 49.5, 54.5, 58.4, 71.5, 75.2, 76.5, 73.3, 68.3, 63.9, 59.6]
      }, {
        name: 'Scored Vocab with Error',
        data: [43.9, 44.2, 45.7, 48.5, 51.9, 55.2, 67.0, 66.6, 64.2, 50.3,56.6, 54.8]
      }]
    });
  }


}
