import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import Logger from '../../functions/Log'

export const listener =
    functions.auth.user().onCreate((user: any) => {
        return admin.firestore().doc('Users/' + user.uid + "/Role/Role")
            .set({
                role: "User",
            })
            .catch((err) => {
                Logger("error", err)
            })
    })