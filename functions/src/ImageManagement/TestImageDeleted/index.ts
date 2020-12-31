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
