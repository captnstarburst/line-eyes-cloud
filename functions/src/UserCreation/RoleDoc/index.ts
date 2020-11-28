import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

export const listener =
    functions.auth.user().onCreate((user: any) => {
        return admin.firestore().doc('Users/' + user.uid + "/Role/Role")
            .set({
                role: "User",
            });
    })