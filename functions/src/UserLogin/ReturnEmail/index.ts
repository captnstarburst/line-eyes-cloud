"use strict"
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import Logger from '../../functions/Log'

export const listener =
    functions.https.onCall(async (data: any, context: any) => {
        if (data === null) {
            Logger("warn", "No Data Passed. Expected data.display_name received null")

            return ({
                outcome: false,
                message: "Something unexpected has happened. Please try again later " + Date.now(),
                errorLog: "Data is missing : " + data,
            })
        }

        if (!data.display_name) {
            Logger("warn", "No Data Passed. Expected data.display_name received: " + data.display_name)
            return ({
                outcome: false,
                message: "Something unexpected has happened. Please try again later " + Date.now(),
                errorLog: "Data is missing : " + data,
            })
        }

        const emailFromFirestore = await admin.firestore()
            .collection("Emails")
            .where("display_name", "==", data.display_name)
            .get()
            .then((snapshot) => {
                let email: string = ""
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    email = "";
                }

                snapshot.forEach(doc => {
                    email = doc.data().email;
                });

                return email
            })
            .catch((err) => {
                Logger("error", err)
            })

        return emailFromFirestore;
    })