import { LoadingController, AlertController, ActionSheetController, ToastController, Platform, DateTime } from 'ionic-angular'
import { Injectable } from '@angular/core'
import { EmailComposer } from '@ionic-native/email-composer';
import { File } from '@ionic-native/file';

//import 'js2excel/json2excel';

@Injectable()
export class CommonUtils {
  constructor(
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private emailComposer: EmailComposer,
    private file: File,
    private platform: Platform

  ) { }


  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }

  presentLoadingCustom() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box"></div>
      </div>`,
      duration: 3000
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    loading.present();
  }

  //text ony
  presentLoadingText() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading Please Wait...'
    });

    loading.present();

    //   setTimeout(() => {
    //     this.nav.push(Page2);
    //   }, 1000);

    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }

  showInvalidUserPassword(err?, user?) {
    let alert = this.alertCtrl.create({
      title: err,
      subTitle: 'Invalid Username/Password. Please try again.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            console.log("pass invalid")
          }
        }]
    });
    alert.present();
  }


  showAlert(user?, title?: string, subTitle?: string) {
    let alert = this.alertCtrl.create({
      title: title  // + user.value
      ,
      subTitle: subTitle,
      buttons: [
        {
          text: 'Ok',
          handler: () => {

          }
        }]
    });
    alert.present();
  }

  statusActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select your Status',
      buttons: [
        {
          text: 'Student',
          handler: () => {
            console.log('student clicked');
          }
        },
        {
          text: 'Teacher',
          handler: () => {
            console.log('teacher clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }
  fixJsonString(str) {
    str.replace(/\\n/g, "\\n")
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f");
    // remove non-printable and other non-valid JSON chars
    str = str.replace(/[\u0000-\u0019]+/g, "");

  }
  //  close() {
  //     this.viewCtrl.dismiss();
  //   }

  //     popOver(myEvent) {
  //     let popover = this.popoverCtrl.create("test");
  //     popover.present({
  //       ev: myEvent
  //     });
  //   }

  // add and remove item from an array
  addItem(array, value) {
    if (array.indexOf(value) === -1) {
      //  value.isAddPlayList=true
      array.push(value);
    }
  }

  removeItem(array, value) {
    var index = array.indexOf(value);
    if (index !== -1) {
      //  value.isAddPlayList=false
      array.splice(index, 1);
    }
  }
  presentToast(message, duration) {

    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'middle',
      cssClass: "background-color: #488aff"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  randomizeItems(rawAnswers: any[]): any[] {
    for (let i = rawAnswers.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = rawAnswers[i];
      rawAnswers[i] = rawAnswers[j];
      rawAnswers[j] = temp;
    }
    return rawAnswers;
  }

  sendEmail(data: any) {
    var itemsFormatted = [];
    if (data.quizType == "mixmatch") {
      data.body.forEach(item => {

        itemsFormatted.push({
          id: item.id,  // remove commas to avoid errors
          fl: item.fl,
          en: item.en,
          ct: item.ct.replace(/,/g, ''), // remove commas to avoid errors,
          lesson: item.lesson,
          lessonId: item.lessonId,
          sublesson: item.sublesson,
          sublessonId: item.sublessonId,
          topic: item.Topic,
          subtopic: item.subtopic,
          Grammar: item.Grammar
        })
      });
    } else {
      data.body.forEach(item1 => {

        itemsFormatted.push({
          id: item1.item.id,  // remove commas to avoid errors
          fl: item1.item.fl,
          en: item1.item.en,
          ct: item1.item.ct.replace(/,/g, ''), // remove commas to avoid errors,
          lesson: item1.item.lesson,
          lessonId: item1.item.lessonId,
          sublesson: item1.item.sublesson,
          sublessonId: item1.item.sublessonId,
          topic: item1.item.Topic,
          subtopic: item1.item.subtopic,
          Grammar: item1.item.Grammar
        })
      });
    }
    var headers = {
      id: 'id',  // remove commas to avoid errors
      fl: 'FLang',
      en: 'English',
      ct: 'Context',
      lesson: 'Lesson',
      lessonId: 'LessonId',
      sublesson: 'Sublesson',
      sublessonId: 'SublessonId',
      topic: 'Topic',
      subtopic: 'Subtopic',
      Grammar: 'Grammar'
    };
    let fileName
    let dte: Date
    dte = new Date()

    if (data.subject == "" || data.subject == null) {
      fileName = data.username + "_" + data.siteName + "_" + dte.getFullYear() + (dte.getMonth() + 1) + dte.getDate() + '.csv' || 'export.csv';
    } else {
      fileName = data.username + "_" + data.siteName + "_" + data.subject + "_" + dte.getFullYear() + (dte.getMonth() + 1) + dte.getDate() + '.csv' || 'export.csv';
    }
    console.log("fileName " + data.username + "_" + data.siteName + " leng " + itemsFormatted.length)
    this.exportCSVFile(headers, itemsFormatted, fileName, data); // call the exportCSVFile() function to process the JSON and trigger the download
  }

  csvFile
  private exportCSVFile(headers, items, exportedFilename, data) {
    if (headers) {
      items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);
    var csv = this.convertToCSV(jsonObject);
    // var exportedFilename = fileTitle + '.csv' || 'export.csv';
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let dir = ''
    if (this.platform.is('ios')) {
      dir = this.file.dataDirectory
    } else {
      dir = this.file.externalDataDirectory
    }
    console.log("dir " + dir + exportedFilename)
    this.file.checkDir(dir, data.siteName).then((isExist) => {

      this.file.writeFile(dir + data.siteName + "/", exportedFilename, blob, { replace: true }).then(() => {
        this.file.resolveLocalFilesystemUrl(dir + data.siteName + "/" + exportedFilename).then((fe) => {
          this.csvFile = fe.toURL()

          //send mail
          this.emailComposer.isAvailable().then((available: boolean) => {
            if (available) {
              //Now we know we can send
            }
          })

          let email = {
            to: data.email,
            attachments: [this.csvFile],
            subject: data.siteName + " " + data.subject + " list.",
            body: 'Hi ' + data.username + ', your score is ' + data.score + ' of ' + data.body.length,
            isHtml: data.html
          };

          //  Send a text message using default options
          this.emailComposer.open(email);

        })
      })
    }).catch(() => {
      this.file.createDir(dir, data.siteName, false).then((val) => {
        this.file.writeFile(dir + data.siteName + "/", exportedFilename, blob, { replace: true }).then(() => {
          this.file.resolveLocalFilesystemUrl(dir + data.siteName + "/" + exportedFilename).then((fe) => {
            this.csvFile = fe.toURL()

            //send mail
            this.emailComposer.isAvailable().then((available: boolean) => {
              if (available) {
                //Now we know we can send
              }
            })
            if(data.subject==null) data.subject=''
            let email = {
              to: data.email,
              attachments: [this.csvFile],
              subject: data.siteName + " " + data.subject + " list.",
              body: 'Hi ' + data.username + ' , your score is ' + data.score + ' of ' + data.body.length + ".",
              isHtml: data.html
            };

            //  Send a text message using default options
            this.emailComposer.open(email);
          })
        })
      })
    })
    console.log("write success ")

  }

  private convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
  }


  sendEmailFeedback(data) { //send mail
    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        //Now we know we can send
      }
    })

    let email = {
      to: data.email,
      subject: data.subject,
      body: data.body,
      isHtml: data.html
    };

    //  Send a text message using default options
    this.emailComposer.open(email);

  }
}