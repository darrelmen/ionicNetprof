import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase)

exports.newSubscriberNotification=functions.firestore
    .document('subscribers/{subsciptionId}')
    .onCreate(async event => {

        const data =event.data()
        const userId=data.userId
        const subscriber =data.subscriberId
        const payload= {
            notification: {
                title: 'New Subscriber',
                body: '${subscriber} is following your content',
                icon: 'https://goo.gl/Fz9nrQ'
            }
        }
    

        // ref to the parent document

        const db=admin.firestore()
        const deviceRef=db.collection('devices').where('userId','==',userId)

        // get users tokens and send notification
        const devices =await deviceRef.get()
        const tokens =[]

        //loop over docs
        devices.forEach(result =>{
            const token = result.data().token;
            tokens.push(token)
        })

        //send notifications
        return admin.messaging().sendToDevice(tokens,payload)
    })


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });






