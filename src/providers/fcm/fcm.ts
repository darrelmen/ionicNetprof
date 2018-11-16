// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { AngularFirestore } from 'angularfire2/firestore';
// import { Platform } from 'ionic-angular/umd';
// import { Firebase } from '@ionic-native/firebase'
// /*
//   Generated class for the FcmProvider provider.
//  Messaging
//   See https://angular.io/guide/dependency-injection for more info on providers
//   and Angular DI.
// */
// @Injectable()
// export class FcmProvider {

//   constructor(public http: HttpClient,
//     public firebaseNative: Firebase,
//     public afs: AngularFirestore,
//     public platform: Platform
//   ) {

//   }
//   async getToken() {
//     let token;
//     if (this.platform.is('android')) {
//       token = await this.firebaseNative.getToken()
//     }

//     if (this.platform.is('ios')) {
//       token = await this.firebaseNative.getToken()
//       const perm = await this.firebaseNative.grantPermission();

//     }
//     return this.saveTokentoFirestore(token)
//   }

//   private saveTokentoFirestore(token) {
//     if (!token) return
//     const devicesRef = this.afs.collection('devices')
//     const docData = {
//       token,
//       userId: 'testUser',

//     }
//     return devicesRef.doc(token).set(docData)
//   }
  
//   listenToNotifications() {
//     return this.firebaseNative.onNotificationOpen()
//   }

// }
