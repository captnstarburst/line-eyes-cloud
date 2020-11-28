import * as functions from 'firebase-functions';

const Logger = (type: string, message: string) => {
    switch (type) {
        case "error":
            functions.logger.error(message, { structuredData: true });
            break;
        case "info":
            functions.logger.info(message, { structuredData: true });
            break;
        case "warn":
            functions.logger.warn(message, { structuredData: true });
            break;
        case "debug":
            functions.logger.debug(message, { structuredData: true })
        default:
            functions.logger.log(message);
            break;
    }
};

export default Logger
