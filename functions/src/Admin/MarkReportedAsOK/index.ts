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

        if (context === null) {
            Logger("warn", "context is null. Expected context, received null")

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

        const role = await admin.firestore().doc("Users/" + context.auth.uid + "/Role/Role")
            .get()
            .then((doc) => {
                const docData = doc.data();

                if (!docData) throw new Error("missing role data for user: " + context.auth.uid)

                return docData.role
            })
            .catch((err) => {
                Logger("error", err)

                return (false)
            })

        if (!role || role !== "Admin") {
            return ({
                outcome: false,
                message: "Something unexpected has happened. Please try again later " + Date.now(),
                errorLog: "User role is not Admin : " + role,
            })
        }


        return admin.firestore().doc("UploadedTests/" + data.docId)
            .update({ reported: false })
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