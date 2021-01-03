import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import Logger from '../../functions/Log'

export const listener =
    functions.auth.user().onCreate((user: any) => {
        return admin.firestore().doc('Stats/' + user.uid)
            .set({
                reviewed_tests: 0,
                uploaded_tests: 0,
            })
            .catch((err) => {
                Logger("error", err)
            })
    })