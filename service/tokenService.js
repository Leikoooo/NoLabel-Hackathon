const jwt = require('jsonwebtoken');
const {Token} = require('../models/models');

class TokenService {
    generateTokens(payload) {
        const access_token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30m'})
        return {
            access_token,
            refresh_token
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(user_id, refresh_token) {
        const tokenData = await Token.findOne({user_id})
        if (tokenData) {
            tokenData.refresh_token = refresh_token;
            return tokenData.save();
        }
        const token = await Token.create({user_id, refresh_token})
        return token;
    }

    async removeToken(refresh_token) {
        const tokenData = await Token.destroy({where: {refresh_token}})
        return tokenData;
    }

    async findToken(refresh_token) {
        const tokenData = await Token.findOne({refresh_token});
        return tokenData;
    }
}

module.exports = new TokenService();