"use strict"
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import Logger from '../../functions/Log'

export const listener =
    functions.https.onCall(async (data: any, context: any) => {
        if (data === null) {
            Logger("warn", "No Data Passed. Expected data docId, received null")

            return ({
                outcome: false,
                message: "Something unexpected has happened. Please try again later " + Date.now(),
                errorLog: "Data is missing : " + data,
            })
        }

        if (!data.docId) {
            Logger("warn", "DocId is missing, received " + data.docId)

            return ({
                outcome: false,
                message: "Something unexpected has happened. Please try again later " + Date.now(),
                errorLog: "Data is missing : " + data,
            })
        }

        return admin.firestore().doc("UploadedTests/" + data.docId)
            .update({ reported: true })
            .then(() => {
                return ({
                    outcome: true,
                })
            })
            .catch((err) => {
                Logger("err", err)

                return ({
                    outcome: false,
                    message: "Something unexpected has happened. Please try again later " + Date.now(),
                    errorLog: "error updating field : " + data,
                })
            })
    })