import * as admin from 'firebase-admin'
const firebase_tools = require('firebase-tools');
import * as functions from 'firebase-functions'
import Logger from '../../functions/Log'



export const listener =
    functions.storage.object().onDelete(async (object) => {

        if (!object.name) {
            Logger("error", "Deleted object is missing name: " + object)
            return
        }

        const nameArr = object.name.split('/');

        if (nameArr[0] !== "Tests") {
            Logger("info", "deleted file is not in the Tests folder: " + object.name);
            return
        }

        if (!nameArr[2].includes('500x500')) {
            Logger("info", "deleted file is the original: " + object.name);
            return
        }


        const docId = await admin.firestore().collection("UploadedTests")
            .where("file_name", "==", nameArr[2])
            .get()
            .then((querySnapshot) => {
                let id: string = ""
                querySnapshot.forEach(function (doc) {
                    id = doc.id
                });

                return id
            })
            .catch((error) => {
                Logger("error", error);
                return false
            });

        if (!docId) return



        const path = "UploadedTests/" + docId

        try {
            await admin.firestore()
                .doc(path)
                .get()
                .then((doc) => {
                    const docData = doc.data()
                    if (!docData) throw new Error("doc is missing data")

                    return docData.uploaded_by
                })
                .then(async (uid) => {
                    await admin.firestore()
                        .doc("Stats/" + uid)
                        .update({ uploaded_tests: admin.firestore.FieldValue.increment(-1) })
                })
        } catch (err) {
            Logger("warn", err)
        }


        await firebase_tools.firestore
            .delete(path, {
                project: process.env.GCLOUD_PROJECT,
                recursive: true,
                yes: true,
                token: functions.config().fb.token,
            })
            .then(() => {
                Logger("info", "Deleted path successful : " + path)
            })
            .catch((err: any) => {
                Logger("error", err)
            })

        return {
            path: path,
        };

    });
