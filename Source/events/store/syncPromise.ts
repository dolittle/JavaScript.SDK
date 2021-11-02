/* eslint-disable header/header */

// This is a TS adjusted version of this: https://github.com/Yukaii/synchronized-promise/blob/master/lib/index.js

/* 10 seconds */
const DEFAULT_TIMEOUTS = 10 * 1000;

const STATE = {
    INITIAL: 'INITIAL',
    RESOLVED: 'RESOLVED',
    REJECTED: 'REJECTED'
};

const DEFAULT_TICK = 100;

/**
 * @param {Function} func Promise-base function that want to be transformed
 * @param {Object} options Additional options
 * @param {number} options.timeouts Function call timeouts
 * @param {number} options.tick deasync tick, default to 100
 * @returns {Function}
 */
export function syncPromise(thisArg: any, func: Function, options: any = {}) {
    return (...args: any[]) => {
        let promiseError, promiseValue;
        let promiseStatus = STATE.INITIAL;
        const timeouts = options.timeouts || DEFAULT_TIMEOUTS;
        const tick = options.tick || DEFAULT_TICK;

        func.apply(thisArg, args).then((value: any) => {
            promiseValue = value;
            promiseStatus = STATE.RESOLVED;
        }).catch((e: any) => {
            promiseError = e;
            promiseStatus = STATE.REJECTED;
        });

        const waitUntil = new Date(new Date().getTime() + timeouts);
        while ((waitUntil > new Date()) && promiseStatus === STATE.INITIAL) {
            require('deasync').sleep(tick);
        }

        if (promiseStatus === STATE.RESOLVED) {
            return promiseValue;
        } else if (promiseStatus === STATE.REJECTED) {
            throw promiseError;
        } else {
            throw new Error(`${func.name} called timeout`);
        }
    };
}

