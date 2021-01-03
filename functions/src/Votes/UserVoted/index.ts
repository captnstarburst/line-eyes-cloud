"use strict"
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import Logger from '../../functions/Log'

export const listener =
    functions.firestore.document('/UploadedTests/{uuid}/responses/{uid}')
        .onCreate(async (snap: any, context: any) => {
            return admin.firestore()
                .doc("UploadedTests/" + context.params.uuid)
                .update({ [snap.data().response + "s"]: admin.firestore.FieldValue.increment(1) })
                .then(async () => {
                    await admin.firestore()
                        .doc("Stats/" + context.params.uid)
                        .update({ reviewed_tests: admin.firestore.FieldValue.increment(1) })
                })
                .catch((err) => {
                    Logger("err", err)
                })
        })