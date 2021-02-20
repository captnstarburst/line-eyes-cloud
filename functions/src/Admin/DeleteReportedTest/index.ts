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

        const fileData = await admin.firestore().doc("UploadedTests/" + data.docId)
            .get()
            .then((doc) => {
                const docData = doc.data()
                if (!docData) throw new Error("missing UploadedTests doc")

                return ({ file: docData.file_name, uid: docData.uploaded_by, outcome: true })
            })
            .catch((err) => {
                Logger("error", err)

                return ({ file: "", uid: "", outcome: false })
            })

        if (!fileData.outcome) {
            return ({
                outcome: false,
                message: "Something unexpected has happened. Please try again later " + Date.now(),
                errorLog: "filename is missing",
            })
        }


        const bucket = admin.storage().bucket();
        const path = "Tests/" + fileData.uid + "/" + fileData.file

        const ogFile = fileData.file.split('_')
        const ogPath = "Tests/" + fileData.uid + "/" + ogFile

        return bucket.file(path).delete()
            .then(() => {
                return bucket.file(ogPath).delete()
            })
            .then(() => {
                return ({
                    outcome: true,
                })
            })
            .catch((err) => {
                return ({
                    outcome: false,
                    message: "Something unexpected has happened. Please try again later " + Date.now(),
                    errorLog: "Delete unsuccessful",
                })
            })
    })