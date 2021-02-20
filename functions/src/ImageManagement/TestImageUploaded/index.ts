"use strict"
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import Logger from '../../functions/Log'

export const listener =
    functions.https.onCall(async (data: any, context: any) => {
        if (data === null) {
            Logger("warn", "No Data Passed. Expected data.uuid, data.tags, data.uid, data.url received null")

            return ({
                outcome: false,
                message: "Something unexpected has happened. Please try again later " + Date.now(),
                errorLog: "Data is missing : " + data,
            })
        }

        if (!data.uuid) {
            Logger("warn", "Missing Data. Expected data.uuid received: " + data.uuid)
            return ({
                outcome: false,
                message: "Something unexpected has happened. Please try again later " + Date.now(),
                errorLog: "uuid is missing : " + data,
            })
        }

        if (!data.tags) {
            Logger("warn", "Missing Data. Expected data.tags received: " + data.tags)
            return ({
                outcome: false,
                message: "Something unexpected has happened. Please try again later " + Date.now(),
                errorLog: "Tags are missing : " + data,
            })
        }

        if (!data.uid) {
            Logger("warn", "Missing Data. Expected data.uid received: " + data.uid)
            return ({
                outcome: false,
                message: "Something unexpected has happened. Please try again later " + Date.now(),
                errorLog: "UID is missing : " + data,
            })
        }

        if (!data.url) {
            Logger("warn", "Missing Data. Expected data.url received: " + data.url)
            return ({
                outcome: false,
                message: "Something unexpected has happened. Please try again later " + Date.now(),
                errorLog: "url is missing : " + data,
            })
        }

        return admin.firestore().collection("UploadedTests/")
            .add({
                file_name: data.uuid + "_500x500",
                invalids: 0,
                negatives: 0,
                positives: 0,
                reported: false,
                tags: data.tags,
                uploaded: admin.firestore.FieldValue.serverTimestamp(),
                uploaded_by: data.uid,
                url: data.url,
            })
            .then(async (doc: any) => {
                await admin.firestore()
                    .doc("Stats/" + data.uid)
                    .update({ uploaded_tests: admin.firestore.FieldValue.increment(1) })
                return doc
            })
            .then((doc: any) => {
                Logger("info", "UploadedTests document created, " + doc.id)
                return ({
                    outcome: true,
                })
            })
            .catch((err) => {
                Logger("err", err)
                return ({
                    outcome: true,
                })
            })
    })
