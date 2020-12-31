import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as roleDoc from './UserCreation/RoleDoc'
import * as returnEmail from './UserLogin/ReturnEmail'
import * as changeDisplayName from './UserManagement/ChangeDisplayName'
import * as testImageDeleted from './ImageManagement/TestImageDeleted'

admin.initializeApp()

export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

export const RoleDocCreation = roleDoc.listener

export const ReturnEmail = returnEmail.listener

export const ChangeDisplayName = changeDisplayName.listener

export const TestImageDeleted = testImageDeleted.listener