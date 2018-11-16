"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.newSubscriberNotification = functions.firestore
    .document('subscribers/{subsciptionId}')
    .onCreate((event) => __awaiter(this, void 0, void 0, function* () {
    const data = event.data();
    const userId = data.userId;
    const subscriber = data.subscriberId;
    const payload = {
        notification: {
            title: 'New Subscriber',
            body: '${subscriber} is following your content',
            icon: 'https://goo.gl/Fz9nrQ'
        }
    };
    // ref to the parent document
    const db = admin.firestore();
    const deviceRef = db.collection('devices').where('userId', '==', userId);
    // get users tokens and send notification
    const devices = yield deviceRef.get();
    const tokens = [];
    //loop over docs
    devices.forEach(result => {
        const token = result.data().token;
        tokens.push(token);
    });
    //send notifications
    return admin.messaging().sendToDevice(tokens, payload);
}));
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//# sourceMappingURL=index.js.map