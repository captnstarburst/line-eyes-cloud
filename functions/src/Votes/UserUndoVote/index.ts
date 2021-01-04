"use strict"
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import Logger from '../../functions/Log'
const firebase_tools = require('firebase-tools');

export const listener =
    functions.firestore.document('/UploadedTests/{uuid}/responses/{uid}')
        .onDelete(async (snap: any, context: any) => {
            return admin.firestore()
                .doc("UploadedTests/" + context.params.uuid)
                .update({ [snap.data().response + "s"]: admin.firestore.FieldValue.increment(-1) })
                .then(async () => {
                    await admin.firestore()
                        .doc("Stats/" + context.params.uid)
                        .update({ reviewed_tests: admin.firestore.FieldValue.increment(-1) })
                })
                .then(async () => {

                    const path = "ActivityFeed/" + context.params.uid + "/" + "History/" + context.params.uuid
                    await firebase_tools.firestore
                        .delete(path, {
                            project: process.env.GCLOUD_PROJECT,
                            recursive: false,
                            yes: true,
                            token: functions.config().fb.token,
                        })
                        .catch((err: any) => {
                            Logger("info", err)
                        })
                })
                .catch((err) => {
                    Logger("err", err)
                })
        })