const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
let { User } = require('../models/models.js');
const UserService = require('../service/userService.js');
const {validationResult} = require('express-validator');


const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' },
    );
};

class UserController {
    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await UserService.login(email, password);
            res.cookie('refresh_token', userData.refresh_token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {username, email, password } = req.body;
            const userData = await UserService.registration(username, email, password);
            res.cookie('refresh_token', userData.refresh_token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            const { refresh_token } = req.cookies;
            const token = await UserService.logout(refresh_token);
            res.clearCookie('refresh_token');
            return res.json(token);
        } catch (err) {
            next(err);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refresh_token } = req.cookies;
            const userData = await UserService.refresh(refresh_token);
            res.cookie('refresh_token', userData.refresh_token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (err) {
            next(err);
        }
    }

    async getUser(req, res, next) {
        try {
            const {id} = req.query;
            if (!id) {
                throw ApiError.BadRequest('Id не указан');
            }
            const user = await UserService.getUser(id);
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UserController();