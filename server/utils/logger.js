/**
 * Simple Logger Utility for the application
 * Provides structured logging with different levels
 */

const logger = {
    info: (message, meta = {}) => {
        const timestamp = new Date().toISOString();
        const logEntry = {
            level: 'INFO',
            timestamp,
            message,
            ...meta
        };
        console.log(JSON.stringify(logEntry));
    },

    warn: (message, meta = {}) => {
        const timestamp = new Date().toISOString();
        const logEntry = {
            level: 'WARN',
            timestamp,
            message,
            ...meta
        };
        console.warn(JSON.stringify(logEntry));
    },

    error: (message, meta = {}) => {
        const timestamp = new Date().toISOString();
        const logEntry = {
            level: 'ERROR',
            timestamp,
            message,
            ...meta
        };
        console.error(JSON.stringify(logEntry));
    },

    debug: (message, meta = {}) => {
        if (process.env.NODE_ENV === 'development') {
            const timestamp = new Date().toISOString();
            const logEntry = {
                level: 'DEBUG',
                timestamp,
                message,
                ...meta
            };
            console.debug(JSON.stringify(logEntry));
        }
    }
};

module.exports = logger;