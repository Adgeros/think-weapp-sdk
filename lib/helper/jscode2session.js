'use strict';

const config = require('../config');
const promisify = require('es6-promisify');
const send = promisify(require('request').get, {multiArgs: true});
const WXBizDataCrypt = require('./WXBizDataCrypt');

const _buildUrl = jscode => {
    const apiUrl = 'https://api.weixin.qq.com/sns/jscode2session';
    const appId = config.getAppId();
    const appSecret = config.getAppSecret();
    const params = `?appid=${appId}&secret=${appSecret}&js_code=${jscode}&grant_type=authorization_code`;
    return `${apiUrl}${params}`;
};

// 获取解密SessionKey
const getSessionKey = async code => {
    try {
        const requestUrl = _buildUrl(code);
        const [response, body] = await send({url: requestUrl, json: true});

        // body: { session_key, expires_in, openid }
        if ('session_key' in body) {
            return {sessionKey: body.session_key, openId: body.openid};
        }

        throw new Error('jscode failed to exchange session_key');

    } catch (error) {
        throw error;
    }
};


// 解密
const decrypt = async (sessionKey, encryptedData, iv) => {
    try {
        const appId = config.getAppId();
        const pc = new WXBizDataCrypt(appId, sessionKey);
        return pc.decryptData(encryptedData, iv);
    } catch (e) {
        console.log(e);
        return {
            code: 1,
            msg: e,
        };
    }
};

module.exports = {
    getSessionKey,
    decrypt,
};
