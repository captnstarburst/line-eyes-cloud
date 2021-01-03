import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as roleDoc from './UserCreation/RoleDoc'
import * as statDoc from './UserCreation/StatDoc'
import * as returnEmail from './UserLogin/ReturnEmail'
import * as changeDisplayName from './UserManagement/ChangeDisplayName'
import * as testImageDeleted from './ImageManagement/TestImageDeleted'
import * as testImageUploaded from './ImageManagement/TestImageUploaded'
import * as reportImage from './ImageManagement/ReportImage'
import * as userVoted from './Votes/UserVoted'
import * as userUndoVote from './Votes/UserUndoVote'

admin.initializeApp()

export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

export const RoleDocCreation = roleDoc.listener

export const StatDocCreation = statDoc.listener

export const ReturnEmail = returnEmail.listener

export const ChangeDisplayName = changeDisplayName.listener

export const TestImageDeleted = testImageDeleted.listener

export const TestImageUploaded = testImageUploaded.listener

export const ReportImage = reportImage.listener

export const UserVoted = userVoted.listener

export const UserUndoVote = userUndoVote.listener