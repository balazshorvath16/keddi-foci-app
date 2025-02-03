/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

  // functions/index.js
  const functions = require('firebase-functions');
  const admin = require('firebase-admin');
  admin.initializeApp();
  
  // Trigger, ha új esemény jön létre az "events" kollekcióban
  exports.handleEventUpdateNotifications = functions.firestore
    .document('events/{eventId}')
    .onUpdate(async (change, context) => {
      const beforeData = change.before.data();
      const afterData = change.after.data();
  
      // 1. Esemény megtelt: Ha korábban a résztvevők száma kevesebb volt, most pedig elérte vagy meghaladta a maxCapacity-t
      if (beforeData.participants.length < beforeData.maxCapacity &&
          afterData.participants.length >= afterData.maxCapacity) {
        const fullPayload = {
          notification: {
            title: 'Esemény betelt!',
            body: 'Az esemény már betelt, a várólista folyamatban van.'
          }
        };
  
        try {
          const response = await admin.messaging().sendToTopic('events', fullPayload);
          console.log('Full event notification sent:', response);
        } catch (error) {
          console.error('Error sending full event notification:', error);
        }
      }
      if (beforeData.waitlist && afterData.waitlist && 
          beforeData.waitlist.length > afterData.waitlist.length) {
        const promotedPayload = {
          notification: {
            title: 'Helyed felszabadult!',
            body: 'Egy várólista tagja bekerült az eseménybe, most már részt vehetsz!'
          }
        };
  
        try {
          const response = await admin.messaging().sendToTopic('events', promotedPayload);
          console.log('Waitlist promotion notification sent:', response);
        } catch (error) {
          console.error('Error sending waitlist promotion notification:', error);
        }
      }
    });
  