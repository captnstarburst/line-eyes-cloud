"use strict"
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import Logger from '../../functions/Log'

export const listener = functions.firestore.document("DisplayNames/{uid}")
    .onUpdate(async (change, context) => {
        const newValue = change.after.data()
        const uid = context.params.uid

        const emailsRef = admin.firestore().doc("Emails/" + uid);
        const userRef = admin.firestore().doc("Users/" + uid);

        await emailsRef
            .update({
                display_name: newValue.display_name,
            })
            .catch((err) => {
                Logger("Error", err);
            })

        await userRef
            .update({
                display_name: newValue.display_name,
            })
            .catch((err) => {
                Logger("Error", err);
            })

        return
    })