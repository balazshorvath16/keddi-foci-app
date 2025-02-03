
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp();

// exports.handleEventUpdateNotifications = functions.firestore
//   .document('events/{eventId}')
//   .onUpdate(async (change, context) => {
//     const beforeData = change.before.data();
//     const afterData = change.after.data();

//     if (beforeData.participants.length < beforeData.maxCapacity &&
//         afterData.participants.length >= afterData.maxCapacity) {
//       const fullPayload = {
//         notification: {
//           title: 'Esemény betelt!',
//           body: 'Az esemény már betelt, a várólista folyamatban van.'
//         }
//       };

//       try {
//         const response = await admin.messaging().sendToTopic('events', fullPayload);
//         console.log('Full event notification sent:', response);
//       } catch (error) {
//         console.error('Error sending full event notification:', error);
//       }
//     }
//     if (beforeData.waitlist && afterData.waitlist && 
//         beforeData.waitlist.length > afterData.waitlist.length) {
//       const promotedPayload = {
//         notification: {
//           title: 'Helyed felszabadult!',
//           body: 'Egy várólista tagja bekerült az eseménybe, most már részt vehetsz!'
//         }
//       };

//       try {
//         const response = await admin.messaging().sendToTopic('events', promotedPayload);
//         console.log('Waitlist promotion notification sent:', response);
//       } catch (error) {
//         console.error('Error sending waitlist promotion notification:', error);
//       }
//     }
//   });
