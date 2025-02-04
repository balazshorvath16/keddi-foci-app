// functions/index.js
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { logger } = require('firebase-functions');
const admin = require('firebase-admin');
const mailchimp = require('@mailchimp/mailchimp_marketing');
admin.initializeApp();

mailchimp.setConfig({
  apiKey: '00b69c3e6b2d24f22f74695435ca31f4',
  server: 'us12' // például 'us1'
});

// Segédfüggvény: E-mail küldése Mailchimp API-val
async function sendMailchimpEmail(subject, message) {
  try {
    const campaignResponse = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: { list_id: '967eb178c2' }, // Az email lista ID-ja
      settings: {
        subject_line: subject,
        title: subject,
        from_name: 'Keddi Foci App',
        reply_to: 'balazs.horvath1313@gmail.com',
      },
    });

    // Kampány tartalmának beállítása
    await mailchimp.campaigns.setContent(campaignResponse.id, {
      html: `<p>${message}</p>`,
    });

    // Kampány elküldése
    const sendResponse = await mailchimp.campaigns.send(campaignResponse.id);
    return sendResponse;
  } catch (error) {
    throw new Error('Mailchimp email send error: ' + error.message);
  }
}

// Firestore trigger: Új esemény létrejötte (Esemény létrehozása)
exports.sendEventCreatedEmail = onDocumentCreated('events/{eventId}', async (snap, context) => {
  const eventData = snap.data();
  const subject = 'Új esemény érkezett!';
  const message = `Új focis esemény: ${eventData.location} - ${eventData.eventDate} ${eventData.eventTime}`;

  try {
    const response = await sendMailchimpEmail(subject, message);
    logger.info('E-mail sikeresen elküldve:', response);
  } catch (error) {
    logger.error('Hiba az e-mail küldésénél:', error);
  }
});

// Firestore trigger: Esemény betelt / Várólista promóció (Esemény betöltés és várólista kezelés)
exports.sendEventUpdateNotifications = onDocumentCreated('events/{eventId}', async (snap, context) => {
  const eventData = snap.data();

  // Esemény betelt, értesítés küldése
  if (eventData.participants.length >= eventData.maxCapacity) {
    const fullPayload = {
      notification: {
        title: 'Esemény betelt!',
        body: 'Az esemény már betelt, a várólista folyamatban van.',
      },
    };
    try {
      const response = await admin.messaging().sendToTopic('events', fullPayload);
      logger.info('Full event notification sent:', response);
    } catch (error) {
      logger.error('Error sending full event notification:', error);
    }
  }

  // Várólista promóció, értesítés küldése
  if (eventData.waitlist && eventData.waitlist.length > 0) {
    const promotedPayload = {
      notification: {
        title: 'Helyed felszabadult!',
        body: 'Valaki visszamondta az eseményt, most már részt vehetsz rajta!',
      },
    };
    try {
      const response = await admin.messaging().sendToTopic('events', promotedPayload);
      logger.info('Waitlist promotion notification sent:', response);
    } catch (error) {
      logger.error('Error sending waitlist promotion notification:', error);
    }
  }
});
