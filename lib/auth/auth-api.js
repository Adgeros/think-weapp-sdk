'use strict';

const config = require('../config');
const constants = require('./constants');
const AuthAPIError = require('./auth-api-error');
const jscode2session = require('../helper/jscode2session');
const uuid = require('../helper/uuid');

const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;

module.exports = {
    login: async (code, encrypt_data, iv) => {
        const session = await jscode2session.getSessionKey(code);
        const data = await jscode2session.decrypt(session.sessionKey, encrypt_data, iv);
        const redis = config.getRedis();
        const token = uuid();
        const value = JSON.stringify(data);
        await redis.set(token, value, 'PX', ONE_MONTH);

        return {
            id: token,
            skey: 'bravo',
            user_info: data,
        };
    },

    checkLogin: async (id, skey) => {
        if (skey !== 'bravo') {
            throw new AuthAPIError(constants.RETURN_CODE_WX_SESSION_FAILED, constants.ERR_LOGIN_FAILED);
        }
        const redis = config.getRedis();
        const res = await redis.get(id);
        const value = res ? JSON.parse(res) : null;
        return {user_info: value};
    },

};
