import { LoadingController, AlertController, ActionSheetController, ToastController } from 'ionic-angular'
import { Injectable } from '@angular/core'

@Injectable()
export class CommonUtils {
  constructor(
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController

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

}